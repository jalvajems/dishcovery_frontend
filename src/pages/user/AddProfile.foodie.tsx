import { useState } from "react";
import { createFoodieProfileApi } from "@/api/foodieApi";
import { showError, showSuccess } from "@/utils/toast";
import { getErrorMessage } from "@/utils/errorHandler";
import { MapPin, Phone, User, FileText, Image as ImageIcon, Heart, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAwsS3Upload } from "@/hooks/useAwsS3Upload";
import MapLocationPicker from "@/utils/MapLocationPicker";

export default function FoodieAddProfile() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState({
    lat: 12.9716,
    lng: 77.5946,
    address: ""
  });
  const [preferences, setPreferences] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { uploadToS3 } = useAwsS3Upload()

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const Image = e.target.files?.[0]
      const url = await uploadToS3(Image)
      setImage(url)
    }
  };

  const removeCoverImage = () => {
    setImage(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Phone
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    // Location
    if (!location.address.trim()) {
      newErrors.location = "Please select a location on the map";
    }

    // Preferences
    if (!preferences.length) {
      newErrors.preferences = "Please select a food preference";
    }

    // Bio
    if (!bio.trim()) {
      newErrors.bio = "Bio is required";
    } else if (bio.length < 10) {
      newErrors.bio = "Bio must be at least 10 characters";
    }
    if (!image?.trim()) {
      newErrors.image = "Image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showError("Invalid Credentials");
      return;
    }

    const payload = {
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
      if (!payload) return;
      await createFoodieProfileApi(payload);

      showSuccess("Profile Created!");
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
          Setup Your Foodie Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Phone */}
          <div>
            <label className="text-sm font-medium">Phone Number</label>
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}

            <div className="flex items-center bg-gray-50 rounded-lg px-3">
              <Phone className="text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Enter your phone"
                className="w-full bg-transparent p-3 outline-none"
                onChange={e => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="text-green-600" size={18} />
              Select Your Location
            </label>
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location}</p>
            )}
            
            <div className="border rounded-xl overflow-hidden bg-gray-50">
               <MapLocationPicker 
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
          <div>
            <label className="text-sm font-medium flex items-center gap-1">
              <Heart size={16} className="text-red-500" /> Food Preferences
            </label>
            {errors.preferences && (
              <p className="text-red-500 text-sm mt-1">{errors.preferences}</p>
            )}

            <select
              className="w-full bg-gray-50 p-3 rounded-lg outline-none"
              onChange={e => setPreferences([e.target.value])}
            >
              <option disabled selected>Choose a preference</option>
              <option>Veg</option>
              <option>Non-Veg</option>
              <option>Chef Specials</option>
            </select>
          </div>

          {/* Bio */}
          <div>
            <label className="text-sm font-medium flex items-center gap-1">
              <FileText size={16} /> Bio
            </label>
            {errors.bio && (
              <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
            )}

            <textarea
              rows={4}
              placeholder="Tell us something about you..."
              className="w-full bg-gray-50 p-3 rounded-lg outline-none"
              onChange={e => setBio(e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <div>
                       <label className="text-sm font-medium flex items-center gap-1">
                            <ImageIcon size={16} />
                            Update Profile Image
                        </label>
                       {errors.preferences && (
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
            Create Profile
          </button>
        </form>
      </div>
    </div>
  );
}
