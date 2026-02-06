import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Award, Trophy, Lightbulb, MessageSquare, UserCircle, Pencil, Mail, ChevronRight, Home } from "lucide-react";
import {
  getChefProfileApi,
} from "@/api/chefApi";
import { useAuthStore } from "@/store/authStore";
import ChefNavbar from "@/components/shared/chef/NavBar.chef";
import { useUserStore } from "@/store/userStore";
import ChefReviewSection from "@/components/shared/ChefReviewSection";
import { getFollowersApi } from "@/api/followApi";

export default function ChefProfilePage() {
  const id = useAuthStore.getState().user?._id
  const navigate = useNavigate()
  const { setUserStore } = useUserStore()

  const [chef, setChef] = useState<any>(null);
  const [followers, setFollowers] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    async function fetchData() {
      try {
        const chefRes = await getChefProfileApi()
        const followers = await getFollowersApi()
        console.log("--------fff", followers);
        setFollowers(followers.data.datas)


        setChef(chefRes.data.datas);
        setReviews(chefRes.data.reviews || []);
      } catch (error: any) {
        // showError(error?.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);
  console.log('chef', chef);

  useEffect(() => {
    setUserStore(chef?.chefId?.name, chef?.chefId?.email, chef?.image)

  }, [chef])

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-semibold">
        Loading profile...
      </div>
    );

  if (!chef)
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-semibold">
        Profile not found!
      </div>
    );

  const handleEditButton = () => {
    navigate('/chef/profile-edit')
  }
  console.log('------', chef);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <ChefNavbar />

      {/* Hero Header */}
      <div className="relative h-64 bg-emerald-600 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1600&h=400&fit=crop')] bg-cover bg-center opacity-20"></div>

        {/* Breadcrumb */}
        <div className="absolute top-6 left-6 md:left-12 flex items-center gap-2 text-white/80 text-sm font-medium z-20">
          <div
            onClick={() => navigate('/chef/dashboard')}
            className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors"
          >
            <Home size={14} />
            <span>Dashboard</span>
          </div>
          <ChevronRight size={14} />
          <span className="text-white">My Profile</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-32 relative z-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 border border-gray-100 overflow-hidden">

          {/* Action Buttons (Floating Top Right) */}
          <div className="absolute top-6 right-6 flex gap-3">
            <button
              onClick={handleEditButton}
              className="p-3 bg-white/90 backdrop-blur-md text-gray-700 hover:text-emerald-600 rounded-2xl shadow-lg border border-gray-100 transition-all hover:scale-110 active:scale-95 group"
              title="Edit Profile"
            >
              <Pencil size={20} className="group-hover:rotate-12 transition-transform" />
            </button>
          </div>

          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
              {/* Profile Image */}
              <div className="relative group">
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-[2rem] overflow-hidden shadow-2xl ring-8 ring-emerald-50 transition-transform group-hover:scale-[1.02]">
                  <img
                    src={chef.image || "/default-avatar.png"}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-0 px-4 py-2 bg-emerald-500 text-white rounded-2xl shadow-lg border-2 border-white font-bold text-sm">
                  Chef
                </div>
              </div>

              {/* Basic Info */}
              <div className="flex-1 space-y-4 py-2">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                    {chef.chefId.name}
                  </h1>
                  <p className="text-lg text-emerald-600 font-bold mt-2">
                    {chef.specialities?.[0] || "Culinary Artist"}
                  </p>
                  <p className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2 mt-1">
                    <Mail size={18} className="text-emerald-500" />
                    {chef.chefId.email}
                  </p>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed max-w-2xl italic">
                  "{chef.bio || "Crafting a culinary journey, one dish at a time."}"
                </p>

                {/* Stats Row */}
                <div className="flex flex-wrap justify-center md:justify-start gap-8 pt-4">
                  <div
                    onClick={() => navigate('/chef/followers')}
                    className="text-center md:text-left cursor-pointer group hover:opacity-80 transition-all"
                  >
                    <span className="block text-2xl font-black text-gray-900 group-hover:text-emerald-600 transition-colors">{followers?.length || 0}</span>
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest group-hover:text-emerald-500 transition-colors">Followers</span>
                  </div>
                  <div className="text-center md:text-left">
                    <span className="block text-2xl font-black text-gray-900">{chef.certificates?.length || 0}</span>
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Certificates</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="my-12 border-gray-100" />

            {/* Credentials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Certificates */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-gray-100 hover:border-emerald-200 transition-colors">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
                  <Award className="w-6 h-6 text-emerald-600" /> Certificates
                </h3>
                {chef.certificates && chef.certificates.length > 0 ? (
                  <ul className="space-y-3">
                    {chef.certificates.map((cert: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600 text-sm font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                        {cert}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-sm italic">No certificates added.</p>
                )}
              </div>

              {/* Achievements */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-gray-100 hover:border-emerald-200 transition-colors">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
                  <Trophy className="w-6 h-6 text-emerald-600" /> Achievements
                </h3>
                {chef.achievements && chef.achievements.length > 0 ? (
                  <ul className="space-y-3">
                    {chef.achievements.map((ach: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600 text-sm font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                        {ach}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-sm italic">No achievements added.</p>
                )}
              </div>

              {/* Skills */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-gray-100 hover:border-emerald-200 transition-colors">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
                  <Lightbulb className="w-6 h-6 text-emerald-600" /> Skills
                </h3>
                {chef.skills && chef.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {chef.skills.map((skill: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm italic">No skills added.</p>
                )}
              </div>
            </div>

            {/* REVIEWS SECTION */}
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <MessageSquare className="text-emerald-600" size={24} /> Reviews & Ratings
              </h2>
              <div className="bg-slate-50 rounded-[2rem] p-6 md:p-8 border border-gray-100">
                <ChefReviewSection reviewableId={chef.chefId._id} reviewableType="Chef" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
