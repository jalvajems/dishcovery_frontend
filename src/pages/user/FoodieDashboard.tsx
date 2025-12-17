import { useEffect, useState } from 'react';
import { userDashboardApi } from '@/api/foodieApi';
import { useUserStore } from '@/store/userStore';
import ConfirmModal from '@/components/shared/ConfirmModal';
import { useNavigate } from 'react-router-dom';

export default function FoodieDashboard() {

  const {name}=useUserStore()
  const [showProfileModal, setShowProfileModal] = useState(false);
  const navigate=useNavigate()
  

  useEffect(() => {
    checkFoodieProfile();
  }, []);
  
  async function checkFoodieProfile() {
    try {
      const res = await userDashboardApi();
  console.log('has=========',res.data.hasProfile);
  
      if (!res.data.hasProfile) {
        setShowProfileModal(true);
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  
  const featuredRecipes = [
    { id: 1, title: 'Delicious Pasta Carbonara', chef: 'Chef Isabella Rossi', images: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=400&fit=crop' },
    { id: 2, title: 'Spicy Thai Green Curry', chef: 'Chef Ethan Lee', images: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=400&fit=crop' },
    { id: 3, title: 'Classic French Ratatouille', chef: 'Chef Olivia Dubois', images: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop' }
  ];

  const featuredBlogs = [
    { id: 1, title: 'The Art of Sourdough Baking', desc: 'Learn the secrets to perfect sourdough.', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop' },
    { id: 2, title: 'Exploring Global Street Food', desc: 'A culinary journey through street food.', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop' },
    { id: 3, title: 'Sustainable Cooking Practices', desc: 'Tips for eco-friendly cooking.', image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&h=300&fit=crop' }
  ];

  const foodSpots = [
    { id: 1, name: 'The Cozy Corner Cafe', desc: 'A charming cafe with a warm atmosphere.', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=400&fit=crop' },
    { id: 2, name: 'The Spice Route', desc: 'Authentic Indian cuisine with bold flavors.', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop' },
    { id: 3, name: 'The Green Table', desc: 'Fresh, locally sourced ingredients.', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=400&fit=crop' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-8">

      {/* Hero */}
      <div className="relative mb-12 rounded-3xl overflow-hidden shadow-2xl group">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop"
          alt="Featured Food"
          className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-10">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Welcome back, {name}!
          </h1>
          <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all w-fit shadow-lg">
            Find your taste
          </button>
          <p className="text-white/90 mt-4 text-lg">
            Explore new recipes, workshops, and food spots tailored just for you
          </p>
        </div>
      </div>

      {/* Featured Recipes */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">Featured Recipes</h2>
        <div className="grid grid-cols-3 gap-6">
          {featuredRecipes.map(recipe => (
            <div key={recipe.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:-translate-y-2 transition-all duration-300 group">
              <div className="relative h-56 overflow-hidden">
                <img src={recipe.images} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900">{recipe.title}</h3>
                <p className="text-sm text-green-600 font-medium">{recipe.chef}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Blogs */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">Featured Blogs</h2>
        <div className="grid grid-cols-3 gap-6">
          {featuredBlogs.map(blog => (
            <div key={blog.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:-translate-y-2 transition-all duration-300 group">
              <div className="h-48 overflow-hidden">
                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 text-gray-900">{blog.title}</h3>
                <p className="text-sm text-gray-600">{blog.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Workshop */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">Upcoming Workshops</h2>
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm mb-4">Workshop</span>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Sushi Making Masterclass</h3>
              <p className="text-gray-600 mb-6 max-w-xl">Learn sushi-making with Chef Kenji Tanaka.</p>
              <button className="px-8 py-3 bg-gray-900 text-white rounded-full font-semibold hover:scale-105 transition-all">
                Book Now
              </button>
            </div>
            <div className="w-64 h-48 rounded-2xl overflow-hidden shadow-xl">
              <img src="https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop" alt="Sushi" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Food Spots */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">Food Spots</h2>
        <div className="grid grid-cols-3 gap-6">
          {foodSpots.map(spot => (
            <div key={spot.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:-translate-y-2 transition-all duration-300 group">
              <div className="h-56 overflow-hidden">
                <img src={spot.image} alt={spot.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900">{spot.name}</h3>
                <p className="text-sm text-gray-600">{spot.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Donation Events */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">Donation Events</h2>
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <span className="inline-block px-4 py-1 bg-orange-100 text-orange-700 rounded-full text-sm mb-4">Donation Event</span>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Feed the Community</h3>
              <p className="text-gray-600 mb-6 max-w-xl">Support meals for those in need.</p>
              <button className="px-8 py-3 bg-orange-500 text-white rounded-full font-semibold hover:scale-105 transition-all">
                Donate Now
              </button>
            </div>
            <div className="w-64 h-48 rounded-2xl overflow-hidden shadow-xl">
              <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop" alt="Donation" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>
       <ConfirmModal
        isOpen={showProfileModal}
        title="Complete Your Chef Profile"
        message="You need to create your chef profile before accessing the dashboard."
        confirmText="Create Profile"
        cancelText="Later"
        confirmVariant="success"
        onConfirm={() => navigate("/foodie/profile-add")}
        onCancel={() => setShowProfileModal(false)}
      />

    </div>
  );
}
