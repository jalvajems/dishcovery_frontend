import { useEffect, useState } from "react";
import { chefDashboardApi, getAllRecipeApi, getMyBlogsChefApi } from "@/api/chefApi";
import { Utensils, Star, Users } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { useNavigate } from "react-router-dom";
import Pagination from "@/components/shared/Pagination";
import ConfirmModal from "@/components/shared/ConfirmModal";
import {  logError } from "@/utils/errorHandler";

interface Recipe {
  _id: string;
  title: string;
  images: string;
  cuisine: string;
}

interface Blog {
  _id: string;
  title: string;
  coverImage: string;
  tags: string[];
}

export default function ChefDashboard() {
  const { name } = useUserStore()
  const navigate = useNavigate()

  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [currentPageRecipe, setCurrentPageRecipe] = useState(1);
  const [totalPagesRecipe, setTotalPagesRecipe] = useState(1);
  const limit = 5;
  const [currentPageBlog, setCurrentPageBlog] = useState(1);
  const [totalPagesBlog, setTotalPagesBlog] = useState(1);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { setIsVerifiedUser } = useUserStore()
  const [dashboardStats, setDashboardStats] = useState({
    totalRecipes: 0,
    averageRating: 0,
    totalFollowers: 0,
    totalWorkshops: 0
  });

  //recipes===============
  const handlePageChangeRecipe = (page: number) => {
    setCurrentPageRecipe(page)
  }
  useEffect(() => {
    fetchRecipes()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageRecipe, limit])

  async function fetchRecipes() {
    try {
      const res = await getAllRecipeApi(currentPageRecipe, limit);
      setRecipes(res.data.data)
      setTotalPagesRecipe(res.data.totalPages)
    } catch (error: unknown) {
      logError(error);
    }
  }

  async function handleViewButtonRecipe(id: string) {
    try {
      navigate(`/recipe-detail/${id}`)
    } catch (error) {
      console.error(error)
    }
  }
  async function handleViewButtonBlog(id: string) {
    try {
      navigate(`/blog-detail/${id}`)
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkChefProfile() {
    try {
      const res = await chefDashboardApi();
      setIsVerifiedUser(res.data.isVerified)
      setIsVerified(res.data.isVerified)

      if (res.data.stats) {
        setDashboardStats(res.data.stats);
      }

      if (!res.data.hasProfile) {
        setShowProfileModal(true);
      }

    } catch (error: unknown) {
      logError(error);
    }
  }

  const stats = [
    {
      label: "Total Recipes",
      value: dashboardStats.totalRecipes,
      icon: Utensils,
      footer: "Published recipes",
    },
    {
      label: "Average Rating",
      value: dashboardStats.averageRating > 0 ? dashboardStats.averageRating.toFixed(1) : "0",
      icon: Star,
      footer: "From chef reviews",
    },
    {
      label: "Followers",
      value: dashboardStats.totalFollowers,
      icon: Users,
      footer: "Total followers",
    },
    {
      label: "Workshops",
      value: dashboardStats.totalWorkshops,
      icon: Utensils,
      footer: "All workshops",
    },
  ];

  return (
    <main className="flex-1 p-4 md:p-8">
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
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded-xl mb-6 overflow-hidden border border-yellow-200">
          <div className="animate-marquee whitespace-nowrap text-sm font-medium">
            Your chef account is not verified yet. You cannot perform actions until admin approval.
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative mb-8 md:mb-12 rounded-3xl overflow-hidden shadow-2xl group">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop"
          alt="Featured Food"
          className="w-full h-48 md:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
          <h1 className="text-2xl md:text-5xl font-bold text-white mb-2 md:mb-4 drop-shadow-2xl">
            Welcome back, Chef {name}!
          </h1>
          <p className="text-gray-200 text-sm md:text-lg opacity-90">
            Here’s your performance overview and recent activity.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
        Overview
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
        {stats.map((s, index) => (
          <div
            key={index}
            className="bg-white p-4 md:p-6 rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer border border-gray-100 group"
          >
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <p className="text-xs md:text-sm text-gray-600 font-semibold uppercase tracking-wider">{s.label}</p>
              <s.icon className="w-5 h-5 md:w-7 md:h-7 text-green-600 group-hover:scale-110 transition-transform" />
            </div>

            <h3 className="text-2xl md:text-4xl font-bold text-gray-900 mb-1">{s.value}</h3>
            <p className="text-gray-400 text-[10px] md:text-sm">{s.footer}</p>
          </div>
        ))}
      </div>

      {/* Recent Recipes */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
          Recent Recipes
        </h2>
        <button onClick={() => navigate('/recipe-listing')} className="text-green-600 font-bold text-sm hover:underline">View All</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {recipes.map((r, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-md overflow-hidden group hover:shadow-2xl transition-all cursor-pointer border border-gray-50"
            onClick={() => handleViewButtonRecipe(r._id)}
          >
            <div className="h-48 overflow-hidden">
              <img
                src={typeof r.images === 'string' ? r.images : r.images[0]}
                alt={r.title}
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg truncate group-hover:text-green-600 transition-colors uppercase tracking-tight">{r.title}</h3>
              <p className="text-xs text-green-600 font-bold mt-1 bg-green-50 inline-block px-2 py-0.5 rounded uppercase">{r.cuisine}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mb-12 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-100">
        <Pagination
          currentPage={currentPageRecipe}
          totalPages={totalPagesRecipe}
          onChange={handlePageChangeRecipe}
        />
      </div>

      {/* Recent Blogs */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
          Recent Blogs
        </h2>
        <button onClick={() => navigate('/blog-list')} className="text-green-600 font-bold text-sm hover:underline">View All</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {blogs.map((b, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-md overflow-hidden group hover:shadow-2xl transition-all cursor-pointer border border-gray-50"
            onClick={() => handleViewButtonBlog(b._id)}
          >
            <div className="h-48 overflow-hidden">
              <img
                src={b.coverImage}
                alt={b.title}
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg truncate group-hover:text-green-600 transition-colors uppercase tracking-tight">{b.title}</h3>
              <p className="text-xs text-blue-600 font-bold mt-1 bg-blue-50 inline-block px-2 py-0.5 rounded uppercase">{b.tags?.[0] || 'Blog'}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mb-20 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-100">
        <Pagination
          currentPage={currentPageBlog}
          totalPages={totalPagesBlog}
          onChange={handlePageChange}
        />
      </div>
    </main>
  );
}
