import { useEffect, useState } from 'react';
import {
  getRecentBlogsApi,
  getRecentFoodSpotsApi,
  getRecentRecipesApi,
  userDashboardApi,
} from '@/api/foodieApi';
import { getRecentWorkshopsApi } from '@/api/workshopApi';
import { useUserStore } from '@/store/userStore';
import ConfirmModal from '@/components/shared/ConfirmModal';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, MapPin, ChefHat, BookOpen, Calendar } from 'lucide-react';
import { logError } from '@/utils/errorHandler';
import { expandImageUrl } from '@/utils/imageUrl';

interface Recipe {
  _id: string;
  title: string;
  images: string[];
  chefId: {
    firstName: string;
    lastName: string;
  };
  difficulty: string;
  cookingTime: number;
  tags?: string[];
}

interface Blog {
  _id: string;
  heading: string;
  coverImage: string;
  description: string;
  author: {
    firstName: string;
    lastName: string;
  }
}

interface FoodSpot {
  _id: string;
  name: string;
  coverImage: string;
  location: {
    coordinates: number[];
  };
  address: {
    placeName: string;
    city: string;
  };
  speciality: string[];
  tags: string[];
}

interface Workshop {
  _id: string;
  title: string;
  banner: string;
  chefId: {
    firstName: string;
    lastName: string;
    name?: string;
  };
  date: string;
  startTime: string;
  price: number;
}

