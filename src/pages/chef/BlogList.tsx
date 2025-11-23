import { useState } from 'react';
import { Home, BookOpen, Utensils, FileText, MessageCircle, User, Search, Bell, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export default function MyBlogsPage() {
  const [activeMenu, setActiveMenu] = useState('Blogs');
  const [activeTab, setActiveTab] = useState('Published');
  const [currentPage, setCurrentPage] = useState(1);

  const menuItems = [
    { icon: Home, label: 'Home' },
    { icon: BookOpen, label: 'Recipes' },
    { icon: Utensils, label: 'Workshops' },
    { icon: FileText, label: 'Blogs' },
    { icon: MessageCircle, label: 'Chat' },
    { icon: User, label: 'Profile' }
  ];

  const blogs = [
    {
      id: 1,
      title: 'The Art of Sourdough Baking',
      description: 'A comprehensive guide to mastering sourdough bread, from starter to perfect loaf.',
      status: 'Published',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=400&fit=crop'
    },
    {
      id: 2,
      title: 'Exploring Regional Italian Cuisine',
      description: 'A journey through the diverse flavors of Italy, from the Alps to Sicily.',
      status: 'Draft',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=400&fit=crop'
    },
    {
      id: 3,
      title: 'Knife Skills for Home Cooks',
      description: 'Essential techniques for chopping, slicing, and dicing like a pro.',
      status: 'Published',
      image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&h=400&fit=crop'
    },
    {
      id: 4,
      title: 'The Ultimate Guide to Grilling',
      description: 'Tips and tricks for perfect grilling, from burgers to vegetables.',
      status: 'Draft',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&h=400&fit=crop'
    }
  ];

  const filteredBlogs = activeTab === 'Published' 
    ? blogs.filter(blog => blog.status === 'Published')
    : blogs.filter(blog => blog.status === 'Draft');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50">
      {/* Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-gray-200">
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
                placeholder="Search"
                className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
              />
            </div>
            <button className="p-2 hover:bg-green-50 rounded-full transition-colors relative">
              <Bell className="w-6 h-6 text-gray-600" />
            </button>
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-lg ring-2 ring-white">
              <img src="https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=100&h=100&fit=crop" alt="Chef" className="w-full h-full rounded-full object-cover" />
            </div>
          </div>
        </div>
      </nav>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className="w-72 bg-white/80 backdrop-blur-sm min-h-screen p-6 sticky top-20 h-fit shadow-xl border-r border-gray-200">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
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
                  onClick={() => setActiveMenu(item.label)}
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
          {/* Hero Banner */}
          <div className="relative mb-8 rounded-3xl overflow-hidden shadow-2xl group">
            <img 
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop" 
              alt="My Blogs Banner"
              className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute bottom-8 left-10">
              <h1 className="text-5xl font-bold text-white drop-shadow-2xl">
                My Blogs
              </h1>
            </div>
          </div>

          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
              My Blogs
            </h2>
            <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all shadow-lg flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Blog
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('Published')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'Published'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setActiveTab('Draft')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'Draft'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Draft
            </button>
          </div>

          {/* Blog Cards */}
          <div className="space-y-6 mb-8">
            {filteredBlogs.map((blog) => (
              <div 
                key={blog.id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
              >
                <div className="flex gap-6">
                  <div className="w-64 h-48 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                    <img 
                      src={blog.image} 
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span className={`inline-flex px-4 py-1.5 rounded-lg font-semibold text-sm mb-3 ${
                        blog.status === 'Published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {blog.status}
                      </span>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {blog.description}
                      </p>
                    </div>
                    <div className="mt-4">
                      <button className="px-6 py-2.5 bg-green-100 text-green-700 font-semibold rounded-lg hover:bg-green-200 transition-all">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-2 rounded-lg hover:bg-green-50 transition-all disabled:opacity-50"
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-110'
                      : 'bg-white text-gray-700 hover:bg-gray-100 hover:scale-105'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(5, prev + 1))}
                className="p-2 rounded-lg hover:bg-green-50 transition-all disabled:opacity-50"
                disabled={currentPage === 5}
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
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