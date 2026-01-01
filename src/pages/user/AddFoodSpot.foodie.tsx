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
} from "lucide-react";

import MapLocationPicker from "@/utils/MapLocationPicker";
import { addFoodSpotApi } from "@/api/foodieApi";
import { showError, showSuccess } from "@/utils/toast";
import { useAwsS3Upload } from "@/components/shared/hooks/useAwsS3Upload";
import FoodieNavbar from "@/components/shared/foodie/Navbar.foodie";
import { useNavigate } from "react-router-dom";


interface FoodItem {
  name: string;
  price: string;
  image: string;
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


export default function AddFoodSpot() {
  const navigate=useNavigate()
  const [form, setForm] = useState({
    name: "",
    description: "",
    speciality: "",
    tags: "",
    openingOpen: "",
    openingClose: "",
  });

  const [coverImage, setCoverImage] = useState<string>("");
  const [foods, setFoods] = useState<FoodItem[]>([
    { name: "", price: "", image: "" },
  ]);

  const [location, setLocation] = useState<LocationData | null>(null);

  const { uploadToS3, loading: uploadLoading } = useAwsS3Upload();

  
  const uploadSingleImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    cb: (url: string) => void
  ) => {
    if (!e.target.files?.[0]) return;
    const url = await uploadToS3(e.target.files[0]);
    if (url) cb(url);
  };

  const handleFoodImageUpload = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files?.[0]) return;
    const url = await uploadToS3(e.target.files[0]);
    if (!url) return;

    const updated = [...foods];
    updated[index].image = url;
    setFoods(updated);
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
  };

  
  const handleSave = async () => {
    try {
      if (!form.name.trim()) return showError("Food spot name is required");
      if (!coverImage) return showError("Cover image is required");
      if (!location) return showError("Location is required");

      const payload = {
        name: form.name,
        description: form.description,
        coverImage,
        location: {
          type: "Point",
          coordinates: [location.lng, location.lat],
        },

        address: {
          placeName: location.placeName,
          city: location.city,
          state: location.state,
          country: location.country,
          fullAddress: location.fullAddress,
        },

        exploredFoods: foods.map((f) => ({
          name: f.name,
          price: f.price ? Number(f.price) : undefined,
          image: f.image,
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
      navigate(`/foodie/spot-listing`)
    } catch (err: any) {
      showError(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <FoodieNavbar/>
        <h1 className="text-3xl font-bold text-emerald-600">
          Add New Food Spot
        </h1>

        {/* Basic Info */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold flex gap-2 items-center">
            <Star size={18} /> Basic Information
          </h2>

          <input
            placeholder="Spot Name"
            className="input mt-4"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <textarea
            placeholder="Description"
            className="input mt-3"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Location */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold flex gap-2 items-center">
            <MapPin size={18} /> Location
          </h2>

          <MapLocationPicker onSelect={(data: LocationData) => setLocation(data)} />

          {location && (
            <p className="text-sm mt-2 text-gray-600">
              📍 {location.fullAddress}
            </p>
          )}
        </div>

        {/* Cover Image */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Camera className="text-emerald-500" size={20} /> Cover Image
          </h2>

          {coverImage ? (
            <div className="relative h-64 w-full rounded-xl overflow-hidden group">
              <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => setCoverImage("")}
                  className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all transform hover:scale-110"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          ) : (
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-emerald-300 rounded-xl p-8 text-center hover:border-emerald-500 hover:bg-emerald-50 transition-all h-64 flex flex-col items-center justify-center">
                {/* We can re-use the file input logic here */}
                <Upload className="mb-2 text-emerald-500" size={32} />
                <p className="text-gray-700 font-medium">Upload Cover Photo</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
              </div>
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => uploadSingleImage(e, setCoverImage)}
              />
            </label>
          )}
        </div>

       

        {/* Food Menu */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between items-center">
            <h2 className="font-bold flex gap-2 items-center">
              <Tag size={18} /> Food Menu
            </h2>
            <button
              onClick={addFood}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg hover:from-emerald-600 hover:to-green-600 transition-all shadow-md hover:shadow-lg"
            >
              <Plus size={16} /> Add
            </button>
          </div>

          <div className="space-y-4 mt-4">
            {foods.map((food, i) => (
              <div key={i} className="flex gap-4 items-center">
                <input
                  placeholder="Food name"
                  value={food.name}
                  onChange={(e) => updateFood(i, "name", e.target.value)}
                  className="input"
                />

                <input
                  placeholder="Price"
                  type="number"
                  value={food.price}
                  onChange={(e) => updateFood(i, "price", e.target.value)}
                  className="input"
                />

                {food.image ? (
                  <img src={food.image} className="w-16 h-16 rounded" />
                ) : (
                  <input
                    type="file"
                    onChange={(e) => handleFoodImageUpload(i, e)}
                  />
                )}

                {foods.length > 1 && (
                  <button onClick={() => removeFood(i)}>
                    <X />
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Speciality</label>
              <input
                placeholder="e.g., Wood-fired pizza"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                value={form.speciality}
                onChange={(e) => setForm({ ...form, speciality: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
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
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                value={form.openingOpen}
                onChange={(e) => setForm({ ...form, openingOpen: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Closes At</label>
              <input
                type="time"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                value={form.openingClose}
                onChange={(e) => setForm({ ...form, openingClose: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}

          className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold"
        >
          <Save size={18} className="inline mr-2" />
          Save Food Spot
        </button>
      </div>
    </div>
  );
}
