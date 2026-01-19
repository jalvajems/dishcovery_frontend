import { useEffect, useState } from "react";
import { chefDashboardApi, getAllRecipeApi, getMyBlogsChefApi } from "@/api/chefApi";
import { Utensils, Star, Users, Heart } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { useNavigate } from "react-router-dom";
import Pagination from "@/components/shared/Pagination";
import ConfirmModal from "@/components/shared/ConfirmModal";

export default function ChefDashboard() {
  const { name } = useUserStore()
  const navigate = useNavigate()


  const [recipes, setRecipes] = useState([])
  const [currentPageRecipe, setCurrentPageRecipe] = useState(1);
  const [totalPagesRecipe, setTotalPagesRecipe] = useState(1);
  const limit = 5;
  const [currentPageBlog, setCurrentPageBlog] = useState(1);
  const [totalPagesBlog, setTotalPagesBlog] = useState(1);
  const [blogs, setBlogs] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { setIsVerifiedUser } = useUserStore()





  //recipes===============
  const handlePageChangeRecipe = (page: number) => {
    setCurrentPageRecipe(page)
  }
  useEffect(() => {
    fetchRecipes()
  }, [currentPageRecipe, limit])

  async function fetchRecipes() {
    try {

      const res = await getAllRecipeApi(currentPageRecipe, limit);
      setRecipes(res.data.data)

      setTotalPagesRecipe(res.data.totalPages)
      console.log(res.data.data)

    } catch (error: any) {
      // Handle error
    }

  }

  async function handleViewButtonRecipe(id: string) {
    try {
      navigate(`/recipe-detail/${id}`)
    } catch (error) {
      console.error(error)
    }
  }

  //blog=================
  const handlePageChange = (page: number) => {
    setCurrentPageBlog(page)
  }

  useEffect(() => {
    fetchBlogs();
  }, [currentPageBlog, limit]);

  async function fetchBlogs() {

    try {
      const res = await getMyBlogsChefApi(currentPageBlog, limit);

      setTotalPagesBlog(res.data.totalCount)
      setBlogs(res.data.datas);
    } catch (err) {
      console.log(err);
    }
  }






  useEffect(() => {
    checkChefProfile();
  }, []);

  async function checkChefProfile() {
    try {
      const res = await chefDashboardApi();
      console.log('isverified', res.data);

      setIsVerifiedUser(res.data.isVerified)
      setIsVerified(res.data.isVerified)

      if (!res.data.hasProfile) {
        setShowProfileModal(true);
      }

    } catch (error: any) {
      console.error(error);
      // showError(error.response?.data?.message||'something went wrong')
    }
  }


  const stats = [
    {
      label: "Total Recipes",
      value: 48,
      icon: Utensils,
      footer: "2 new this week",
    },
    {
      label: "Average Rating",
      value: "4.8",
      icon: Star,
      footer: "Based on 342 reviews",
    },
    {
      label: "Followers",
      value: "3.4k",
      icon: Users,
      footer: "120 new this week",
    },
    {
      label: "Donations Received",
      value: "₹12k",
      icon: Heart,
      footer: "8 new donations",
    },
  ];

  const activities = [
    {
      title: "Uploaded a New Recipe",
      desc: "Spicy Butter Garlic Shrimp",
      time: "2 hours ago",
    },
    {
      title: "Received a Review",
      desc: "Your Italian Pasta has a new 5 star review",
      time: "5 hours ago",
    },

  ];




  return (
    <main className="flex-1 p-8">
      <ConfirmModal
        isOpen={showProfileModal}
        title="Complete Your Chef Profile"
        message="You need to create your chef profile before accessing the dashboard."
        confirmText="Create Profile"
        cancelText="Later"
        confirmVariant="success"
        onConfirm={() => navigate("/chef/profile-add")}
        onCancel={() => setShowProfileModal(false)}
      />
      {!isVerified && (
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded mb-4 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            Your chef account is not verified yet. You cannot perform actions until admin approval.
          </div>
        </div>
      )}

      {/* ------------------------------------------------------ */}
      {/* HERO SECTION */}
      {/* ------------------------------------------------------ */}
      <div className="relative mb-12 rounded-3xl overflow-hidden shadow-2xl group">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop"
          alt="Featured Food"
          className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        <div className="absolute inset-0 flex flex-col justify-end p-10">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-2xl">
            Welcome back, Chef {name} !
          </h1>
          <p className="text-gray-200 text-lg">
            Here’s your performance overview and recent activity.
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------ */}
      {/* STATS SECTION */}
      {/* ------------------------------------------------------ */}
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
        Dashboard
      </h2>

      <div className="grid grid-cols-4 gap-6 mb-12">
        {stats.map((s, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600 font-semibold">{s.label}</p>
              <s.icon className="w-7 h-7 text-green-600" />
            </div>

            <h3 className="text-4xl font-bold text-gray-900 mb-1">{s.value}</h3>
            <p className="text-gray-400 text-sm">{s.footer}</p>
          </div>
        ))}
      </div>

      {/* ------------------------------------------------------ */}
      {/* ACTIVITIES */}
      {/* ------------------------------------------------------ */}
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
        My Activities
      </h2>

      <div className="grid grid-cols-3 gap-6 mb-12">
        {activities.map((a, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
          >
            <h3 className="text-xl font-bold mb-2">{a.title}</h3>
            <p className="text-gray-600">{a.desc}</p>
            <p className="text-sm text-gray-400 mt-3">{a.time}</p>
          </div>
        ))}
      </div>

      {/* ------------------------------------------------------ */}
      {/* RECENT RECIPES */}
      {/* ------------------------------------------------------ */}
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
        Recent Recipes
      </h2>

      <div className="grid grid-cols-4 gap-6 mb-12">
        {recipes.map((r: any, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-2xl transition-all cursor-pointer"
          >
            <img
              onClick={() => handleViewButtonRecipe(r._id)}
              src={r.images}
              alt={r.title}
              className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg">{r.title}</h3>
            </div>
          </div>
        ))}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">

        </div>
      </div>
      <Pagination
        currentPage={currentPageRecipe}
        totalPages={totalPagesRecipe}
        onChange={handlePageChangeRecipe}
      />
      {/* ------------------------------------------------------ */}
      {/* RECENT blog */}
      {/* ------------------------------------------------------ */}
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
        Recent Blogs
      </h2>

      <div className="grid grid-cols-4 gap-6 mb-12">
        {blogs.map((b: any, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-2xl transition-all cursor-pointer"
          >
            <img
              onClick={() => handleViewButtonRecipe(b._id)}
              src={b.coverImage}
              alt={b.title}
              className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg">{b.title}</h3>
            </div>
          </div>
        ))}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">

        </div>
      </div>
      <Pagination
        currentPage={currentPageBlog}
        totalPages={totalPagesBlog}
        onChange={handlePageChange}
      />


    </main>
  );
}
