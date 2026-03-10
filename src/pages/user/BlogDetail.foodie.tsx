import React, { useEffect, useState } from 'react';
import { Heart, Tag, Calendar, User, ArrowRight, Clock } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { getFoodieBlogDetailApi, getRelatedBlogsApi, toggleSaveBlogApi } from '@/api/foodieApi';
import { showError } from '@/utils/toast';
import { getErrorMessage, logError } from '@/utils/errorHandler';
import ReviewSection from '@/components/shared/ReviewPage';
import FoodieNavbar from '@/components/shared/foodie/Navbar.foodie';

import type { IBlog } from "@/types/blog.types";

const BlogDetailPage: React.FC = () => {
  const [blog, setBlog] = useState<IBlog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<IBlog[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const { blogId } = useParams();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (!blogId) return;
        const res = await getFoodieBlogDetailApi(blogId);
        setBlog(res.data.data as IBlog);
        setIsSaved(res.data.isSaved);
      } catch (error: unknown) {
        showError(getErrorMessage(error, "Failed to fetch blog details"));
      }
    };
    fetchBlog();
    window.scrollTo(0, 0);
  }, [blogId]);

  useEffect(() => {
    if (!blog?.tags?.[0]) return;
    const fetchRelatedBlogs = async () => {
      try {
        const res = await getRelatedBlogsApi(blog.tags![0]);
        const related = (res.data.relatedDatas || []).filter((b: IBlog) => b._id !== blog._id);
        setRelatedBlogs(related.slice(0, 3));
      } catch (error: unknown) {
        logError(error);
      }
    };
    fetchRelatedBlogs();
  }, [blog]);


  const handleToggleSave = async () => {
    try {
      const res = await toggleSaveBlogApi(blogId!);
      setIsSaved(res.data.isSaved);
    } catch (err) {
      logError(err);
    }
  };

  if (!blog) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-xl font-bold text-emerald-600 animate-pulse">Loading amazing content...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <FoodieNavbar />

      {/* Hero Header */}
      <div className="relative h-[500px] w-full bg-gray-900 group">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-50 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-90"></div>

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white max-w-7xl mx-auto">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {blog.tags?.map((tag: string, idx: number) => (
              <span key={idx} className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full backdrop-blur-md flex items-center gap-2 text-emerald-300 text-sm font-medium">
                <Tag size={14} /> {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight max-w-4xl">
            {blog.title}
          </h1>

          <div className="flex items-center gap-6 text-gray-300">
            <span className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                {(typeof blog.chefId === 'object' && blog.chefId?.name?.charAt(0)) || <User size={16} />}
              </div>
              <span className="text-white font-medium">{typeof blog.chefId === 'object' ? blog.chefId?.name : 'Unknown Chef'}</span>
            </span>
            <span className="hidden md:inline-block">•</span>
            <span className="flex items-center gap-2">
              <Calendar size={18} />
              {new Date(blog.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Main Content (Left) */}
          <div className="lg:col-span-8 space-y-12">

            {/* Content Body */}
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xl text-gray-600 font-medium leading-relaxed mb-8 italic border-l-4 border-emerald-500 pl-4">
                {blog.shortDescription}
              </p>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                {blog.content}
              </div>
            </div>

            {/* Reviews */}
            <div className="pt-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Comments & Discussion</h3>
              <ReviewSection reviewableId={blogId!} reviewableType="Blog" />
            </div>

          </div>

          {/* Sidebar (Right) */}
          <div className="lg:col-span-4 space-y-8">

            {/* Actions Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold mb-6">Engage</h3>
              <button
                onClick={handleToggleSave}
                className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all transform hover:scale-[1.02] ${isSaved ? 'bg-emerald-100 text-emerald-700' : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:shadow-emerald-500/30'}`}
              >
                <Heart size={20} className={isSaved ? "fill-emerald-700" : ""} />
                {isSaved ? "Saved to Bookmarks" : "Save Blog"}
              </button>

              <div className='my-6 border-b border-gray-100'></div>

              <h4 className="font-semibold text-gray-900 mb-4">About the Author</h4>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xl">
                  {typeof blog.chefId === 'object' && blog.chefId?.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{typeof blog.chefId === 'object' ? blog.chefId?.name : 'Unknown Chef'}</p>
                  <p className="text-sm text-gray-500">Chef & Content Creator</p>
                </div>
              </div>
            </div>

            {/* Related Blogs */}
            {relatedBlogs.length > 0 && (
              <div className='space-y-4'>
                <h3 className="text-xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-3">Related Reads</h3>
                {relatedBlogs.map((b: IBlog) => (
                  <Link to={`/foodie/blog/${b._id}`} key={b._id} className="block group">
                    <div className="flex gap-4 bg-white p-3 rounded-xl shadow-sm border border-transparent hover:border-emerald-200 transition-all hover:bg-emerald-50/30">
                      <img src={b.coverImage} alt={b.title} className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />
                      <div className='flex flex-col justify-center gap-1'>
                        <h4 className="font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-emerald-700 transition-colors">
                          {b.title}
                        </h4>
                        <div className='flex items-center gap-2 text-xs text-gray-500'>
                          <Clock size={12} /> {new Date(b.createdAt as string | Date).toLocaleDateString()}
                        </div>
                        <div className='flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-1'>
                          Read More <ArrowRight size={12} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;