import { useEffect, useState } from 'react';
import { Home, BookOpen, Utensils, FileText, MessageCircle, User, Search, Bell, Edit, Eye, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { logoutApi } from '@/api/authApi';
import { chefDashboardApi } from '@/api/chefApi';

export default function ChefDashboard() {
  const [activeMenu, setActiveMenu] = useState('Home');
  const navigate = useNavigate();
const { logout } = useAuthStore();

useEffect(()=>{
     chefDashboardApi()
  },[])

const handleLogout = async() => {
  await logoutApi()
  logout();
  navigate("/login", { replace: true });
};


  const menuItems = [
    { icon: Home, label: 'Home' },
    { icon: BookOpen, label: 'Recipes' },
    { icon: Utensils, label: 'Workshops' },
    { icon: FileText, label: 'Blogs' },
    { icon: MessageCircle, label: 'Chat' },
    { icon: User, label: 'Profile' },
    { icon: LogOut, label: 'Logout'}
  ];

  const stats = [
    { label: 'Total Recipes', value: '125', color: 'from-blue-500 to-blue-600' },
    { label: 'Total Workshops', value: '32', color: 'from-purple-500 to-purple-600' },
    { label: 'Recent Chats', value: '15', color: 'from-green-500 to-green-600' },
    { label: 'Pending Approvals', value: '3', color: 'from-orange-500 to-orange-600' }
  ];

  const activities = [
    { icon: BookOpen, label: 'My Recipes' },
    { icon: Utensils, label: 'My Workshops' },
    { icon: FileText, label: 'My Blogs' }
  ];

  const recentRecipes = [
    { 
      id: 1, 
      title: 'Spicy Thai Curry', 
      image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=400&fit=crop' 
    },
    { 
      id: 2, 
      title: 'Mediterranean Quinoa Salad', 
      image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400&h=400&fit=crop' 
    },
    { 
      id: 3, 
      title: 'Chocolate Avocado Mousse', 
      image: 'https://images.unsplash.com/photo-1606312619070-d48b4dcd0e7f?w=400&h=400&fit=crop' 
    },
    { 
      id: 4, 
      title: 'Rustic Italian Pasta', 
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop' 
    }
  ];

  const workshops = [
    {
      id: 1,
      status: 'Upcoming',
      title: 'Sushi Making Masterclass',
      participants: '12 Participants',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=300&fit=crop'
    },
    {
      id: 2,
      status: 'Upcoming',
      title: 'Pasta From Scratch',
      participants: '8 Participants',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=300&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50 border-b-2 border-green-100">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-green-600">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5"/>
              <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2.5"/>
            </svg>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Dishcovery
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search recipes, workshops..."
                className="pl-10 pr-4 py-2 w-80 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
              />
            </div>
            <button className="p-2 hover:bg-green-50 rounded-full transition-colors relative">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-lg ring-2 ring-white">
              <img src="https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=100&h=100&fit=crop" alt="Chef" className="w-full h-full rounded-full object-cover" />
            </div>
          </div>
        </div>
      </nav>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className="w-72 bg-white/90 backdrop-blur-sm min-h-screen p-6 sticky top-20 h-fit shadow-xl border-r-2 border-green-100">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b-2 border-gray-100">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-lg ring-2 ring-green-100">
              <img src="https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=100&h=100&fit=crop" alt="Chef" className="w-full h-full rounded-full object-cover" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">Chef Jems</p>
              <p className="text-sm text-green-600 font-medium">Dishcovery</p>
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

                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-200 scale-105 font-semibold' 
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-700 hover:scale-102'
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
          <div className="relative mb-12 rounded-3xl overflow-hidden shadow-2xl group">
            <img 
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop" 
              alt="Featured Food"
              className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-10">
              <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-2xl">
                Welcome back chef Jems!
              </h1>
            </div>
          </div>

          {/* Dashboard Stats */}
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
            Dashboard
          </h2>

          <div className="grid grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`}></div>
                <p className="text-sm text-gray-600 mb-2 font-medium">{stat.label}</p>
                <p className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* My Activities */}
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
            My Activities
          </h2>

          <div className="grid grid-cols-3 gap-6 mb-12">
            {activities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <button
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 group"
                >
                  <Icon className="w-12 h-12 text-green-600 mb-4 group-hover:scale-110 transition-transform" />
                  <p className="font-bold text-lg text-gray-900">{activity.label}</p>
                </button>
              );
            })}
          </div>

          {/* Recent Recipes */}
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
            Recent Recipes
          </h2>

          <div className="grid grid-cols-4 gap-6 mb-12">
            {recentRecipes.map(recipe => (
              <div 
                key={recipe.id} 
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={recipe.image} 
                    alt={recipe.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-3 text-gray-900">{recipe.title}</h3>
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Workshop Overview */}
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
            Workshop Overview
          </h2>

          <div className="space-y-6 mb-12">
            {workshops.map(workshop => (
              <div 
                key={workshop.id}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
                      {workshop.status}
                    </span>
                    <h3 className="text-2xl font-bold mb-2 text-gray-900">{workshop.title}</h3>
                    <p className="text-green-600 font-medium">{workshop.participants}</p>
                  </div>
                  <div className="w-64 h-40 rounded-2xl overflow-hidden shadow-xl">
                    <img 
                      src={workshop.image} 
                      alt={workshop.title} 
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

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
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
              </a>
              <a href="#" className="p-3 bg-green-100 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="white"/>
                </svg>
              </a>
              <a href="#" className="p-3 bg-green-100 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
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