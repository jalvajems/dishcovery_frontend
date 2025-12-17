import { useState } from "react";
import { Upload, MapPin, Phone, BookOpen, UserCircle } from "lucide-react";
import { createChefProfileApi } from "@/api/chefApi";
import { showError, showSuccess } from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import { useAwsS3Upload } from "@/components/shared/hooks/useAwsS3Upload";


type FormErrors = {
  phone?: string;
  location?: string;
  specialities?: string;
  bio?: string;
  image?: string;
};

export default function CreateChefProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    phone: "",
    location: "",
    specialities: "",
    bio: "",
    image: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { uploadToS3 } = useAwsS3Upload();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const Image = e.target.files[0];
      const url = await uploadToS3(Image);
      setImagePreview(url);
      setForm((prev) => ({ ...prev, image: url }));
      setErrors((prev) => ({ ...prev, image: undefined }));
    }
  };


  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(form.phone))
      newErrors.phone = "Enter a valid 10-digit phone number";

    if (!form.location.trim())
      newErrors.location = "Location is required";

    if (!form.specialities)
      newErrors.specialities = "Please select a speciality";

    if (!form.bio.trim())
      newErrors.bio = "Bio is required";

    if (!form.image)
      newErrors.image = "Profile image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const payload = {
      phone: form.phone,
      location: form.location,
      specialities: form.specialities,
      bio: form.bio,
      image: form.image,
    };

    try {
      const result = await createChefProfileApi(payload);
      showSuccess(result.data.message);
      navigate("/chef/profile");
    } catch (error: any) {
      showError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-lg border border-gray-200 p-8">

        <div className="text-center">
          <h2 className="text-3xl font-bold flex justify-center items-center gap-3">
            <UserCircle size={35} className="text-green-600" />
            Setup Your Chef Profile
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Add your details to complete your chef profile.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-6">

          {imagePreview && (
            <div className="flex justify-center">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover shadow-md"
              />
            </div>
          )}

          <div>
            <label className="font-semibold flex items-center gap-2 mb-1">
              <Phone size={18} /> Phone Number
            </label>

            {errors.phone && (
              <p className="text-red-500 text-sm mb-1">{errors.phone}</p>
            )}

            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="font-semibold flex items-center gap-2 mb-1">
              <MapPin size={18} /> Location
            </label>

            {errors.location && (
              <p className="text-red-500 text-sm mb-1">{errors.location}</p>
            )}

            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter your location"
            />
          </div>

          <div>
            <label className="font-semibold flex items-center gap-2 mb-1">
              <BookOpen size={18} /> Specialities
            </label>

            {errors.specialities && (
              <p className="text-red-500 text-sm mb-1">{errors.specialities}</p>
            )}

            <select
              name="specialities"
              value={form.specialities}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300"
            >
              <option value="">Select speciality</option>
              {["Indian", "Chinese", "Italian", "Mexican", "Arabic", "Kerala"].map(
                (s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="font-semibold mb-1">Bio</label>

            {errors.bio && (
              <p className="text-red-500 text-sm mb-1">{errors.bio}</p>
            )}

            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300 min-h-[120px] focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Write something about yourself..."
            />
          </div>

          <div>
            <label className="font-semibold mb-2 flex items-center gap-2">
              <Upload size={18} /> Profile Image
            </label>

            {errors.image && (
              <p className="text-red-500 text-sm mb-1">{errors.image}</p>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full border border-gray-300 p-3 rounded-xl"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-lg font-semibold transition"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
