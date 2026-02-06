import { useEffect, useState } from "react";
import { getMyBlogsChefApi } from "@/api/chefApi";
import { useNavigate } from "react-router-dom";
import { Home, BookOpen, Utensils, FileText, MessageCircle, User, Search, Bell, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import Pagination from "@/components/shared/Pagination";
import SearchBar from "@/components/shared/SearchBar";
import { useUserStore } from "@/store/userStore";

export default function BlogListChef() {
  const [activeTab, setActiveTab] = useState('Published');
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const limit = 5
  const navigate = useNavigate();
  const { isVerifiedUser } = useUserStore()


  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    fetchBlogs();
  }, [activeTab, searchQuery, currentPage, limit]);

  async function fetchBlogs() {

    try {
      setLoading(true);
      const filter = activeTab === "Published" ? "published" : "draft";
      const res = await getMyBlogsChefApi(currentPage, limit, searchQuery);
      setTotalPages(res.data.totalCount)
      setBlogs(res.data.datas);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }




  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 p-8">

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
          <SearchBar
            placeholder="Search recipes, cuisine..."
            onSearch={(value) => {
              setSearchQuery(value);
              setCurrentPage(1)
            }}
          />
        </div>
      </div>

      {/* Blog Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
          My Blogs
        </h2>
        <button
          disabled={!isVerifiedUser}
          onClick={() => navigate('/blog-add')}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all shadow-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Blog
        </button>
      </div>

      {/* Tabs */}
      {/* <div className="flex gap-4 mb-6">
      
        <button
      disabled={!isVerifiedUser}
          onClick={() => setActiveTab("Draft")}
          className={`px-6 py-3 rounded-xl font-semibold ${activeTab === "Draft" ? "bg-green-100 text-green-700" : "bg-white text-gray-600"}`}
        >
          Draft
        </button>
      </div> */}

      {/* Blog List */}
      {loading ? (
        <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>
      ) : blogs.length === 0 ? (
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-20 text-center shadow-xl border border-gray-100 mb-8">
          <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Blogs Yet</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Share your culinary stories, tips, and experiences with the community! Start writing your first blog post.
          </p>
          <button
            disabled={!isVerifiedUser}
            onClick={() => navigate('/blog-add')}
            className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg hover:shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Writing
          </button>
        </div>
      ) : (
        <div className="space-y-6 mb-8">
          {blogs.map((blog: any) => (
            <div key={blog._id} className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex gap-6">
                <img src={blog.coverImage} className="w-64 h-48 rounded-xl object-cover" />

                <div className="flex-1">
                  {/* <span className={`px-4 py-1.5 rounded-lg text-sm ${blog.isDraft ? "bg-gray-100" : "bg-green-100 text-green-700"}`}>
                    {blog.isDraft ? "Draft" : "Published"}
                  </span> */}

                  <h3 className="text-2xl font-bold mt-2">{blog.title}</h3>
                  <p className="text-gray-600 mt-2">{blog.shortDescription}</p>

                  <button
                    onClick={() => navigate(`/blog-detail/${blog._id}`)}
                    className="mt-4 px-6 py-2 bg-green-100 text-green-700 font-semibold rounded-lg hover:bg-green-200 transition-colors"
                  >
                    View details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={handlePageChange}
      />
    </div>

  );
}