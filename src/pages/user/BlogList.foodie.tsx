import { useEffect, useState } from 'react';
import { Search, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getBlogsFoodieApi } from '@/api/foodieApi';
import { showError } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';
import Pagination from '@/components/shared/Pagination';
import SearchBar from '@/components/shared/SearchBar';

export default function BlogListFoodie() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [blogs, setBlogs] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 3;

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }


    useEffect(() => {
        fetchBlogs();
    }, [currentPage, searchQuery, limit, filter]);

    async function fetchBlogs() {
        try {
            const result = await getBlogsFoodieApi(currentPage, limit, searchQuery, filter);

            setBlogs(result.data.datas);
            setTotalPages(result.data.totalCount);

        } catch (error: any) {
            showError(error.response?.data?.message || "Failed to load blogs");
        }
    }





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
                        <SearchBar
                            placeholder="Search recipes, cuisine..."
                            onSearch={(value) => {
                                setSearchQuery(value);
                                setCurrentPage(1)
                            }}
                        />
                    </div>
                </div>

                {/* Category Tags */}
                <div className="flex gap-4 mb-10 overflow-x-auto pb-2 hide-scrollbar">
                    {["","Healthy Eating", "International Cuisine","Seasonal","Budget Friendly",].map((category, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setFilter(category);
                                    setCurrentPage(1);
                                }}
                                className={`px-6 py-3 font-semibold rounded-xl transition-all shadow-lg border ${filter === category
                                    ? 'bg-green-600 text-white border-green-600'
                                    : 'bg-white/90 text-gray-700 border-gray-200 hover:bg-green-100 hover:text-green-700 hover:scale-105'
                                    }`}
                            >
                                {category || 'All Stories'}
                            </button>
                        ))}
                </div>

                {/* Food Blog Section */}
                {blogs.map((blog: any) => (
                    <div
                        key={blog._id}
                        className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
                    >
                        <div className="flex gap-6 items-center">
                            {/* Text Section */}
                            <div className="flex-1">

                                {blog.isNew && (
                                    <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-lg font-semibold text-sm mb-3">
                                        New
                                    </span>
                                )}

                                <h3 className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
                                    {blog.title}
                                </h3>

                                <p className="text-gray-600 mb-5 leading-relaxed text-lg">
                                    {blog.shortDescription}
                                </p>

                                <button
                                    onClick={() => navigate(`/foodie/blog-detail/${blog._id}`)}
                                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-green-100 hover:text-green-700 hover:scale-105 transition-all"
                                >
                                    View Details
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Image */}
                            <div className="w-72 h-56 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                                <img
                                    src={blog.coverImage}
                                    alt={blog.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                        </div>
                    </div>
                ))}


                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onChange={handlePageChange}
                />
            </div>
        </div>
    );
}