import { useEffect, useState } from "react";
import { getFoodieProfileApi, updateFoodieProfileApi } from "@/api/foodieApi";
import { showError, showSuccess } from "@/utils/toast";
import { User, Mail, Phone, MapPin, FileText, Image as ImageIcon, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAwsS3Upload } from "@/components/shared/hooks/useAwsS3Upload";

export default function FoodieEditProfile() {
    const navigate = useNavigate()
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [preferences, setPreferences] = useState([]);
    const [bio, setBio] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});


    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await getFoodieProfileApi();
                const profile = res.data.data.data;

                setName(profile.userId?.name ?? "");
                setEmail(profile.userId?.email ?? "");
                setPhone(profile.phone ?? "");
                setLocation(profile.location ?? "");
                setPreferences(profile.preferences ?? []);
                setBio(profile.bio ?? "");
                setImage(profile.image ?? null);

            } catch (err) {
                console.error("Failed to fetch profile", err);
            }
        }

        fetchProfile();
    }, []);



    const { uploadToS3 } = useAwsS3Upload()


    const handleImageChange = async (e) => {
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

  if (!location.trim()) {
    newErrors.location = "Location is required";
  }

  if (!preferences.length) {
    newErrors.preferences = "Please select a food preference";
  }

  if (!bio.trim()) {
    newErrors.bio = "Bio is required";
  } else if (bio.length < 10) {
    newErrors.bio = "Bio must be at least 10 characters";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};



    const handleSubmit = async (e) => {
        e.preventDefault();
        
  if (!validateForm()) {
    showError("Ivalid Credentials");
    return;
  }

        const payload = {
            name: name,
            phone: phone,
            location: location,
            preferences: preferences,
            bio: bio,
            image: image
        }

        try {
            await updateFoodieProfileApi(payload);
            showSuccess("Profile Updated!");
            navigate('/foodie/profile')
        } catch (err: any) {
            showError(err.response?.data?.message);
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
                    <div>
                        <label className="text-sm font-medium">Location</label>
                        {errors.location && (
  <p className="text-red-500 text-sm mt-1">{errors.location}</p>
)}

                        <div className="flex items-center bg-gray-50 rounded-lg px-3">
                            <MapPin size={18} className="text-gray-400" />
                            <input
                                type="text"
                                value={location}
                                className="w-full bg-transparent p-3 outline-none"
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Preferences */}
                    <div>
                        <label className="text-sm font-medium flex items-center gap-1">
                            <Heart size={16} className="text-red-500" />
                            Food Preferences
                        </label>
                        {errors.preferences && (
  <p className="text-red-500 text-sm mt-1">{errors.preferences}</p>
)}

                        <select
                            className="w-full bg-gray-50 p-3 rounded-lg outline-none"
                            value={preferences[0] || ""}
                            onChange={(e) => setPreferences([e.target.value])}
                        >
                            <option value="">Select Preference</option>
                            <option value="Veg">Veg</option>
                            <option value="Non-Veg">Non-Veg</option>
                            <option value="Chef Specials">Chef Specials</option>
                        </select>

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
                        <input
                            type="file"
                            className="w-full bg-gray-50 p-3 rounded-lg"
                            onChange={handleImageChange}
                        />
                        {image && (
                            <div className="mt-4 flex justify-center">
                                <img
                                    src={image}
                                    alt="Preview"
                                    className="w-40 h-40 object-cover rounded-xl shadow-md"
                                />
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
