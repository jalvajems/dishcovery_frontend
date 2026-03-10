import { useEffect, useState } from "react";
import { chefDashboardApi, getAllRecipeApi, getMyBlogsChefApi } from "@/api/chefApi";
import { Utensils, Star, Users } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { useNavigate } from "react-router-dom";
import Pagination from "@/components/shared/Pagination";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { getErrorMessage, logError } from "@/utils/errorHandler";
import { showError } from "@/utils/toast";

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
      console.log('----------', res);

      setIsVerifiedUser(res.data.isVerified)
      setIsVerified(res.data.isVerified)

      // Set dashboard stats from API response
      if (res.data.stats) {
        setDashboardStats(res.data.stats);
      }

      if (!res.data.hasProfile) {
        setShowProfileModal(true);
      }

    } catch (error: unknown) {
      logError(error);
      showError(getErrorMessage(error, 'Something went wrong'));
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
      value: dashboardStats.averageRating > 0 ? dashboardStats.averageRating.toFixed(1) : "N/A",
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
      label: "Total Workshops",
      value: dashboardStats.totalWorkshops,
      icon: Utensils,
      footer: "All workshops",
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
      {/* RECENT RECIPES */}
      {/* ------------------------------------------------------ */}
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
        Recent Recipes
      </h2>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {recipes.map((r, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-2xl transition-all cursor-pointer"
          >
            <img
              onClick={() => handleViewButtonRecipe(r._id)}
              src={r.images}
              alt={r.title}
              className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg truncate">{r.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{r.cuisine}</p>
            </div>
          </div>
        ))}
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

      <div className="grid grid-cols-3 gap-6 mb-8">
        {blogs.map((b, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-2xl transition-all cursor-pointer"
          >
            <img
              onClick={() => handleViewButtonBlog(b._id)}
              src={b.coverImage}
              alt={b.title}
              className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg truncate">{b.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{b.tags?.[0] || 'Blog'}</p>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        currentPage={currentPageBlog}
        totalPages={totalPagesBlog}
        onChange={handlePageChange}
      />


    </main>
  );
}
