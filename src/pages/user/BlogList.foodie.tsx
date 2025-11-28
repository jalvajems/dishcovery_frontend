import { useState } from 'react';
import { Search, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function FoodBlogMain() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = ['Healthy Eating', 'Street Food', 'Baking Tips'];
  
  const blogs = [
    {
      id: 1,
      badge: 'New',
      title: 'The Ultimate Guide to Healthy Meal Prep',
      description: 'Learn how to plan and prepare healthy meals for the week.',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      badge: 'New',
      title: 'Exploring the Best Street Food in New York',
      description: 'A culinary journey through the vibrant street food scene of New York.',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      badge: '',
      title: 'Mastering the Art of Sourdough Baking',
      description: 'Tips and tricks for baking the perfect sourdough bread at home.',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Banner */}
        <div className="relative mb-12 rounded-3xl overflow-hidden shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=500&fit=crop" 
            alt="Food dishes"
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-8">
            <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-2xl">
              Explore the food stories
            </h1>
            <p className="text-xl text-white/95 mb-8 max-w-2xl drop-shadow-lg">
              Explore a curated list of food spots, from hidden gems to popular favorites. Find your next culinary adventure.
            </p>
            
            {/* Search Bar */}
            <div className="w-full max-w-2xl relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, cuisine, or location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-4 py-5 bg-white/95 backdrop-blur-sm border-2 border-white rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-green-400 transition-all shadow-xl text-lg"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Category Tags */}
        <div className="flex gap-4 mb-10">
          {categories.map((category, index) => (
            <button
              key={index}
              className="px-6 py-3 bg-white/90 backdrop-blur-sm text-gray-700 font-semibold rounded-xl hover:bg-green-100 hover:text-green-700 hover:scale-105 transition-all shadow-lg border border-gray-200"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Food Blog Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-gray-900 via-green-700 to-emerald-700 bg-clip-text text-transparent">
            Food Blog
          </h2>
          <p className="text-green-600 font-medium mb-8">
            Discover stories, tips, and culinary adventures.
          </p>

          {/* Blog Cards */}
          <div className="space-y-8">
            {blogs.map((blog) => (
              <div 
                key={blog.id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
              >
                <div className="flex gap-6 items-center">
                  <div className="flex-1">
                    {blog.badge && (
                      <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-lg font-semibold text-sm mb-3">
                        {blog.badge}
                      </span>
                    )}
                    <h3 className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 mb-5 leading-relaxed text-lg">
                      {blog.description}
                    </p>
                    <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-green-100 hover:text-green-700 hover:scale-105 transition-all">
                      View Details
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="w-72 h-56 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                    <img 
                      src={blog.image} 
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-3 rounded-xl hover:bg-green-50 transition-all disabled:opacity-50"
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-11 h-11 rounded-xl font-bold transition-all ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-110'
                    : 'bg-white text-gray-700 hover:bg-gray-100 hover:scale-105'
                }`}
              >
                {page}
              </button>
            ))}
            
            <span className="px-3 text-gray-600 font-medium">...</span>
            
            <button
              onClick={() => setCurrentPage(10)}
              className={`w-11 h-11 rounded-xl font-bold transition-all ${
                currentPage === 10
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-110'
                  : 'bg-white text-gray-700 hover:bg-gray-100 hover:scale-105'
              }`}
            >
              10
            </button>
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(10, prev + 1))}
              className="p-3 rounded-xl hover:bg-green-50 transition-all disabled:opacity-50"
              disabled={currentPage === 10}
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}