import { useEffect, useState, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import { getBlogsFoodieApi, getRecommendedBlogsApi } from '@/api/foodieApi';
import { showError } from '@/utils/toast';
import { getErrorMessage } from '@/utils/errorHandler';
import { useNavigate } from 'react-router-dom';
import Pagination from '@/components/shared/Pagination';
import SearchBar from '@/components/shared/SearchBar';
import { expandImageUrl } from '@/utils/imageUrl';

import type { IBlog } from '@/types/blog.types';

export default function BlogListFoodie() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [blogs, setBlogs] = useState<IBlog[]>([]);
    const [recommendedBlogs, setRecommendedBlogs] = useState<IBlog[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 3;

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handleSearch = useCallback((value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    }, []);

    useEffect(() => {
        fetchBlogs();
        fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, searchQuery, limit, filter]);

    async function fetchBlogs() {
        try {
            const result = await getBlogsFoodieApi(currentPage, limit, searchQuery, filter);
            setBlogs(result.data.datas);
            setTotalPages(result.data.totalCount);
        } catch (error: unknown) {
            showError(getErrorMessage(error, "Failed to load blogs"));
        }
    }

    async function fetchRecommendations() {
        try {
            const result = await getRecommendedBlogsApi();
            setRecommendedBlogs(result.data.datas || []);
        } catch (error) {
            console.error("Failed to fetch recommendations", error);
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
                            onSearch={handleSearch}
                        />
                    </div>
                </div>

                {/* Recommended Section */}
                {recommendedBlogs.length > 0 && !searchQuery && !filter && (
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                            <span className="w-2 h-8 bg-teal-500 rounded-full"></span>
                            Recommended for You
                        </h2>
                        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                            {recommendedBlogs.map((blog) => (
                                <div
                                    key={blog._id}
                                    onClick={() => navigate(`/foodie/blog-detail/${blog._id}`)}
                                    className="min-w-[300px] bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                                >
                                    <div className="h-44 overflow-hidden">
                                        <img
                                            src={expandImageUrl(blog.coverImage)}
                                            alt={blog.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <div className="flex gap-1 flex-wrap">
                                            {blog.tags?.slice(0, 2).map(tag => (
                                                <span key={tag} className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded uppercase tracking-wider">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <h3 className="font-bold text-gray-900 mt-2 line-clamp-1 group-hover:text-teal-600 transition-colors">
                                            {blog.title}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Category Tags */}
                <div className="flex gap-4 mb-10 overflow-x-auto pb-2 hide-scrollbar">
                    {["", "Healthy Eating", "International Cuisine", "Seasonal", "Budget Friendly",].map((category, index) => (
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
                <div className="space-y-6">
                    {blogs.map((blog: IBlog) => (
                        <div
                            key={blog._id}
                            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group "
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
                                    <button
                                        className={`px-6 py-2 my-4 font-semibold rounded-xl transition-all shadow-lg bg-white/90 text-gray-700 border-gray-200 hover:bg-green-100 hover:text-green-700 hover:scale-105`}
                                    > 
                                        {blog.tags?.[0]}
                                    </button>

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
                                        src={expandImageUrl(blog.coverImage)}
                                        alt={blog.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-12">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
}