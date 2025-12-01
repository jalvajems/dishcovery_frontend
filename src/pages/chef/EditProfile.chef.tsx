// Updated ChefProfileEdit component without shadcn imports and with dropdown for specialities

import { useState, useEffect } from "react";
import axios from "axios";
import { Upload, MapPin, Phone, BookOpen, UserCircle } from "lucide-react";
import { getChefProfileApi, updateChefProfileApi } from "@/api/chefApi";
import { showError, showSuccess } from "@/utils/toast";
import { useNavigate } from "react-router-dom";

export default function ChefProfileEdit() {
    const navigate=useNavigate()
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

  const specialityOptions = [
    "Indian",
    "Chinese",
    "Italian",
    "Mexican",
    "Arabic",
    "Kerala",
  ];

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await getChefProfileApi()
        const profile = res.data.data;

        setForm({
          name: profile.userId.name,
          email: profile.userId.email,
          phone: profile.phone || "",
          location: profile.location || "",
          specialities: profile.specialities.join(", ") || "",
          bio: profile.bio || "",
          image: "",
          imagePreview: profile.image || "",
        });
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({
      ...prev,
      image: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        location: form.location,
        specialities: form.specialities,
        bio: form.bio,
        image: form.image,
      };

      const res=await updateChefProfileApi(payload)
      showSuccess(res.data.message||'updated successfully')
      navigate('/chef/profile')
    } catch (err:any) {
      console.error(err);
      showError(err.response.data.message||'failed to updated')
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
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full border border-gray-300 p-3 rounded-xl"
            />

            {form.imagePreview && (
              <img
                src={form.imagePreview}
                alt="preview"
                className="mt-3 w-32 h-32 object-cover rounded-xl border"
              />
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