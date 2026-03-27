import { useEffect, useState } from "react";
import { LogOut, Pencil, Heart, Users, MapPin, Mail, Phone, Settings, ChevronRight, Home } from "lucide-react";
import { getFoodieProfileApi, getSavedRecipeApi, getSavedBlogsApi, getSavedFoodSpotsApi } from "@/api/foodieApi";
import { getFollowingApi } from "@/api/followApi";
import { showError } from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { useAuthStore } from "@/store/authStore";
import { logoutApi } from "@/api/authApi";
import FoodieNavbar from "@/components/shared/foodie/Navbar.foodie";
import Pagination from "@/components/shared/Pagination";
import { getErrorMessage } from "@/utils/errorHandler";
import type { IFoodieProfile } from "@/types/profile.types";
import type { IFollower } from "@/types/follower.types";
import type { IRecipe } from "@/types/recipe.types";
import type { IBlog } from "@/types/blog.types";
import type { IFoodSpot } from "@/types/foodSpot.types";

export default function ProfileFoodie() {
  const [profile, setProfile] = useState<IFoodieProfile | null>(null);
  const [followedChefs, setFollowedChefs] = useState<IFollower[]>([]);

  const [savedRecipe, setSavedRecipe] = useState<IRecipe[] | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [savedBlogs, setSavedBlogs] = useState<IBlog[] | null>(null);
  const [blogPage, setBlogPage] = useState(1);
  const [blogTotalPages, setBlogTotalPages] = useState(1);

  const [savedFoodSpots, setSavedFoodSpots] = useState<IFoodSpot[] | null>(null);
  const [spotPage, setSpotPage] = useState(1);
  const [spotTotalPages, setSpotTotalPages] = useState(1);

  const limit = 3;
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { setUserStore } = useUserStore();
  const { logout } = useAuthStore();

  const { delUserStore } = useUserStore()

  useEffect(() => {
    (async () => {
      try {
        const [profileRes] = await Promise.all([
          getFoodieProfileApi(),
        ]);

        const profileData = profileRes.data.data.data;
        setProfile(profileData);
        const response = await getFollowingApi();
        setFollowedChefs(response.data.datas);
        // Stats fetching removed as state was unused
      } catch (error: unknown) {
        showError(getErrorMessage(error, "Failed to load profile"));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const recipeRes = await getSavedRecipeApi(page, limit);
        setSavedRecipe(recipeRes.data.data);
        setTotalPages(recipeRes.data.totalPages);
      } catch (error: unknown) {
        showError(getErrorMessage(error, "Failed to load saved recipes"));
      }
    })();
  }, [page]);

  useEffect(() => {
    (async () => {
      try {
        const blogRes = await getSavedBlogsApi(blogPage, limit);
        setSavedBlogs(blogRes.data.data);
        setBlogTotalPages(blogRes.data.totalPages);
      } catch (error: unknown) {
        showError(getErrorMessage(error, "Failed to load saved blogs"));
      }
    })();
  }, [blogPage]);

  useEffect(() => {
    (async () => {
      try {
        const spotRes = await getSavedFoodSpotsApi(spotPage, limit);
        setSavedFoodSpots(spotRes.data.data);
        setSpotTotalPages(spotRes.data.totalPages);
      } catch (error: unknown) {
        showError(getErrorMessage(error, "Failed to load saved food spots"));
      }
    })();
  }, [spotPage]);

  console.log('saved---', savedRecipe);


  useEffect(() => {
    setUserStore(profile?.userId?.name || '', profile?.userId?.email || '', profile?.image || '')

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  if (loading || !profile)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );

  const handleLogout = async () => {

    localStorage.removeItem("token");
    await logoutApi();
    logout()
    delUserStore()
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <FoodieNavbar />

      {/* Hero Header */}
      <div className="relative h-64 bg-emerald-600 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1600&h=400&fit=crop')] bg-cover bg-center opacity-20"></div>

        {/* Breadcrumb */}
        <div className="absolute top-6 left-6 md:left-12 flex items-center gap-2 text-white/80 text-sm font-medium z-20">
          <div
            onClick={() => navigate('/foodie/dashboard')}
            className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors"
          >
            <Home size={14} />
            <span>Home</span>
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
              onClick={() => navigate(`/foodie/profile-edit/${profile.userId}`)}
              className="p-3 bg-white/90 backdrop-blur-md text-gray-700 hover:text-emerald-600 rounded-2xl shadow-lg border border-gray-100 transition-all hover:scale-110 active:scale-95 group"
              title="Edit Profile"
            >
              <Pencil size={20} className="group-hover:rotate-12 transition-transform" />
            </button>
            <button
              onClick={handleLogout}
              className="p-3 bg-white/90 backdrop-blur-md text-red-500 hover:bg-red-50 rounded-2xl shadow-lg border border-gray-100 transition-all hover:scale-110 active:scale-95"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>

          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
              {/* Profile Image */}
              <div className="relative group">
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-[2rem] overflow-hidden shadow-2xl ring-8 ring-emerald-50 transition-transform group-hover:scale-[1.02]">
                  <img
                    src={profile.image || "/default-avatar.png"}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-0 px-4 py-2 bg-emerald-500 text-white rounded-2xl shadow-lg border-2 border-white font-bold text-sm">
                  Foodie
                </div>
              </div>

              {/* Basic Info */}
              <div className="flex-1 space-y-4 py-2">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                    {profile.userId?.name}
                  </h1>
                  <p className="text-lg text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2 mt-2">
                    <Mail size={18} className="text-emerald-500" />
                    {profile.userId?.email}
                  </p>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed max-w-2xl italic">
                  "{profile.bio || "Crafting a culinary journey, one dish at a time."}"
                </p>

                {/* Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-6 pt-6">
                  
                  <div
                    onClick={() => navigate("/foodie/followings")}
                    className="text-center md:text-left cursor-pointer group hover:opacity-80 transition-all"
                  >
                    <span className="block text-2xl font-black text-gray-900 group-hover:text-emerald-600 transition-colors">{followedChefs?.length || 0}</span>
                    <span className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest group-hover:text-emerald-500 transition-colors">Following Chefs</span>
                  </div>
                  <div className="text-center md:text-left">
                    <span className="block text-2xl font-black text-gray-900">{profile.preferences?.length || 0}</span>
                    <span className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest">Preferences</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="my-12 border-gray-100" />

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-slate-50 p-6 rounded-3xl border border-gray-100 group hover:border-emerald-200 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                    <MapPin size={20} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Location</h3>
                </div>
                <p className="text-gray-600 font-semibold pl-14">
                  {profile.address || "Not provided"}
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-gray-100 group hover:border-emerald-200 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                    <Phone size={20} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Contact</h3>
                </div>
                <p className="text-gray-600 font-semibold pl-14">
                  {profile.phone || "Not provided"}
                </p>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="mb-16">
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <Settings className="text-emerald-600" size={24} /> My Food Preferences
              </h2>
              {profile.preferences && profile.preferences.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {profile.preferences?.map((pref: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-6 py-2.5 bg-white border-2 border-emerald-100 text-emerald-700 font-bold rounded-2xl text-sm shadow-sm hover:shadow-md hover:border-emerald-400 transition-all cursor-default"
                    >
                      {pref}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 p-8 rounded-[2rem] text-center border-2 border-dashed border-gray-200 text-gray-400">
                  No preferences added yet. Edit profile to add some!
                </div>
              )}
            </div>

            {/* Saved Recipes Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <Heart className="text-red-500 fill-red-500" size={24} /> Favorite Recipes
              </h2>

              {!savedRecipe || savedRecipe?.length === 0 ? (
                <div className="bg-slate-50 p-12 rounded-[2rem] text-center border-2 border-dashed border-gray-200">
                  <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">You haven't saved any recipes yet.</p>
                  <button
                    onClick={() => navigate("/foodie/recipe-listing")}
                    className="mt-4 text-emerald-600 font-bold hover:underline"
                  >
                    Explore recipes
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedRecipe?.map((recipe: IRecipe) => (
                      <div
                        key={recipe._id}
                        className="group bg-white rounded-[2rem] shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300"
                      >
                        <div className="h-48 overflow-hidden relative">
                          <img
                            src={recipe.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
                            onClick={() => navigate(`/foodie/recipe-detail/${recipe._id}`)}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                            alt={recipe.title}
                          />
                          <div className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur text-red-500 rounded-xl shadow-md">
                            <Heart size={18} fill="currentColor" />
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                            {recipe.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 font-medium">
                            <Users size={14} />
                            <span>By Chef {recipe.chefId?.name || "Expert"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                      <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onChange={setPage}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Saved Blogs Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <Heart className="text-red-500 fill-red-500" size={24} /> Favorite Blogs
              </h2>

              {!savedBlogs || savedBlogs?.length === 0 ? (
                <div className="bg-slate-50 p-12 rounded-[2rem] text-center border-2 border-dashed border-gray-200">
                  <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">You haven't saved any blogs yet.</p>
                  <button
                    onClick={() => navigate("/foodie/blog-listing")}
                    className="mt-4 text-emerald-600 font-bold hover:underline"
                  >
                    Explore blogs
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedBlogs?.map((blog: IBlog) => (
                      <div
                        key={blog._id}
                        className="group bg-white rounded-[2rem] shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300"
                      >
                        <div className="h-48 overflow-hidden relative">
                          <img
                            src={blog.coverImage || 'https://images.unsplash.com/photo-1493770348161-369560ae357d'}
                            onClick={() => navigate(`/foodie/blog-detail/${blog._id}`)}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                            alt={blog.title}
                          />
                          <div className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur text-red-500 rounded-xl shadow-md">
                            <Heart size={18} fill="currentColor" />
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                            {blog.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 font-medium">
                            <Users size={14} />
                            <span>By {typeof blog.chefId === 'object' ? blog.chefId?.name : 'Chef'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {blogTotalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                      <Pagination
                        currentPage={blogPage}
                        totalPages={blogTotalPages}
                        onChange={setBlogPage}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Saved FoodSpots Section */}
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <Heart className="text-red-500 fill-red-500" size={24} /> Favorite Food Spots
              </h2>

              {!savedFoodSpots || savedFoodSpots?.length === 0 ? (
                <div className="bg-slate-50 p-12 rounded-[2rem] text-center border-2 border-dashed border-gray-200">
                  <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">You haven't saved any food spots yet.</p>
                  <button
                    onClick={() => navigate("/foodie/foodspots")}
                    className="mt-4 text-emerald-600 font-bold hover:underline"
                  >
                    Explore food spots
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedFoodSpots?.map((spot: IFoodSpot) => (
                      <div
                        key={spot._id}
                        className="group bg-white rounded-[2rem] shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300"
                      >
                        <div className="h-48 overflow-hidden relative">
                          <img
                            src={spot.coverImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'}
                            onClick={() => navigate(`/foodie/foodspot/${spot._id}`)}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                            alt={spot.name}
                          />
                          <div className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur text-red-500 rounded-xl shadow-md">
                            <Heart size={18} fill="currentColor" />
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                            {spot.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 font-medium">
                            <MapPin size={14} />
                            <span>{spot.address?.city}, {spot.address?.state}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {spotTotalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                      <Pagination
                        currentPage={spotPage}
                        totalPages={spotTotalPages}
                        onChange={setSpotPage}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
