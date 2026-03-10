import { Eye, Heart, MessageCircle, Edit2, Trash2, Calendar } from 'lucide-react';

export default function BlogDetailPage() {
  const blog = {
    title: 'The Art of Sourdough Baking',
    author: 'Chef Isabella Rossi',
    publishDate: 'July 15, 2024',
    mainImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&h=500&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=1200&h=500&fit=crop',
    content: {
      intro: 'Embark on a culinary adventure with Chef Isabella Rossi as she shares her passion for sourdough baking. From the science of fermentation to the artistry of shaping, this blog post delves into the world of sourdough, offering insights, tips, and a step-by-step guide to creating your own perfect loaf. Discover the secrets behind a tangy, crusty sourdough and elevate your baking skills to new heights.',
      body: 'The journey begins with the starter, a living culture that breathes life into your dough. Learn how to nurture and maintain your starter, ensuring its vitality and flavor. Explore the different types of flour and their impact on the final product, and master the techniques of mixing, folding, and proofing. With detailed instructions and stunning visuals, this guide empowers you to bake sourdough with confidence and creativity.'
    },
    engagement: {
      views: 1234,
      likes: 567,
      comments: 89
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
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

          <div className="flex items-center gap-6 text-gray-700 font-medium">
            <a href="#" className="hover:text-green-600 transition-colors">Home</a>
            <a href="#" className="hover:text-green-600 transition-colors">My Recipes</a>
            <a href="#" className="hover:text-green-600 transition-colors">My Blogs</a>
            <a href="#" className="hover:text-green-600 transition-colors">My Workshops</a>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search"
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
            />
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-green-400 to-blue-500 shadow-lg ring-2 ring-white">
              <img src="https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=100&h=100&fit=crop" alt="User" className="w-full h-full rounded-full object-cover" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <p className="text-green-600 font-medium">
            <a href="#" className="hover:underline">Blogs</a> / <span className="text-gray-700">blog details</span>
          </p>
        </div>

        {/* Article Container */}
        <article className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Title Section */}
          <div className="p-10 pb-6">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-green-700 to-emerald-700 bg-clip-text text-transparent leading-tight">
              {blog.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="text-green-600 font-semibold">By {blog.author}</span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Published on {blog.publishDate}
              </span>
            </div>
          </div>

          {/* Main Image */}
          <div className="px-10 pb-8">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img 
                src={blog.mainImage} 
                alt={blog.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>

          {/* Content */}
          <div className="px-10 pb-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              {blog.content.intro}
            </p>

            {/* Secondary Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl mb-8">
              <img 
                src={blog.secondaryImage} 
                alt="Sourdough starter"
                className="w-full h-96 object-cover"
              />
            </div>

            <p className="text-lg text-gray-700 leading-relaxed">
              {blog.content.body}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="px-10 pb-10 flex gap-4">
            <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all shadow-lg flex items-center gap-2">
              <Edit2 className="w-5 h-5" />
              Edit
            </button>
            <button className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:scale-105 transition-all flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Delete
            </button>
          </div>

          {/* Engagement Section */}
          <div className="px-10 pb-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Engagement</h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-gray-700 font-semibold">Views</span>
                </div>
                <p className="text-4xl font-bold text-gray-900">{blog.engagement.views.toLocaleString()}</p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-pink-100 rounded-2xl p-6 border border-pink-200 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-gray-700 font-semibold">Likes</span>
                </div>
                <p className="text-4xl font-bold text-gray-900">{blog.engagement.likes}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-gray-700 font-semibold">Comments</span>
                </div>
                <p className="text-4xl font-bold text-gray-900">{blog.engagement.comments}</p>
              </div>
            </div>
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 py-8 px-8 mt-16">
        <div className="max-w-7xl mx-auto">
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
        </div>
      </footer>
    </div>
  );
}