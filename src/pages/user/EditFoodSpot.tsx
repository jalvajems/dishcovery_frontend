import { useEffect, useState } from "react";
import {
  Upload,
  Plus,
  X,
  MapPin,
  Clock,
  Tag,
  Star,
  Camera,
  Save,
  Loader2,
  DollarSign,
  Utensils,
  Image as ImageIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import MapLocationPicker from "@/utils/MapLocationPicker";
import {
  editFoodSpotApi,
  getFoodSpotDetailApi
} from "@/api/foodieApi";
import { showSuccess } from "@/utils/toast";
import { getErrorMessage } from "@/utils/errorHandler";
import { useAwsS3Upload } from "@/hooks/useAwsS3Upload";
import FoodieNavbar from "@/components/shared/foodie/Navbar.foodie";

import type { IFoodSpot } from "@/types/foodSpot.types";

interface FoodItem {
  name: string;
  price: string;
  image: string;
  s3Key?: string;
}

interface LocationData {
  lat: number;
  lng: number;
  placeName: string;
  city: string;
  state: string;
  country: string;
  fullAddress: string;
}

interface FormErrors {
  name?: string;
  coverImage?: string;
  location?: string;
  openingOpen?: string;
  openingClose?: string;
  foods?: { name?: string; price?: string }[];
}

const FieldError = ({ msg }: { msg?: string }) =>
  msg ? (
    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
      <span>⚠</span> {msg}
    </p>
  ) : null;

export default function EditFoodSpot() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { uploadToS3, loading: uploadLoading } = useAwsS3Upload();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [form, setForm] = useState({
    name: "",
    description: "",
    speciality: "",
    tags: "",
    openingOpen: "",
    openingClose: "",
  });

  const [coverImage, setCoverImage] = useState("");
  const [coverImageKey, setCoverImageKey] = useState("");
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [location, setLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchFoodSpot = async () => {
      try {
        const res = await getFoodSpotDetailApi(id);
        const data: IFoodSpot = res.data.data || res.data;

        setForm({
          name: data.name,
          description: data.description,
          speciality: Array.isArray(data.speciality) ? data.speciality.join(", ") : data.speciality,
          tags: Array.isArray(data.tags) ? data.tags.join(", ") : data.tags,
          openingOpen: data.openingHours?.open || "",
          openingClose: data.openingHours?.close || "",
        });

        setCoverImage(data.coverImage);

        setFoods(data.exploredFoods?.map((f) => ({
          name: f.name,
          price: f.price ? String(f.price) : "",
          image: f.image || ""
        })) || []);

        if (data.location && data.address) {
          setLocation({
            lat: data.location.coordinates[1],
            lng: data.location.coordinates[0],
            placeName: data.address.placeName,
            city: data.address.city,
            state: data.address.state,
            country: data.address.country,
            fullAddress: data.address.fullAddress
          });
        }

        setLoading(false);
      } catch (error: unknown) {
        setErrors({ name: getErrorMessage(error, "Failed to load food spot details") });
        navigate("/foodie/spot-listing");
      }
    };

    fetchFoodSpot();
  }, [id, navigate]);

  const uploadSingleImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    cb: (url: string) => void
  ) => {
    if (!e.target.files?.[0]) return;
    const result = await uploadToS3(e.target.files[0]);
    if (result) {
      cb(result.fileUrl);
      setCoverImageKey(result.s3Key);
      setErrors((prev) => ({ ...prev, coverImage: undefined }));
    }
  };

  const handleFoodImageUpload = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files?.[0]) return;
    const result = await uploadToS3(e.target.files[0]);
    if (!result) return;
    const updated = [...foods];
    updated[index].image = result.fileUrl;
    updated[index].s3Key = result.s3Key;
    setFoods(updated);
  };

  const addFood = () =>
    setFoods([...foods, { name: "", price: "", image: "" }]);

  const removeFood = (index: number) =>
    setFoods(foods.filter((_, i) => i !== index));

  const updateFood = (index: number, key: keyof FoodItem, value: string) => {
    const copy = [...foods];
    copy[index][key] = value;
    setFoods(copy);

    if (key === "name" || key === "price") {
      setErrors((prev) => {
        const foodErrors = [...(prev.foods || [])];
        if (foodErrors[index]) {
          foodErrors[index] = { ...foodErrors[index], [key]: undefined };
        }
        return { ...prev, foods: foodErrors };
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) newErrors.name = "Spot name is required.";
    if (!coverImage) newErrors.coverImage = "Cover image is required.";
    if (!location) newErrors.location = "Please select a location on the map.";

    if (form.openingOpen && form.openingClose && form.openingOpen >= form.openingClose) {
      newErrors.openingClose = "Closing time must be after opening time.";
    }

    const foodErrors: { name?: string; price?: string }[] = foods.map((f) => {
      const err: { name?: string; price?: string } = {};
      if (!f.name.trim()) err.name = "Food item name is required.";
      if (f.price && isNaN(Number(f.price))) err.price = "Price must be a valid number.";
      if (f.price && Number(f.price) < 0) err.price = "Price cannot be negative.";
      return err;
    });

    const hasFoodErrors = foodErrors.some((e) => e.name || e.price);
    if (hasFoodErrors) newErrors.foods = foodErrors;

    setErrors(newErrors);
    return !newErrors.name && !newErrors.coverImage && !newErrors.location && !newErrors.openingClose && !hasFoodErrors;
  };

  const handleSave = async () => {
    if (!id || !validate()) return;

    try {
      setIsSubmitting(true);

      const payload = {
        name: form.name,
        description: form.description,
        coverImage: coverImageKey || coverImage,
        location: {
          type: "Point",
          coordinates: [location!.lng, location!.lat],
        },
        address: {
          placeName: location!.placeName || "",
          city: location!.city || "",
          state: location!.state || "",
          country: location!.country || "",
          fullAddress: location!.fullAddress,
        },
        exploredFoods: foods.map((f) => ({
          name: f.name,
          price: f.price ? Number(f.price) : undefined,
          image: f.s3Key || f.image,
        })),
        speciality: form.speciality
          ? form.speciality.split(",").map((s: string) => s.trim())
          : [],
        tags: form.tags
          ? form.tags.split(",").map((t: string) => t.trim())
          : [],
        openingHours: {
          open: form.openingOpen,
          close: form.openingClose,
        },
      };

      await editFoodSpotApi(id, payload);
      showSuccess("Food spot updated successfully");
      navigate("/foodie/spot-listing");
    } catch (error: unknown) {
      setErrors((prev) => ({ ...prev, name: getErrorMessage(error, "Update failed") }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <FoodieNavbar />

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-emerald-600">Edit Food Spot</h1>
          <button
            onClick={handleSave}
            disabled={isSubmitting || uploadLoading}
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            Update Food Spot
          </button>
        </div>

        {/* Basic Info */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h2 className="font-bold flex gap-2 items-center text-gray-800 mb-4">
            <Star size={18} className="text-emerald-500" /> Basic Information
          </h2>

          {/* Spot Name */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Spot Name <span className="text-red-500">*</span>
            </label>
            <input
              placeholder="Spot Name"
              className={`w-full p-3 rounded-lg border transition-all outline-none ${
                errors.name
                  ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                  : "border-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
              }`}
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                if (e.target.value.trim()) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
            />
            <FieldError msg={errors.name} />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              placeholder="Description"
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none resize-none transition-all"
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
        </div>

        {/* Location */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h2 className="font-bold flex gap-2 items-center text-gray-800 mb-4">
            <MapPin size={18} className="text-blue-500" /> Location{" "}
            <span className="text-red-500">*</span>
          </h2>

          <div className={`rounded-xl overflow-hidden border transition-all ${
            errors.location ? "border-red-400" : "border-gray-200"
          }`}>
            <MapLocationPicker
              onSelect={(data) => {
                setLocation(data);
                setErrors((prev) => ({ ...prev, location: undefined }));
              }}
            />
          </div>
          <FieldError msg={errors.location} />

          {location && (
            <p className="text-sm mt-3 text-gray-600 flex gap-2 items-center">
              <MapPin size={14} className="text-emerald-500" />
              {location.fullAddress}
            </p>
          )}
        </div>

        {/* Cover Image */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Camera className="text-emerald-500" size={20} /> Cover Image{" "}
            <span className="text-red-500">*</span>
          </h2>

          {coverImage ? (
            <div className="relative h-64 w-full rounded-xl overflow-hidden group">
              <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => {
                    setCoverImage("");
                    setErrors((prev) => ({ ...prev, coverImage: "Cover image is required." }));
                  }}
                  className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all transform hover:scale-110"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          ) : (
            <label className="block cursor-pointer">
              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all h-64 flex flex-col items-center justify-center gap-3 ${
                errors.coverImage
                  ? "border-red-400 bg-red-50/30 hover:border-red-500"
                  : "border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50"
              }`}>
                <Upload className={errors.coverImage ? "text-red-400" : "text-emerald-500"} size={32} />
                <p className="text-gray-700 font-medium">Upload Cover Photo</p>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
              </div>
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => uploadSingleImage(e, setCoverImage)}
              />
            </label>
          )}
          <FieldError msg={errors.coverImage} />
        </div>

        {/* Food Menu */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold flex gap-2 items-center text-gray-800">
              <Utensils size={18} className="text-orange-500" /> Food Menu
            </h2>
            <button
              onClick={addFood}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg hover:from-emerald-600 hover:to-green-600 transition-all shadow-md hover:shadow-lg text-sm font-medium"
            >
              <Plus size={16} /> Add Item
            </button>
          </div>

          <div className="space-y-4">
            {foods.map((food, i) => (
              <div
                key={i}
                className="flex flex-wrap md:flex-nowrap gap-4 items-start bg-gray-50 p-4 rounded-xl border border-transparent hover:border-gray-200 transition-all"
              >
                {/* Food Image */}
                <div className="flex-shrink-0">
                  <label className="block cursor-pointer relative w-16 h-16 rounded-lg overflow-hidden bg-white border border-dashed border-gray-300 hover:border-emerald-400 transition-colors">
                    {food.image ? (
                      <img src={food.image} className="w-full h-full object-cover" alt="Food" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon size={20} />
                      </div>
                    )}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => handleFoodImageUpload(i, e)}
                    />
                  </label>
                  {food.image && (
                    <button
                      onClick={() => updateFood(i, "image", "")}
                      className="mt-1 text-xs text-red-500 hover:underline block text-center"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Name & Price */}
                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <input
                      placeholder="Food name *"
                      value={food.name}
                      onChange={(e) => updateFood(i, "name", e.target.value)}
                      className={`w-full p-2 rounded-lg border outline-none text-sm transition-all ${
                        errors.foods?.[i]?.name
                          ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                          : "border-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
                      }`}
                    />
                    <FieldError msg={errors.foods?.[i]?.name} />
                  </div>
                  <div>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={14} />
                      <input
                        placeholder="Price"
                        type="number"
                        value={food.price}
                        onChange={(e) => updateFood(i, "price", e.target.value)}
                        className={`w-full pl-8 pr-3 p-2 rounded-lg border outline-none text-sm transition-all ${
                          errors.foods?.[i]?.price
                            ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                            : "border-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
                        }`}
                      />
                    </div>
                    <FieldError msg={errors.foods?.[i]?.price} />
                  </div>
                </div>

                {foods.length > 0 && (
                  <button
                    onClick={() => removeFood(i)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Additional Details</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Tag size={14} className="text-gray-500" /> Speciality
              </label>
              <input
                placeholder="e.g., Wood-fired pizza"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                value={form.speciality}
                onChange={(e) => setForm({ ...form, speciality: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Tag size={14} className="text-gray-500" /> Tags
              </label>
              <input
                placeholder="e.g., Italian, Casual Dining"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="text-emerald-500" size={20} /> Opening Hours
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Opens At</label>
              <input
                type="time"
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 transition-all outline-none ${
                  errors.openingOpen
                    ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-200"
                }`}
                value={form.openingOpen}
                onChange={(e) => {
                  setForm({ ...form, openingOpen: e.target.value });
                  setErrors((prev) => ({ ...prev, openingOpen: undefined, openingClose: undefined }));
                }}
              />
              <FieldError msg={errors.openingOpen} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Closes At</label>
              <input
                type="time"
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 transition-all outline-none ${
                  errors.openingClose
                    ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-200"
                }`}
                value={form.openingClose}
                onChange={(e) => {
                  setForm({ ...form, openingClose: e.target.value });
                  setErrors((prev) => ({ ...prev, openingClose: undefined }));
                }}
              />
              <FieldError msg={errors.openingClose} />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isSubmitting || uploadLoading}
          className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting || uploadLoading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Save size={18} />
          )}
          Update Food Spot
        </button>
      </div>
    </div>
  );
}
