import { useEffect, useState } from "react";
import { getMyBlogsChefApi } from "@/api/chefApi";
import { useNavigate } from "react-router-dom";
import { Home, BookOpen, Utensils, FileText, MessageCircle, User, Search, Bell, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import Pagination from "@/components/shared/Pagination";

export default function BlogListChef() {
  const [activeTab, setActiveTab] = useState('Published');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages,setTotalPages ]=useState(1);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const limit=5
  const navigate = useNavigate();

    const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    fetchBlogs();
  }, [activeTab, currentPage,limit]);

  async function fetchBlogs() {
    console.log('inside fetchblog');
    
    try {
      setLoading(true);
      const filter = activeTab === "Published" ? "published" : "draft";
      const res = await getMyBlogsChefApi(currentPage, limit);
      console.log('blog00', res.data);
      setTotalPages(res.data.totalCount)
      setBlogs(res.data.datas);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }



  // const filteredBlogs = activeTab === 'Published'
  //   ? blogs.filter(blog => blog.status === 'Published')
  //   : blogs.filter(blog => blog.status === 'Draft');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 p-8">

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

      {/* Blog Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
          My Blogs
        </h2>
        <button
          onClick={() => navigate('/blog-add')}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all shadow-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Blog
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("Published")}
          className={`px-6 py-3 rounded-xl font-semibold ${activeTab === "Published" ? "bg-green-100 text-green-700" : "bg-white text-gray-600"}`}
        >
          Published
        </button>
        <button
          onClick={() => setActiveTab("Draft")}
          className={`px-6 py-3 rounded-xl font-semibold ${activeTab === "Draft" ? "bg-green-100 text-green-700" : "bg-white text-gray-600"}`}
        >
          Draft
        </button>
      </div>

      {/* Blog List */}
      {loading ? (
        <p>Loading blogs...</p>
      ) : (
        <div className="space-y-6 mb-8">
          {blogs.map((blog:any) => (
            <div key={blog._id} className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex gap-6">
                <img src={blog.thumbnail} className="w-64 h-48 rounded-xl object-cover" />

                <div className="flex-1">
                  <span className={`px-4 py-1.5 rounded-lg text-sm ${blog.isDraft ? "bg-gray-100" : "bg-green-100 text-green-700"}`}>
                    {blog.isDraft ? "Draft" : "Published"}
                  </span>

                  <h3 className="text-2xl font-bold mt-2">{blog.title}</h3>
                  <p className="text-gray-600 mt-2">{blog.shortDescription}</p>

                  <button
                    onClick={() => navigate(`/blog-detail/${blog._id}`)}
                    className="mt-4 px-6 py-2 bg-green-100 text-green-700 font-semibold rounded-lg"
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