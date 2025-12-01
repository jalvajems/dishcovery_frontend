import { useEffect, useState } from "react";
import { getFoodieProfileApi, updateFoodieProfileApi } from "@/api/foodieApi";
import { showError, showSuccess } from "@/utils/toast";
import { User, Mail, Phone, MapPin, FileText, Image as ImageIcon, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FoodieEditProfile() {
    const navigate=useNavigate()
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [preferences, setPreferences] = useState([]);
    const [bio, setBio] = useState("");
    const [image, setImage] = useState(null);

    useEffect(() => {
        getFoodieProfileApi().then(({ data }) => {
            setName(data.name);
            setEmail(data.email);

            const f = data.foodie;
            if (f) {
                setPhone(f.phone);
                setLocation(f.location);
                setPreferences(f.preferences || []);
                setBio(f.bio);
            }
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload={
            name:name,
            phone: phone,
      location: location,
      preferences: preferences,
      bio: bio,
      image:image
        }

        try {
            await updateFoodieProfileApi(payload);
            showSuccess("Profile Updated!");
            navigate('/foodie/profile')
        } catch (err:any) {
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
                        <select
                            className="w-full bg-gray-50 p-3 rounded-lg outline-none"
                            value={preferences[0]}
                            onChange={(e) => setPreferences([e.target.value])}
                        >
                            <option>Veg</option>
                            <option>Non-Veg</option>
                            <option>Chef Specials</option>
                        </select>
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="text-sm font-medium flex items-center gap-1">
                            <FileText size={16} />
                            Bio
                        </label>
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
                            onChange={(e) => setImage(e.target.files[0])}
                        />
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
