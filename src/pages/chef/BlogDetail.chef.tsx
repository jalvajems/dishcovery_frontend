import { Edit2, Trash2, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { deleteBlogApi, getBlogDetailChefApi } from "@/api/chefApi";
import { showError, showSuccess } from "@/utils/toast";
import { getErrorMessage, logError } from "@/utils/errorHandler";
import ChefReviewSection from '@/components/shared/ChefReviewSection';
import ChefNavbar from '@/components/shared/chef/NavBar.chef';
import { useUserStore } from '@/store/userStore';

export default function BlogDetailPage() {
  const { blogId } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { isVerifiedUser } = useUserStore()


  if (!blogId) throw Error('blog id is not defined');
  useEffect(() => {
    fetchBlog();
  }, [blogId]);

  async function fetchBlog() {
    try {
      if (!blogId) throw Error('blog id is not defined');
      const res = await getBlogDetailChefApi(blogId);
      setBlog(res.data.data);
      setLoading(false);
    } catch (error: unknown) {
      logError(error);
      showError(getErrorMessage(error, "Failed to load blog"));
      setLoading(false);
    }
  }

  async function handleDelete() {
    try {

      await deleteBlogApi(blogId!);
      showSuccess("Blog deleted successfully");
      // navigate("/chef/blog-listing");
    } catch (error: unknown) {
      logError(error);
      showError(getErrorMessage(error, "Failed to delete blog"));
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-xl text-gray-600">
        Loading...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="h-screen flex justify-center items-center text-xl text-red-600">
        Blog not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">


      <ChefNavbar />

      <main className="max-w-5xl mx-auto px-8 py-12">

        {/* Breadcrumb */}
        <div className="mb-6">
          <p className="text-green-600 font-medium">
            <span className="hover:underline cursor-pointer" onClick={() => navigate("/chef/blog-listing")}>
              Blogs
            </span>
            / <span className="text-gray-700">blog details</span>
          </p>
        </div>

        <article className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

          {/* Title Section */}
          <div className="p-10 pb-6">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-green-700 to-emerald-700 bg-clip-text text-transparent leading-tight">
              {blog.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="text-green-600 font-semibold">By {blog?.chefName || "You"}</span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Published on {new Date(blog.createdAt).toDateString()}
              </span>
            </div>
          </div>

          {/* Main Image */}
          <div className="px-10 pb-8">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>

          {/* Content */}
          <div className="px-10 pb-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              {blog.shortDescription}
            </p>

            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
              {blog.content}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="px-10 pb-10 flex gap-4">
            <button
              disabled={!isVerifiedUser}
              onClick={() => navigate(`/blog-edit/${blogId}`)}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all shadow-lg flex items-center gap-2"
            >
              <Edit2 className="w-5 h-5" />
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Delete
            </button>
          </div>

          {/* Engagement */}
          {/* <div className="px-10 pb-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Engagement</h2>
            <div className="grid grid-cols-3 gap-6">

              {/* Likes */}
          {/* {/* <div className="bg-gradient-to-br from-red-50 to-pink-100 rounded-2xl p-6 border border-pink-200 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-gray-700 font-semibold">Likes</span>
                </div>
                <p className="text-4xl font-bold text-gray-900">{blog.likes ?? 0}</p>
              </div> 
            </div>
          </div> */}

        </article>
        <ChefReviewSection reviewableId={blogId} reviewableType="Blog" />

      </main>
    </div>
  );
}
