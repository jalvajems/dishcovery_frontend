// Updated ChefProfileEdit component without shadcn imports and with dropdown for specialities

import { useState, useEffect } from "react";
import axios from "axios";
import { Upload, MapPin, Phone, BookOpen, UserCircle } from "lucide-react";
import { getChefProfileApi, updateChefProfileApi } from "@/api/chefApi";
import { showError, showSuccess } from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import { useAwsS3Upload } from "@/components/shared/hooks/useAwsS3Upload";

export default function ChefProfileEdit() {
  const navigate = useNavigate()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    specialities: "",
    bio: "",
    image: "",
    imagePreview: "",
  });

  type ProfileErrors = {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  specialities?: string;
  bio?: string;
  image?: string;
};

const [errors, setErrors] = useState<ProfileErrors>({});


  const specialityOptions = [
    "Indian",
    "Chinese",
    "Italian",
    "Mexican",
    "Arabic",
    "Kerala",
  ];
  const { uploadToS3 } = useAwsS3Upload()


  const handleImageChange = async (e) => {
    if (e.target.files) {

      const Image = e.target.files?.[0]
      const url = await uploadToS3(Image)
      console.log(url);

      setImagePreview(url)

    }
  };

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await getChefProfileApi()
        const profile = res.data.datas;

        setForm({
          name: profile.chefId.name || "",
          email: profile.chefId.email || "",
          phone: profile.phone || "",
          location: profile.location || "",
          specialities: profile.specialities?.[0] || "",
          bio: profile.bio || "",
          image: profile.image || "",
          imagePreview: "",
        });

        setImagePreview(profile.image || null);

      } catch (err) {
        console.error(err);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateProfile = () => {
  const newErrors: ProfileErrors = {};

  if (!form.name.trim()) {
    newErrors.name = "Name is required";
  }

  if (!form.email.trim()) {
    newErrors.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    newErrors.email = "Enter a valid email address";
  }

  if (!form.phone.trim()) {
    newErrors.phone = "Phone number is required";
  } else if (!/^[6-9]\d{9}$/.test(form.phone)) {
    newErrors.phone = "Enter a valid 10-digit phone number";
  }

  if (!form.location.trim()) {
    newErrors.location = "Location is required";
  }

  if (!form.specialities) {
    newErrors.specialities = "Please select a speciality";
  }

  if (!form.bio.trim()) {
    newErrors.bio = "Bio is required";
  } else if (form.bio.length < 30) {
    newErrors.bio = "Bio must be at least 30 characters";
  }

  if (!imagePreview && !form.image) {
    newErrors.image = "Profile image is required";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  
  const handleSubmit = async (e) => {
    e.preventDefault();
      if (!validateProfile()) return;

    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        location: form.location,
        specialities: [form.specialities],
        bio: form.bio,
        image: imagePreview || form.image,
      };
      
      console.log('formbio=======',payload);

      const res = await updateChefProfileApi(payload)
      showSuccess(res.data.message || 'updated successfully')
      navigate('/chef/profile')
    } catch (err: any) {
      console.error(err);
      showError(err?.response?.data?.message || 'failed to updated')
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-2 mb-6">
          <UserCircle className="w-7 h-7 text-green-600" /> Edit Your Chef Profile
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-6">
          {/* Name */}
          <div>
            <label className="font-semibold mb-1">Name</label>
            {errors.name && (
  <p className="text-red-500 text-sm mb-1 font-medium">
    {errors.name}
  </p>
)}
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="font-semibold mb-1">Email</label>
            {errors.email && (
  <p className="text-red-500 text-sm mb-1 font-medium">
    {errors.email}
  </p>
)}

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="font-semibold flex items-center gap-2 mb-1">
              <Phone size={18} /> Phone Number
            </label>
            {errors.phone && (
  <p className="text-red-500 text-sm mb-1 font-medium">
    {errors.phone}
  </p>
)}
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300"
              placeholder="Enter phone number"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="font-semibold flex items-center gap-2 mb-1">
              <MapPin size={18} /> Location
            </label>
            {errors.location && (
  <p className="text-red-500 text-sm mb-1 font-medium">
    {errors.location}
  </p>
)}

            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300"
              placeholder="Enter your location"
              required
            />
          </div>

          {/* Specialities Dropdown */}
          <div>
            <label className="font-semibold flex items-center gap-2 mb-1">
              <BookOpen size={18} /> Specialities
            </label>
            {errors.specialities && (
  <p className="text-red-500 text-sm mb-1 font-medium">
    {errors.specialities}
  </p>
)}

            <select
              name="specialities"
              value={form.specialities}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300"
            >
              <option value="">Select speciality</option>
              {specialityOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Bio */}
          <div>
            <label className="font-semibold mb-1">Bio</label>
            {errors.bio && (
  <p className="text-red-500 text-sm mb-1 font-medium">
    {errors.bio}
  </p>
)}
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300 min-h-[120px]"
              placeholder="Write something about yourself"
            ></textarea>
          </div>

          {/* Image Upload */}
          <div>
            <label className="font-semibold mb-2 flex items-center gap-2">
              <Upload size={18} /> Profile Image
            </label>
            {errors.image && (
  <p className="text-red-500 text-sm mb-2 font-medium">
    {errors.image}
  </p>
)}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full border border-gray-300 p-3 rounded-xl"
            />

            {imagePreview && (
              <div className="mt-4 flex justify-center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-xl shadow-md"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-lg font-semibold"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}