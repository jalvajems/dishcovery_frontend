import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, ChevronRight, Award, Trophy, Lightbulb, MessageSquare, UserCircle, Users } from "lucide-react";
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
        const followers= await getFollowersApi()
        console.log("--------fff",followers);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">

      <ChefNavbar />
      <main className="max-w-6xl mx-auto px-8 py-12">

        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-sm mb-8">
          <a href="/chef/dashboard" className="text-green-600 font-semibold hover:underline">Home</a>
          <ChevronRight className="w-4 h-4 text-gray-400" />

          <span className="text-gray-800 font-medium">{chef.chefId.name}</span>
        </div>

        {/* CHEF HEADER */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border p-10 mb-12">
          <div className="flex gap-8 items-start">
            <div className="w-40 h-40 rounded-full overflow-hidden shadow-xl ring-8 ring-green-100">
              <img src={chef.image || "/default-avatar.png"} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-700 to-emerald-700 bg-clip-text text-transparent">
                {chef.chefId.name}
              </h1>

              <p className="text-green-600 font-semibold text-lg mb-3 mt-3">
                Specialty: {chef.specialities?.[0] || "Not added"}
              </p>

              <div className="flex items-center gap-8 mb-4">
                <div
                  onClick={() => navigate('/chef/followers')}
                  className="cursor-pointer group hover:bg-green-50 p-2 rounded-xl transition-all"
                >
                  <div className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    <Users className="text-green-600" size={24} />
                    {/* {stats.followers} */}
                    {followers.length||0}
                  </div>
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-widest group-hover:text-green-600">Followers</div>
                </div>

                <div className="flex items-center gap-6">
                  <button
                    onClick={() => handleEditButton()}
                    className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all shadow-md"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ABOUT SECTION */}
        <div className="bg-white/90 rounded-2xl p-8 shadow-xl mb-12">
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <UserCircle className="w-8 h-8 text-green-600" /> About {chef.chefId.name}
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            {chef.bio || "This chef has not added a bio yet."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 border-t pt-8">
            {/* Certificates */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-700">
                <Award className="w-6 h-6" /> Certificates
              </h3>
              {chef.certificates && chef.certificates.length > 0 ? (
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {chef.certificates.map((cert: string, index: number) => (
                    <li key={index}>{cert}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No certificates added.</p>
              )}
            </div>

            {/* Achievements */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-700">
                <Trophy className="w-6 h-6" /> Achievements
              </h3>
              {chef.achievements && chef.achievements.length > 0 ? (
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {chef.achievements.map((ach: string, index: number) => (
                    <li key={index}>{ach}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No achievements added.</p>
              )}
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-700">
                <Lightbulb className="w-6 h-6" /> Skills
              </h3>
              {chef.skills && chef.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {chef.skills.map((skill: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No skills added.</p>
              )}
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="bg-white/90 rounded-2xl p-8 shadow-xl mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <MessageSquare className="w-8 h-8 text-green-600" /> Reviews & Ratings
          </h2>


          <ChefReviewSection reviewableId={chef.chefId._id} reviewableType="Chef" />
        </div>
      </main>
    </div>
  );
}