export default function FoodieDashboard() {

  const { name } = useUserStore();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [foodSpots, setFoodSpots] = useState<FoodSpot[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkFoodieProfile();
    fetchDashboardData();
  }, []);

  async function checkFoodieProfile() {
    try {
      const res = await userDashboardApi();
      if (!res.data.hasProfile) {
        setShowProfileModal(true);
      }
    } catch (error) {
      logError(error);
    }
  }

  async function fetchDashboardData() {
    try {
      setLoading(true);
      const [recipesRes, blogsRes, spotsRes, workshopsRes] = await Promise.all([
        getRecentRecipesApi(3),
        getRecentBlogsApi(3),
        getRecentFoodSpotsApi(3),
        getRecentWorkshopsApi(3)
      ]);

      setRecipes(recipesRes.data.datas || recipesRes.data.data || []);
      setBlogs(blogsRes.data.datas || blogsRes.data.data || []);
      setFoodSpots(spotsRes.data.data || spotsRes.data.datas || []);
      setWorkshops(workshopsRes.data.data || workshopsRes.data.datas || []);
    } catch (error) {
      logError(error, "Error fetching dashboard data");
    } finally {
      setLoading(false);
    }
  }
  console.log('recipes', recipes);
  console.log('blogs', blogs);
  console.log('foodSpots', foodSpots);
  console.log('workshops', workshops);

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">

      {/* Hero Section */}
      <div className="relative mb-16 rounded-[2rem] overflow-hidden shadow-2xl group min-h-[500px]">
        <img
          src="https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1600&h=600&fit=crop"
          alt="Featured Food"
          className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-16 max-w-2xl">
          <span className="text-green-400 font-semibold tracking-wider mb-2 uppercase text-sm">Welcome Back</span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Hello, {name||'Foodie'}! <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-500">
              What are we cooking today?
            </span>
          </h1>
          <p className="text-gray-200 text-lg mb-8 leading-relaxed">
            Discover new recipes, explore local food spots, and join exclusive workshops with top chefs.
          </p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => navigate('/foodie/recipe-listing')} className="px-8 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center gap-2 group/btn">
              Explore Recipes <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Featured Recipes - Modern Card */}
      <section className="mb-20">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <ChefHat className="w-8 h-8 text-green-600" /> Recent Recipes
            </h2>
            <p className="text-gray-500">Fresh from the kitchen</p>
          </div>
          <button onClick={() => navigate('/foodie/recipe-listing')} className="text-green-600 font-semibold hover:text-green-700 flex items-center gap-1 transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? <LoadingSkeleton /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {recipes.length > 0 ? recipes.map(recipe => (
              <div key={recipe._id} onClick={() => navigate(`/foodie/recipe-detail/${recipe._id}`)} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col h-full border border-gray-100 hover:border-green-100">
                <div className="relative h-64 overflow-hidden">
                  <img src={expandImageUrl(recipe.images?.[0])} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-green-700 shadow-sm flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {recipe.cookingTime} min
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="mb-4">
                    <span className="text-xs font-semibold tracking-wide text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase">{recipe?.tags?.[0]}</span>
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-green-700 transition-colors line-clamp-1">{recipe.title}</h3>
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center gap-2">
                    <p className="text-sm text-gray-600 font-medium">By {recipe.chefId?.firstName} {recipe.chefId?.lastName}</p>
                  </div>
                </div>
              </div>
            )) : (
              <p className="col-span-3 text-center text-gray-500 py-12 bg-white rounded-2xl border border-dashed border-gray-300">No recipes found yet.</p>
            )}
          </div>
        )}
      </section>

      {/* Featured Blogs - Magazine Layout */}
      <section className="mb-20">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" /> Culinary Stories
            </h2>
            <p className="text-gray-500">Read the latest from our community</p>
          </div>
          <button onClick={() => navigate('/foodie/blog-listing')} className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 transition-colors">
            Read More <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? <LoadingSkeleton /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {blogs.length > 0 ? blogs.map(blog => (
              <div key={blog._id} onClick={() => navigate(`/foodie/blog-detail/${blog._id}`)} className="group cursor-pointer">
                <div className="relative h-64 rounded-2xl overflow-hidden mb-4 shadow-lg">
                  <img src={expandImageUrl(blog.coverImage)} alt={blog.heading} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors leading-snug">{blog.heading}</h3>
                  <p className="text-gray-600 line-clamp-2 text-sm mb-3 opacity-80">{blog.description}</p>
                  <p className="text-xs text-blue-500 font-semibold">Written by {blog.author?.firstName} {blog.author?.lastName}</p>
                </div>
              </div>
            )) : (
              <p className="col-span-3 text-center text-gray-500 py-12 bg-white rounded-2xl border border-dashed border-gray-300">No blogs posted yet.</p>
            )}
          </div>
        )}
      </section>

      {/* Food Spots - Wide Cards */}
      <section className="mb-20">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <MapPin className="w-8 h-8 text-orange-500" /> Hidden Gems
            </h2>
            <p className="text-gray-500">Explore top-rated spots near you</p>
          </div>
          <button onClick={() => navigate('/foodie/spot-listing')} className="text-orange-500 font-semibold hover:text-orange-600 flex items-center gap-1 transition-colors">
            Discover More <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? <LoadingSkeleton /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {foodSpots.length > 0 ? foodSpots.map(spot => (
              <div key={spot._id} onClick={() => navigate(`/foodie/food-spots/${spot._id}`)} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 cursor-pointer flex flex-col">
                <div className="h-48 overflow-hidden relative">
                  <img src={expandImageUrl(spot.coverImage)} alt={spot.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-white/95 px-3 py-1 rounded-md text-xs font-bold text-gray-800 shadow-sm">
                    {spot.speciality?.[0] || spot.tags?.[0] || 'Food Spot'}
                  </div>
                </div>
                <div className="p-5 flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{spot.name}</h3>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                    <MapPin className="w-3 h-3" /> {spot.address?.placeName || spot.address?.city || 'Location unavailable'}
                  </div>
                </div>
              </div>
            )) : (
              <p className="col-span-3 text-center text-gray-500 py-12 bg-white rounded-2xl border border-dashed border-gray-300">No food spots added yet.</p>
            )}
          </div>
        )}
      </section>

      {/* Workshops - Event Cards */}
      <section className="mb-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Calendar className="w-8 h-8 text-purple-600" /> Upcoming Workshops
            </h2>
            <p className="text-gray-500">Master culinary skills with the pros</p>
          </div>
          {/* <button className="text-purple-600 font-semibold hover:text-purple-700 flex items-center gap-1 transition-colors">
            View Schedule <ArrowRight className="w-4 h-4" />
          </button> */}
        </div>

        {loading ? <LoadingSkeleton /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.length > 0 ? workshops.map(workshop => (
              <div key={workshop._id} onClick={() => navigate(`/foodie/workshop-detail/${workshop._id}`)} className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-purple-100 flex gap-4 items-center">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden shrink-0 shadow-sm">
                  <img src={expandImageUrl(workshop.banner)} alt={workshop.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1 block">Workshop</span>
                  <h3 className="font-bold text-gray-900 mb-1 leading-tight truncate text-lg pr-2" title={workshop.title}>{workshop.title}</h3>
                  <p className="text-sm text-gray-500 mb-1 truncate">with Chef {workshop.chefId?.name}</p>
                  <p className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-purple-500" />
                    {new Date(workshop.date).toLocaleDateString()} • {workshop.startTime}
                  </p>
                </div>
              </div>
            )) : (
              <p className="col-span-3 text-center text-gray-500 py-12 bg-white rounded-2xl border border-dashed border-gray-300">No upcoming workshops.</p>
            )}
          </div>
        )}
      </section>


      <ConfirmModal
        isOpen={showProfileModal}
        title="Complete Your Foodie Profile"
        message="You need to create your foodie profile before accessing the dashboard."
        confirmText="Create Profile"
        cancelText="Later"
        confirmVariant="success"
        onConfirm={() => navigate("/foodie/profile-add")}
        onCancel={() => setShowProfileModal(false)}
      />

    </div>
  );
}
