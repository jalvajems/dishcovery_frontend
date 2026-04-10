import { useState } from "react";
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
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { addFoodSpotApi } from "@/api/foodieApi";
import { showSuccess } from "@/utils/toast";
import { getErrorMessage } from "@/utils/errorHandler";
import { useAwsS3Upload } from "@/hooks/useAwsS3Upload";
import FoodieNavbar from "@/components/shared/foodie/Navbar.foodie";
import { useNavigate } from "react-router-dom";
import MapLocationPicker from "@/utils/MapLocationPicker";

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
  description?:string;
  speciality?:string;
  tag?:string;
  location?: string;
  openingOpen?: string;
  openingClose?: string;
  foods?: { name?: string; price?: string; image?:string; }[];
}

export default function AddFoodSpot() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    speciality: "",
    tags: "",
    openingOpen: "",
    openingClose: "",
  });

  const [coverImage, setCoverImage] = useState<string>("");
  const [coverImageKey, setCoverImageKey] = useState<string>("");
  const [foods, setFoods] = useState<FoodItem[]>([
    { name: "", price: "", image: "" },
  ]);

  const [location, setLocation] = useState<LocationData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const { uploadToS3, loading: uploadLoading } = useAwsS3Upload();

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
    updated[index].s3Key = result.s3Key; // Dynamically add s3Key
    setFoods(updated);

    // Clear food-level error for image on upload
    setErrors((prev) => {
      const foodErrors = [...(prev.foods || [])];
      if (foodErrors[index]) {
        foodErrors[index] = { ...foodErrors[index], image: undefined };
      }
      return { ...prev, foods: foodErrors };
    });
  };

  const addFood = () =>
    setFoods([...foods, { name: "", price: "", image: "" }]);

  const removeFood = (index: number) =>
    setFoods(foods.filter((_, i) => i !== index));

  const updateFood = (
    index: number,
    key: keyof FoodItem,
    value: string
  ) => {
    const updated = [...foods];
    updated[index][key] = value;
    setFoods(updated);

    // Clear food-level errors on change
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
    if (!coverImageKey) newErrors.coverImage = "Cover image is required.";
    if (!location) newErrors.location = "Please select a location on the map.";
    if (!form.description) newErrors.description = "Please add description";
    if (!form.speciality) newErrors.speciality = "Please add speciality";
    if (!form.tags) newErrors.tag = "Please add tag";

    if (form.openingOpen && form.openingClose && form.openingOpen >= form.openingClose) {
      newErrors.openingClose = "Closing time must be after opening time.";
    }

    const foodErrors: { name?: string; price?: string; image?:string; }[] = foods.map((f) => {
      const err: { name?: string; price?: string; image?:string; } = {};
      if (!f.name.trim()) err.name = "Food item name is required.";
      if (!f.image.trim() && !f.s3Key) err.image = "Food item image is required.";
      
      if (!f.price.trim()) {
        err.price = "Price is required.";
      } else if (isNaN(Number(f.price))) {
        err.price = "Price must be a valid number.";
      } else if (Number(f.price) < 0) {
        err.price = "Price cannot be negative.";
      }
      return err;
    });

    const hasFoodErrors = foodErrors.some((e) => e.name || e.price || e.image);
    if (hasFoodErrors) newErrors.foods = foodErrors;

    setErrors(newErrors);
    return !newErrors.name && !newErrors.coverImage && !newErrors.location && !newErrors.openingClose && !newErrors.description && !newErrors.speciality && !newErrors.tag && !hasFoodErrors;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setIsSubmitting(true);

      const payload = {
        name: form.name,
        description: form.description,
        coverImage: coverImageKey,
        location: {
          type: "Point",
          coordinates: [location!.lng, location!.lat],
        },
        address: {
          placeName: location!.placeName,
          city: location!.city,
          state: location!.state,
          country: location!.country,
          fullAddress: location!.fullAddress,
        },
        exploredFoods: foods.map((f) => ({
          name: f.name,
          price: f.price ? Number(f.price) : undefined,
          image: f.s3Key || f.image,
        })),
        speciality: form.speciality
          ? form.speciality.split(",").map((s) => s.trim())
          : [],
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
        openingHours: {
          open: form.openingOpen,
          close: form.openingClose,
        },
      };

      await addFoodSpotApi(payload);
      showSuccess("Food spot created successfully!");
      navigate(`/foodie/spot-listing`);
    } catch (err: unknown) {
      setErrors((prev) => ({ ...prev, name: getErrorMessage(err) }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const FieldError = ({ msg }: { msg?: string }) =>
    msg ? (
      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
        <span>⚠</span> {msg}
      </p>
    ) : null;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <FoodieNavbar />

      {/* Hero Header */}
      <div className="bg-white border-b sticky top-16 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Food Spot</h1>
            <p className="text-sm text-gray-500">Share your culinary discovery with the world</p>
          </div>
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
            Publish Spot
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">

            {/* Basic Information Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Star className="text-emerald-600" size={20} />
                </div>
                <h2 className="text-lg font-bold text-gray-800">Basic Information</h2>
              </div>

              <div className="space-y-4">
                {/* Spot Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Spot Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    placeholder="e.g. The Burger Joint"
                    className={`w-full px-4 py-3 bg-gray-50 rounded-xl border focus:bg-white focus:ring-2 transition-all outline-none ${
                      errors.name
                        ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                        : "border-transparent focus:border-emerald-500 focus:ring-emerald-200"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                  <textarea
                    placeholder="Tell us what makes this place special..."
                    className={`w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none resize-none  ${
                    errors.description
                      ? "border-red-400 bg-red-50/30 hover:border-red-500"
                      : "border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/50"
                  }`}
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                  <FieldError msg={errors.description} />

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Speciality */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Speciality</label>
                    <input
                      placeholder="e.g. Wood-fired pizza"
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                      value={form.speciality}
                      onChange={(e) => setForm({ ...form, speciality: e.target.value })}
                    />
                    <FieldError msg={errors.speciality}/>
                  </div>
                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tags</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-3.5 text-gray-400" size={16} />
                      <input
                        placeholder="Italian, Casual, etc."
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                        value={form.tags}
                        onChange={(e) => setForm({ ...form, tags: e.target.value })}
                      />
                      <FieldError msg={errors.tag} />

                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Menu Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Utensils className="text-orange-500" size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-800">Food Menu</h2>
                </div>
                <button
                  onClick={addFood}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors font-medium text-sm"
                >
                  <Plus size={16} /> Add Item
                </button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {foods.map((food, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="group flex gap-4 items-start bg-gray-50 p-4 rounded-xl relative border border-transparent hover:border-gray-200 transition-all"
                    >
                      {/* Food Image Upload */}
                      <div className="flex-shrink-0">
                        <label className="block cursor-pointer relative w-20 h-20 rounded-lg overflow-hidden bg-white border border-dashed border-gray-300 hover:border-emerald-400 transition-colors">
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
                          <FieldError msg={errors.foods?.[i]?.image} />

                        </label>
                      </div>

                      {/* Food Name & Price */}
                      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <input
                            placeholder="Item Name *"
                            className={`w-full px-3 py-2 bg-white rounded-lg border focus:ring-1 outline-none text-sm transition-all ${
                              errors.foods?.[i]?.name
                                ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                                : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                            }`}
                            value={food.name}
                            onChange={(e) => updateFood(i, "name", e.target.value)}
                          />
                          <FieldError msg={errors.foods?.[i]?.name} />
                        </div>
                        <div>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={14} />
                            <input
                              placeholder="Price"
                              type="number"
                              className={`w-full pl-8 pr-3 py-2 bg-white rounded-lg border focus:ring-1 outline-none text-sm transition-all ${
                                errors.foods?.[i]?.price
                                  ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                                  : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                              }`}
                              value={food.price}
                              onChange={(e) => updateFood(i, "price", e.target.value)}
                            />
                          </div>
                          <FieldError msg={errors.foods?.[i]?.price} />
                        </div>
                      </div>

                      {foods.length > 1 && (
                        <button
                          onClick={() => removeFood(i)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Location Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <MapPin className="text-blue-600" size={20} />
                </div>
                <h2 className="text-lg font-bold text-gray-800">
                  Location <span className="text-red-500">*</span>
                </h2>
              </div>

              <div className={`rounded-xl overflow-hidden border transition-all ${
                errors.location ? "border-red-400" : "border-gray-200"
              }`}>
                <MapLocationPicker
                  onSelect={(data: LocationData) => {
                    setLocation(data);
                    setErrors((prev) => ({ ...prev, location: undefined }));
                  }}
                />
              </div>
              <FieldError msg={errors.location} />

              {location && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl flex items-start gap-3 text-sm text-gray-600">
                  <MapPin size={16} className="mt-0.5 flex-shrink-0 text-emerald-600" />
                  <p>{location.fullAddress}</p>
                </div>
              )}
            </motion.div>

          </div>

          {/* Right Column - Side Info */}
          <div className="space-y-6">

            {/* Cover Image Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            >
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Camera size={18} /> Cover Image <span className="text-red-500">*</span>
              </h2>

              {coverImage ? (
                <div className="relative h-48 w-full rounded-xl overflow-hidden group">
                  <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                    <button
                      onClick={() => {
                        setCoverImage("");
                        setErrors((prev) => ({ ...prev, coverImage: "Cover image is required." }));
                      }}
                      className="p-2 bg-white text-red-500 rounded-full hover:bg-red-50 transition-all shadow-lg"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="block cursor-pointer group">
                  <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all h-48 flex flex-col items-center justify-center gap-3 ${
                    errors.coverImage
                      ? "border-red-400 bg-red-50/30 hover:border-red-500"
                      : "border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/50"
                  }`}>
                    <div className="p-3 bg-gray-50 rounded-full group-hover:bg-white transition-colors">
                      <Upload className={errors.coverImage ? "text-red-400" : "text-gray-400 group-hover:text-emerald-500"} size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Click to upload</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG (Cover photo)</p>
                    </div>
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
            </motion.div>

            {/* Opening Hours Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            >
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock size={18} /> Opening Hours
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">OPENS AT</label>
                  <input
                    type="time"
                    className={`w-full px-4 py-2 bg-gray-50 rounded-lg border focus:bg-white focus:ring-1 transition-all outline-none ${
                      errors.openingOpen
                        ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                        : "border-transparent focus:border-emerald-500 focus:ring-emerald-200"
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
                  <label className="block text-xs font-semibold text-gray-500 mb-1">CLOSES AT</label>
                  <input
                    type="time"
                    className={`w-full px-4 py-2 bg-gray-50 rounded-lg border focus:bg-white focus:ring-1 transition-all outline-none ${
                      errors.openingClose
                        ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                        : "border-transparent focus:border-emerald-500 focus:ring-emerald-200"
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
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
