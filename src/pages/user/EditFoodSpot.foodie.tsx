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
    Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import MapLocationPicker from "@/utils/MapLocationPicker";
import { editFoodSpotApi, getFoodSpotDetailApi } from "@/api/foodieApi";
import { showError, showSuccess } from "@/utils/toast";
import { useAwsS3Upload } from "@/components/shared/hooks/useAwsS3Upload";
import FoodieNavbar from "@/components/shared/foodie/Navbar.foodie";
import { useNavigate, useParams } from "react-router-dom";

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

export default function EditFoodSpot() {
    const navigate = useNavigate();
    const { id } = useParams();

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
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { uploadToS3, loading: uploadLoading } = useAwsS3Upload();

    useEffect(() => {
        if (id) fetchFoodSpot(id);
    }, [id]);

    const fetchFoodSpot = async (spotId: string) => {
        try {
            const { data } = await getFoodSpotDetailApi(spotId);
            const spot = data.data; // Adjust based on API response structure

            setForm({
                name: spot.name,
                description: spot.description,
                speciality: spot.speciality ? spot.speciality.join(", ") : "",
                tags: spot.tags ? spot.tags.join(", ") : "",
                openingOpen: spot.openingHours?.open || "",
                openingClose: spot.openingHours?.close || "",
            });

            setCoverImage(spot.coverImage);

            if (spot.exploredFoods?.length) {
                setFoods(spot.exploredFoods.map((f: any) => ({
                    name: f.name,
                    price: f.price?.toString() || "",
                    image: f.image || ""
                })));
            }

            if (spot.location?.coordinates && spot.address) {
                setLocation({
                    lng: spot.location.coordinates[0],
                    lat: spot.location.coordinates[1],
                    placeName: spot.address.placeName,
                    city: spot.address.city,
                    state: spot.address.state,
                    country: spot.address.country,
                    fullAddress: spot.address.fullAddress,
                });
            }
        } catch (err) {
            showError("Failed to fetch food spot details");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

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

            setIsSubmitting(true);

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

            if (id) {
                await editFoodSpotApi(id, payload);
                showSuccess("Food spot updated successfully!");
                navigate(`/foodie/spot-listing`); // Or back to detail page
            }
        } catch (err: any) {
            showError(err?.response?.data?.message || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <Loader2 className="animate-spin text-emerald-600" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <FoodieNavbar />

            {/* Hero Header */}
            <div className="bg-white border-b sticky top-16 z-30 shadow-sm">
                <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Food Spot</h1>
                        <p className="text-sm text-gray-500">Update your food spot details</p>
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
                        Update Spot
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
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Spot Name</label>
                                    <input
                                        placeholder="e.g. The Burger Joint"
                                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                                    <textarea
                                        placeholder="Tell us what makes this place special..."
                                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none resize-none"
                                        rows={4}
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Speciality</label>
                                        <input
                                            placeholder="e.g. Wood-fired pizza"
                                            className="w-full px-4 py-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                                            value={form.speciality}
                                            onChange={(e) => setForm({ ...form, speciality: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tags</label>
                                        <div className="relative">
                                            <Tag className="absolute left-4 top-3.5 text-gray-400" size={16} />
                                            <input
                                                placeholder="Italian, Casual, etc."
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                                                value={form.tags}
                                                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                                            />
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
                                                </label>
                                            </div>

                                            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <input
                                                    placeholder="Item Name"
                                                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none text-sm"
                                                    value={food.name}
                                                    onChange={(e) => updateFood(i, "name", e.target.value)}
                                                />
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={14} />
                                                    <input
                                                        placeholder="Price"
                                                        type="number"
                                                        className="w-full pl-8 pr-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none text-sm"
                                                        value={food.price}
                                                        onChange={(e) => updateFood(i, "price", e.target.value)}
                                                    />
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
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <MapPin className="text-blue-600" size={20} />
                                </div>
                                <h2 className="text-lg font-bold text-gray-800">Location</h2>
                            </div>

                            <div className="rounded-xl overflow-hidden border border-gray-200">
                                {/* Pass initialLat/Lng if available to center the map on existing location */}
                                <MapLocationPicker
                                    onSelect={(data: LocationData) => setLocation(data)}
                                    initialLat={location?.lat}
                                    initialLng={location?.lng}
                                />
                            </div>

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
                                <Camera size={18} /> Cover Image
                            </h2>

                            {coverImage ? (
                                <div className="relative h-48 w-full rounded-xl overflow-hidden group">
                                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                        <button
                                            onClick={() => setCoverImage("")}
                                            className="p-2 bg-white text-red-500 rounded-full hover:bg-red-50 transition-all shadow-lg"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <label className="block cursor-pointer group">
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-emerald-400 hover:bg-emerald-50/50 transition-all h-48 flex flex-col items-center justify-center gap-3">
                                        <div className="p-3 bg-gray-50 rounded-full group-hover:bg-white transition-colors">
                                            <Upload className="text-gray-400 group-hover:text-emerald-500" size={24} />
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
                                        className="w-full px-4 py-2 bg-gray-50 rounded-lg border-transparent focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all outline-none"
                                        value={form.openingOpen}
                                        onChange={(e) => setForm({ ...form, openingOpen: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">CLOSES AT</label>
                                    <input
                                        type="time"
                                        className="w-full px-4 py-2 bg-gray-50 rounded-lg border-transparent focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all outline-none"
                                        value={form.openingClose}
                                        onChange={(e) => setForm({ ...form, openingClose: e.target.value })}
                                    />
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </div>
    );
}
