import { useEffect, useState } from "react";
import { getFoodieProfileApi, updateFoodieProfileApi } from "@/api/foodieApi";
import { showError, showSuccess } from "@/utils/toast";
import { getErrorMessage, logError } from "@/utils/errorHandler";
import { User, Phone, MapPin, FileText, Image as ImageIcon, Heart, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAwsS3Upload } from "@/hooks/useAwsS3Upload";
import MapLocationPicker from "@/utils/MapLocationPicker";

export default function FoodieEditProfile() {
    const navigate = useNavigate()
    const [name, setName] = useState("");

    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState({
        lat: 12.9716,
        lng: 77.5946,
        address: ""
    });
    const [preferences, setPreferences] = useState({
        recipeCategory: [] as string[],
        blogTags: [] as string[]
    });
    const [bio, setBio] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});


    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await getFoodieProfileApi();
                const profile = res.data.data.data;

                setName(profile.userId?.name ?? "");
                setPhone(profile.phone ?? "");
                
                if (profile.location?.coordinates) {
                    setLocation({
                        lat: profile.location.coordinates[1],
                        lng: profile.location.coordinates[0],
                        address: profile.address ?? ""
                    });
                } else {
                    // Fallback for old simple string locations
                    setLocation(prev => ({ ...prev, address: profile.location || "" }));
                }

                const prefs = profile.preferences;
                if (prefs && typeof prefs === 'object' && !Array.isArray(prefs)) {
                    setPreferences({
                        recipeCategory: Array.isArray(prefs.recipeCategory) ? prefs.recipeCategory : [],
                        blogTags: Array.isArray(prefs.blogTags) ? prefs.blogTags : []
                    });
                } else {
                    setPreferences({ recipeCategory: [], blogTags: [] });
                }
                setBio(profile.bio ?? "");
                setImage(profile.image ?? null);

            } catch (err: unknown) {
                logError(err, "Failed to fetch profile");
            }
        }

        fetchProfile();
    }, []);



    const { uploadToS3 } = useAwsS3Upload()


    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {

            const Image = e.target.files?.[0]
            const url = await uploadToS3(Image)

            setImage(url)

        }
    };
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!name.trim()) {
            newErrors.name = "Name is required";
        } else if (name.length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }

        if (!phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^\d{10}$/.test(phone)) {
            newErrors.phone = "Enter a valid 10-digit phone number";
        }

        if (!location.address.trim()) {
            newErrors.location = "Please select a location on the map";
        }

        if (preferences.recipeCategory.length === 0 && preferences.blogTags.length === 0) {
            newErrors.preferences = "Please select at least one food preference or blog tag";
        }
        if (!image) {
            newErrors.image = "Please add image";
        }

        if (!bio.trim()) {
            newErrors.bio = "Bio is required";
        } else if (bio.length < 10) {
            newErrors.bio = "Bio must be at least 10 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
 const removeCoverImage = () => {
        setImage(null);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            showError("Invalid Credentials");
            return;
        }

        const payload = {
            name: name,
            phone: phone,
            location: {
                type: "Point",
                coordinates: [location.lng, location.lat]
            },
            address: location.address,
            preferences: preferences,
            bio: bio,
            image: image
        }

        try {
            await updateFoodieProfileApi(payload);
            showSuccess("Profile Updated!");
            navigate('/foodie/profile')
        } catch (err: unknown) {
            showError(getErrorMessage(err));
        }

    };

    return (
        <div className="w-full flex justify-center mt-10">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl border border-gray-100">
                <h2 className="text-3xl font-semibold mb-6 flex items-center gap-2">
                    <User className="text-green-600" size={28} />
                    Edit Foodie Profile
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Name */}
                    <div>
                        <label className="text-sm font-medium">Name</label>
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                        )}

                        <div className="flex items-center bg-gray-50 rounded-lg px-3">
                            <User size={18} className="text-gray-400" />
                            <input
                                type="text"
                                value={name}
                                className="w-full bg-transparent p-3 outline-none"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Email */}


                    {/* Phone */}
                    <div>
                        <label className="text-sm font-medium">Phone Number</label>
                        {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                        )}

                        <div className="flex items-center bg-gray-50 rounded-lg px-3">
                            <Phone size={18} className="text-gray-400" />
                            <input
                                type="text"
                                value={phone}
                                className="w-full bg-transparent p-3 outline-none"
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <MapPin className="text-green-600" size={18} />
                            Your Location
                        </label>
                        {errors.location && (
                            <p className="text-red-500 text-sm">{errors.location}</p>
                        )}
                        
                        <div className="border rounded-xl overflow-hidden bg-gray-50">
                            <MapLocationPicker 
                                initialLat={location.lat}
                                initialLng={location.lng}
                                onSelect={(data) => setLocation({
                                    lat: data.lat,
                                    lng: data.lng,
                                    address: data.fullAddress
                                })}
                            />
                        </div>
                        {location.address && (
                            <p className="text-sm text-gray-600 italic px-1">
                                Selected: {location.address}
                            </p>
                        )}
                    </div>

                    {/* Preferences */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium flex items-center gap-1">
                            <Heart size={16} className="text-red-500" /> My Culinary Interests
                        </label>
                        {errors.preferences && (
                            <p className="text-red-500 text-sm mt-1">{errors.preferences}</p>
                        )}

                        {/* Recipe Categories */}
                        <div className="space-y-3">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Recipe Categories</p>
                            <div className="flex flex-wrap gap-2">
                                {["Italian", "Arabic", "Thai", "Mexican", "Chinese", "Indian", "Quick & Easy", "Vegetarian", "Vegan"].map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => {
                                            const newCats = preferences.recipeCategory.includes(cat)
                                                ? preferences.recipeCategory.filter(c => c !== cat)
                                                : [...preferences.recipeCategory, cat];
                                            setPreferences({ ...preferences, recipeCategory: newCats });
                                        }}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border-2 ${
                                            preferences.recipeCategory.includes(cat)
                                                ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-200"
                                                : "bg-white border-gray-100 text-gray-600 hover:border-emerald-200"
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Blog Tags */}
                        <div className="space-y-3">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Blog Tags</p>
                            <div className="flex flex-wrap gap-2">
                                {["Cooking Tips", "Healthy Eating", "Desserts", "Baking", "Meal Prep", "International Cuisine", "Seasonal", "Budget Friendly"].map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => {
                                            const newTags = preferences.blogTags.includes(tag)
                                                ? preferences.blogTags.filter(t => t !== tag)
                                                : [...preferences.blogTags, tag];
                                            setPreferences({ ...preferences, blogTags: newTags });
                                        }}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border-2 ${
                                            preferences.blogTags.includes(tag)
                                                ? "bg-teal-500 border-teal-500 text-white shadow-md shadow-teal-200"
                                                : "bg-white border-gray-100 text-gray-600 hover:border-teal-200"
                                        }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="text-sm font-medium flex items-center gap-1">
                            <FileText size={16} />
                            Bio
                        </label>
                        {errors.bio && (
                            <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
                        )}

                        <textarea
                            rows={4}
                            value={bio}
                            className="w-full bg-gray-50 p-3 rounded-lg outline-none"
                            onChange={(e) => setBio(e.target.value)}
                        />
                    </div>

                    {/* Image */}
                    <div>
                       <label className="text-sm font-medium flex items-center gap-1">
                            <ImageIcon size={16} />
                            Update Profile Image
                        </label>
                       {errors.image && (
                            <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                        )}
                        {!image ? (
                                <label className="flex flex-col items-center justify-center h-72 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/30 transition-all group">
                                    <Upload className="w-14 h-14 text-gray-400 mb-4 group-hover:text-emerald-600 transition-colors group-hover:scale-110 transform" />
                                    <span className="text-base font-medium text-gray-700 group-hover:text-emerald-700 mb-1">
                                        Click to upload cover image
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        PNG, JPG, WEBP up to 10MB
                                    </span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            ) : (
                                <div className="relative rounded-xl overflow-hidden group shadow-lg">
                                    <img
                                        src={image}
                                        alt="Cover preview"
                                        className="w-full h-96 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={removeCoverImage}
                                            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-2xl transform hover:scale-110 transition-all"
                                        >
                                            <h1>X</h1>
                                        </button>
                                    </div>
                                </div>
                            )}
                    </div>


                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-lg font-medium shadow-md transition"
                    >
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
}
