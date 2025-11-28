import React, { useState } from 'react';
import { Search, Bell, Heart, MessageCircle, Bookmark, ChevronRight } from 'lucide-react';

const BlogDetailPage: React.FC = () => {
  const [likes, setLikes] = useState(234);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const relatedBlogs = [
    {
      id: 1,
      title: 'The Best Sauces for Homemade Pasta',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      title: 'Exploring Regional Italian Cuisine',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      title: 'Pasta Shapes and Their Perfect Pairings',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <h1 className="text-2xl font-bold text-gray-900">
              Dish<span className="text-green-600">c</span>overy
            </h1>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-green-600 font-medium transition-colors">Home</a>
              <a href="#" className="text-gray-700 hover:text-green-600 font-medium transition-colors">Chefs</a>
              <a href="#" className="text-gray-700 hover:text-green-600 font-medium transition-colors">Food Spots</a>
              <a href="#" className="text-gray-700 hover:text-green-600 font-medium transition-colors">Workshops</a>
              <a href="#" className="text-gray-700 hover:text-green-600 font-medium transition-colors">Recipes</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 bg-green-50 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-green-500 w-64 text-gray-700"
              />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-700" />
            </button>
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              alt="Profile"
              className="w-10 h-10 rounded-full ring-2 ring-green-500"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Home</a>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Food Blog</a>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium">The Ultimate Guide to Healthy Meal Prep</span>
        </div>

        {/* Blog Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          The Ultimate Guide to Healthy Meal Prep
        </h1>

        {/* Featured Image */}
        <div className="rounded-2xl overflow-hidden shadow-2xl mb-8">
          <img
            src="https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=1200&h=600&fit=crop"
            alt="Pasta"
            className="w-full h-96 object-cover"
          />
        </div>

        {/* Author & Date */}
        <div className="flex items-center gap-3 mb-8 text-gray-600 text-sm">
          <span className="font-medium">By Chef Natasha Rossi</span>
          <span>•</span>
          <span>Published on July 15, 2024</span>
        </div>

        {/* Blog Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              Making pasta from scratch is a culinary art that connects you to the heart of Italian cuisine. This guide will walk you through the process, from selecting the right ingredients to shaping and cooking your pasta to perfection. Whether you're a beginner or an experienced cook, these tips will help you create pasta that's both delicious and satisfying.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              1. "Prepare the Dough:"
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              On a clean work surface, mound the flour and create a well in the center. Crack the eggs into the well and add a drizzle of oil and a pinch of salt. Using a fork, begin to gradually incorporate the flour into the eggs until a shaggy dough forms. If the dough is too dry, add a teaspoon of water at a time until it comes together. If it's too wet, add a little more flour.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              2. "Knead the Dough:"
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Knead the dough for 8-10 minutes until it becomes smooth and elastic. The dough should spring back when lightly pressed. Wrap the dough in plastic wrap and let it rest at room temperature for at least 30 minutes to allow the gluten to relax.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              3. "Roll the Dough:"
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              If using a rolling pin, roll the dough into a thin sheet, about 1/16 inch thick. If using a pasta machine, start with the widest setting and gradually decrease the thickness, passing the dough through each setting twice until you reach the desired thickness.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              4. "Shape the Pasta:"
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Cut the dough into your desired shape. For fettuccine or tagliatelle, use a pasta cutter or a knife to cut the dough into strips. For ravioli or tortellini, fill and shape the pasta according to your recipe.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              5. "Cook the Pasta:"
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Bring a large pot of salted water to a rolling boil. Add the pasta and cook for 2-4 minutes, or until al dente. Fresh pasta cooks much faster than dried pasta, so keep a close eye on it. Use a slotted spoon or spider to transfer the pasta to a colander, and serve immediately with your favorite sauce.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              6. "Tips for Success:"
            </h3>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-3 mb-6">
              <li><strong>"Fresh Dough Choice:"</strong> Using semolina flour will give your pasta a slightly coarser texture, which helps it hold onto sauces better.</li>
              <li><strong>"Dough Consistency:"</strong> The dough should be firm but pliable. If it's too dry, it will be difficult to roll out. If it's too wet, it will stick to the rolling pin or pasta machine.</li>
              <li><strong>"Resting Time:"</strong> Resting the dough is crucial for allowing the gluten to relax, making it easier to roll out and preventing it from snapping back.</li>
              <li><strong>"Cooking Time:"</strong> Fresh pasta cooks very quickly, so don't overcook it. It should be al dente, with a slight bite to it.</li>
            </ul>

            <p className="text-gray-700 leading-relaxed">
              By following these steps and tips, you'll be able to create delicious, homemade pasta that will impress your friends and family. Enjoy the process and the wonderful flavors of your freshly made pasta!
            </p>
          </div>
        </div>

        {/* Engagement Actions */}
        <div className="flex items-center gap-6 mb-12">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              isLiked ? 'bg-green-100 text-green-700' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-green-700' : ''}`} />
            <span className="font-medium">{likes}</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">12</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <Bookmark className="w-5 h-5" />
            <span className="font-medium">58</span>
          </button>
        </div>

        {/* Comments Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Comments</h2>

          <div className="space-y-6 mb-8">
            {/* Comment 1 */}
            <div className="flex gap-4">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia"
                alt="Sophia Clark"
                className="w-12 h-12 rounded-full flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-gray-900">Sophia Clark</span>
                  <span className="text-gray-500 text-sm">3 days ago</span>
                </div>
                <p className="text-gray-700 mb-3 leading-relaxed">
                  This guide is so helpful! I've always wanted to try making pasta from scratch, and now I feel confident enough to give it a go. Thanks for the detailed instructions and tips!
                </p>
                <button className="flex items-center gap-1 text-gray-500 hover:text-green-600 text-sm">
                  <Heart className="w-4 h-4" />
                  <span>5</span>
                </button>
              </div>
            </div>

            {/* Comment 2 */}
            <div className="flex gap-4">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan"
                alt="Ethan Bennett"
                className="w-12 h-12 rounded-full flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-gray-900">Ethan Bennett</span>
                  <span className="text-gray-500 text-sm">1 week ago</span>
                </div>
                <p className="text-gray-700 mb-3 leading-relaxed">
                  I've made pasta a few times, but I always struggled with the dough consistency. Your tip about adding water gradually really helped! My pasta turned out perfectly this time.
                </p>
                <button className="flex items-center gap-1 text-gray-500 hover:text-green-600 text-sm">
                  <Heart className="w-4 h-4" />
                  <span>3</span>
                </button>
              </div>
            </div>
          </div>

          {/* Write a Review Button */}
          <button className="w-full py-3 bg-green-100 text-green-700 font-semibold rounded-xl hover:bg-green-200 transition-colors">
            Write a Review
          </button>
        </div>

        {/* Related Blogs */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Blogs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedBlogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer"
              >
                <div className="h-56 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                    {blog.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-sm border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-center space-x-8 mb-6">
            <a href="#" className="text-gray-600 hover:text-green-600 text-sm transition-colors">About</a>
            <a href="#" className="text-gray-600 hover:text-green-600 text-sm transition-colors">Contact</a>
            <a href="#" className="text-gray-600 hover:text-green-600 text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-green-600 text-sm transition-colors">Terms of Service</a>
          </div>
          <div className="flex justify-center space-x-6 mb-6">
            <a href="#" className="text-green-600 hover:text-green-700 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
              </svg>
            </a>
            <a href="#" className="text-green-600 hover:text-green-700 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
              </svg>
            </a>
            <a href="#" className="text-green-600 hover:text-green-700 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
            </a>
          </div>
          <p className="text-center text-sm text-gray-600">
            ©2024 Dishcovery. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BlogDetailPage;