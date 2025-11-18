import { useEffect, useState } from 'react';
import { Home, ChefHat, BookOpen, FileText, MapPin, Heart, MessageCircle, Bot, Search, Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { logoutApi } from '@/api/authApi';
import { userDashboardApi } from '@/api/foodieApi';

export default function UserDashboard() {
  const [activeMenu, setActiveMenu] = useState('Home');
  const navigate = useNavigate();

  useEffect(()=>{
     userDashboardApi()
  },[])

  const handleLogout = async() => {
    await logoutApi()
    useAuthStore.getState().logout()
    navigate("/login", { replace: true });
  };


  const menuItems = [
    { icon: Home, label: 'Home' },
    { icon: ChefHat, label: 'Chef' },
    { icon: BookOpen, label: 'Recipes' },
    { icon: FileText, label: 'Blogs' },
    { icon: MapPin, label: 'Workshops' },
    { icon: MapPin, label: 'Food Spots' },
    { icon: Heart, label: 'Donations' },
    { icon: MessageCircle, label: 'Chat' },
    { icon: Bot, label: 'AI Chef' },
    { icon: LogOut, label: 'Logout' }

  ];

  const featuredRecipes = [
    { id: 1, title: 'Delicious Pasta Carbonara', chef: 'Chef Isabella Rossi', image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=400&fit=crop' },
    { id: 2, title: 'Spicy Thai Green Curry', chef: 'Chef Ethan Lee', image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=400&fit=crop' },
    { id: 3, title: 'Classic French Ratatouille', chef: 'Chef Olivia Dubois', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop' }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-green-600">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
              Dishcovery
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search recipes, chefs, spots..."
                className="pl-10 pr-4 py-2 w-80 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
              />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold shadow-lg">
              J
            </div>
          </div>
        </div>
      </nav>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className="w-64 bg-white/80 backdrop-blur-sm min-h-screen p-6 sticky top-20 h-fit shadow-lg rounded-r-3xl">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold shadow-md">
              J
            </div>
            <div>
              <p className="font-semibold text-gray-900">Jalva</p>
              <p className="text-xs text-gray-500">Food Enthusiast</p>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() =>
                    item.label === "Logout" ? handleLogout() : setActiveMenu(item.label)
                  }

                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-200 scale-105'
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Hero Section */}
          <div className="relative mb-8 rounded-3xl overflow-hidden shadow-2xl group">
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop"
              alt="Featured Food"
              className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-10">
              <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
                Welcome back, Jalva!
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
                <div key={recipe.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                  <div className="relative h-56 overflow-hidden">
                    <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-1 text-gray-900">{recipe.title}</h3>
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
                <div key={blog.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                  <div className="relative h-48 overflow-hidden">
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

          {/* Upcoming Workshops */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">Upcoming Workshops</h2>
            <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">Workshop</span>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Sushi Making Masterclass</h3>
                  <p className="text-gray-600 mb-6 max-w-xl">Join Chef Kenji Tanaka for an immersive sushi-making experience. Learn to prepare and roll your own sushi.</p>
                  <button className="px-8 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all">
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
                <div key={spot.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                  <div className="relative h-56 overflow-hidden">
                    <img src={spot.image} alt={spot.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-1 text-gray-900">{spot.name}</h3>
                    <p className="text-sm text-gray-600">{spot.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Donation Events */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">Donation Events</h2>
            <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <span className="inline-block px-4 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-4">Donation Event</span>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Feed the Community</h3>
                  <p className="text-gray-600 mb-6 max-w-xl">Support our initiative to provide meals for those in need. Donate or volunteer today.</p>
                  <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all">
                    Donate Now
                  </button>
                </div>
                <div className="w-64 h-48 rounded-2xl overflow-hidden shadow-xl">
                  <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop" alt="Community" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg mt-12">
            <div className="flex flex-wrap justify-center gap-8 mb-6">
              <a href="#" className="text-green-600 hover:text-green-700 font-medium transition-colors">About</a>
              <a href="#" className="text-green-600 hover:text-green-700 font-medium transition-colors">Contact</a>
              <a href="#" className="text-green-600 hover:text-green-700 font-medium transition-colors">FAQ</a>
              <a href="#" className="text-green-600 hover:text-green-700 font-medium transition-colors">Terms & Conditions</a>
              <a href="#" className="text-green-600 hover:text-green-700 font-medium transition-colors">Privacy Policy</a>
            </div>

            <div className="flex justify-center gap-4 mb-6">
              <a href="#" className="p-3 bg-green-100 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a href="#" className="p-3 bg-green-100 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="white" />
                </svg>
              </a>
              <a href="#" className="p-3 bg-green-100 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
            </div>

            <p className="text-center text-gray-600 text-sm">
              © 2023 Dishcovery. All rights reserved.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}