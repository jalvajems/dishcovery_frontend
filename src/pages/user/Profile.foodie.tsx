import { useEffect, useState } from "react";
import { ChevronRight, LogOut, Pencil } from "lucide-react";
import { getFoodieProfileApi } from "@/api/foodieApi";
import { showError } from "@/utils/toast";
import { useNavigate } from "react-router-dom";

export default function ProfileFoodie() {
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await getFoodieProfileApi();
        setProfile(res.data.data.data);
        console.log('res====',res.data.data);
        
      } catch (error: any) {
        showError(error.response?.data?.message || "Failed to load profile");
      }
    })();
  }, []);
  console.log('profile====',profile);

  if (!profile)
    return (
      <p className="p-10 text-center text-green-700 font-semibold">
        Loading profile...
      </p>
    );

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      {/* Top Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-green-600">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
              <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2.5" />
            </svg>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Dishcovery
            </span>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/foodie/profile-edit")}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow transition flex items-center gap-2"
            >
              <Pencil size={18} /> Edit Profile
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow transition flex items-center gap-2"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Section */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-gray-600">
          <span className="text-green-700 font-semibold hover:underline cursor-pointer">
            Foodie Profile
          </span>
          <ChevronRight className="w-4 h-4 text-gray-500" />
          <span className="font-medium">User Details</span>
        </div>

        {/* Profile Card */}
        <div className="bg-white shadow-xl rounded-3xl p-10 border border-gray-100">
          <div className="flex flex-col items-center gap-6 text-center">

            {/* Avatar */}
            <div className="w-40 h-40 rounded-full overflow-hidden shadow-xl ring-8 ring-green-100">
              <img
                src={profile.image || "/default-avatar.png"}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name + Email */}
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-700 to-emerald-700 bg-clip-text text-transparent">
                {profile.userId?.name || "User"}
              </h1>
              <p className="text-gray-600 text-lg mt-1">{profile.userId?.email}</p>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-green-300 to-transparent my-6"></div>

            {/* Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full text-left">
              <div>
                <p className="text-gray-500 text-sm">Phone Number</p>
                <p className="text-lg font-semibold text-gray-700">
                  {profile.phone || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Location</p>
                <p className="text-lg font-semibold text-gray-700">
                  {profile.location || "Not provided"}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-gray-500 text-sm">Bio</p>
                <p className="text-lg font-medium text-gray-700 whitespace-pre-line">
                  {profile.bio || "No bio added yet."}
                </p>
              </div>

              {/* Preferences */}
              <div className="md:col-span-2">
                <p className="text-gray-500 text-sm mb-2">Preferences</p>

                {profile.preferences?.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {profile.preferences.map((pref: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-green-100 text-green-800 font-semibold rounded-xl text-sm shadow"
                      >
                        {pref}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No preferences added.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/70 backdrop-blur-sm border-t border-gray-200 py-8 mt-16">
        <p className="text-center text-gray-600 text-sm">
          © 2024 Dishcovery — All Rights Reserved
        </p>
      </footer>
    </div>
  );
}
