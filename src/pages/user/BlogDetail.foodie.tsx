import React, { useEffect, useState } from 'react';
import { Search, Bell, Heart, MessageCircle, Bookmark, ChevronRight, Tag } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getFoodieBlogDetailApi, getRelatedBlogsApi } from '@/api/foodieApi';
import { showError } from '@/utils/toast';
import ReviewSection from '@/components/shared/ReviewPage';

const BlogDetailPage: React.FC = () => {
  const [blog, setBlog] = useState<any>(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [comments, setComments] = useState([]);

  const [likes, setLikes] = useState(234);
  const [isLiked, setIsLiked] = useState(false);
  const { blogId } = useParams();

  if (!blogId) throw Error('blog id is missing');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getFoodieBlogDetailApi(blogId);
        setBlog(res.data.data);
        console.log('blogs', res.data.data);
      } catch (error: any) {
        showError(error.response?.data?.message || "Failed to fetch blog details");
      }
    };
    
    fetchBlog();
  }, [blogId]);

  useEffect(()=>{
    const fetchRelatedBlogs=async()=>{
      try {
        const res=await getRelatedBlogsApi(blog.tags[0])
        setRelatedBlogs(res.data.relatedDatas)
      } catch (error:any) {
        showError(error.response?.data?.message)
      }
    }
    fetchRelatedBlogs()
  },[blogId])
  
  console.log('blogs===', blog);
  console.log('blogsrelated===', relatedBlogs);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };


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
          {blog?.title}
        </h1>


        {/* Featured Image */}
        <div className="rounded-2xl overflow-hidden shadow-2xl mb-8">
          <img src={blog?.image} className="w-full h-96 object-cover" />

        </div>

  <div className="grid grid-cols-2 gap-6">
            <DetailItem icon={<Tag />} label="Tags" value={blog?.tags?.join(", ")} />
          </div>
        {/* Author & Date */}
        <div className="flex items-center gap-3 mb-8 text-gray-600 text-sm">
          <span className="font-medium">By {blog?.chefId?.name}</span>
          <span>•</span>
          <span>Published on {new Date(blog?.createdAt).toDateString()}</span>

        </div>
        {/* Blog Content */}
        {/* Content */}
        <div className="px-10 pb-8">
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            {blog?.shortDescription}
          </p>

          <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
            {blog?.content}
          </p>
        </div>


        {/* Engagement Actions */}
        <div className="flex items-center gap-6 mb-12">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isLiked ? 'bg-green-100 text-green-700' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-green-700' : ''}`} />
            <span className="font-medium">{likes}</span>
          </button>
          {/* <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <Bookmark className="w-5 h-5" />
            <span className="font-medium">58</span>
          </button> */}
        </div>

        {/* Comments Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-12">

          <div className="space-y-6 mb-8">
        
                     <ReviewSection reviewableId={blogId} reviewableType="Blog" />

          </div>
        </div>

        {/* Related Blogs */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Blogs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedBlogs.map((blog:any) => (
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
function DetailItem({ icon, label, value }: any) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200">
      <span className="text-green-600 font-semibold flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span className="font-bold text-gray-900">{value}</span>
    </div>
  );
}