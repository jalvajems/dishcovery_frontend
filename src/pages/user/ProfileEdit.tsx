import { useState } from 'react';
import { Upload } from 'lucide-react';

export default function EditFoodieProfile() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    preference: '',
    location: '',
    phone: '',
    bio: ''
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    alert('Profile updated successfully!');
  };

  const handleBackToProfile = () => {
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 py-12 px-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-8">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-green-600">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5"/>
            <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2.5"/>
          </svg>
          <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
            Dishcovery
          </span>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 p-10">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-gray-900 via-green-700 to-emerald-700 bg-clip-text text-transparent">
            Edit your foodie profile
          </h1>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className="w-full px-4 py-4 bg-green-50 border border-green-100 rounded-xl text-gray-900 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full px-4 py-4 bg-green-50 border border-green-100 rounded-xl text-gray-900 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Profile Picture */}
            <div>
              <label htmlFor="profilePicture" className="block text-sm font-bold text-gray-900 mb-2">
                Profile Picture
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="profilePicture"
                  className="w-full px-4 py-4 bg-green-50 border border-green-100 rounded-xl text-green-600 flex items-center gap-3 cursor-pointer hover:bg-green-100 transition-all group"
                >
                  <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">
                    {profilePicture ? profilePicture.name : 'Upload your profile picture'}
                  </span>
                </label>
              </div>
            </div>

            {/* Preference */}
            <div>
              <label htmlFor="preference" className="block text-sm font-bold text-gray-900 mb-2">
                Preference
              </label>
              <input
                type="text"
                id="preference"
                name="preference"
                value={formData.preference}
                onChange={handleInputChange}
                placeholder="e.g., Italian, Pastry, Vegan"
                className="w-full px-4 py-4 bg-green-50 border border-green-100 rounded-xl text-gray-900 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-bold text-gray-900 mb-2">
                location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter your location"
                className="w-full px-4 py-4 bg-green-50 border border-green-100 rounded-xl text-gray-900 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-gray-900 mb-2">
                phone number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className="w-full px-4 py-4 bg-green-50 border border-green-100 rounded-xl text-gray-900 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-bold text-gray-900 mb-2">
                bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself"
                rows={5}
                className="w-full px-4 py-4 bg-green-50 border border-green-100 rounded-xl text-gray-900 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                onClick={handleSubmit}
                className="px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all shadow-lg"
              >
                submit
              </button>
              <button
                onClick={handleBackToProfile}
                className="px-10 py-4 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 hover:scale-105 transition-all"
              >
                Back to profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}