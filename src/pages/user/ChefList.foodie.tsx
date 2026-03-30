import { useEffect, useState, useCallback } from 'react';
import { MapPin, ArrowRight, ChefHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getChefsApi } from '@/api/foodieApi';
import { logError } from '@/utils/errorHandler';
import Pagination from '@/components/shared/Pagination';
import SearchBar from '@/components/shared/SearchBar';
import type { IChefDetail } from '@/types/chef.types';

export default function ChefList() {
    const navigate = useNavigate();
    const [chefs, setChefs] = useState<IChefDetail[]>([]);
    // ...
    // Note: I cannot replace the whole file easily. I will target chunks.
    // Chunk 1: Import

    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState(""); // New state for filter
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 6;

    useEffect(() => {
        fetchChefs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, searchQuery, filter]);

    const fetchChefs = async () => {
        setLoading(true);
        try {
            const response = await getChefsApi(currentPage, limit, searchQuery, filter);
            setChefs(response.data.datas);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            logError(error, 'Error fetching chefs');
        } finally {
            setLoading(false);
        }
    };
    console.log('----------', chefs);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    }, []);

    return (
        <div className="min-h-screen bg-white text-gray-900 pb-20 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Hero Banner Section */}
                <div className="relative h-[40vh] md:h-[50vh] rounded-[2.5rem] overflow-hidden mb-5 shadow-2xl animate-fade-in-up uppercase group">
                    <img
                        src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=2070&auto=format&fit=crop"
                        alt="Chefs Banner"
                        className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-[2s] ease-in-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />

                    <div className="absolute inset-0 flex flex-col justify-center items-start px-8 md:px-20 max-w-5xl">
                        <div className="inline-flex items-center gap-3 mb-6 animate-fade-in-up delay-100">
                            <div className="p-3 bg-emerald-500/20 backdrop-blur-md rounded-2xl border border-emerald-500/30">
                                <ChefHat className="w-8 h-8 text-emerald-400" />
                            </div>
                            <span className="text-emerald-400 font-bold tracking-[0.2em] text-sm uppercase">World Class Talent</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.9] drop-shadow-2xl animate-fade-in-up delay-200">
                            Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Chefs</span><br />
                            <span className="text-4xl md:text-6xl font-thin text-gray-300">Culinary Artists</span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-2xl font-light leading-relaxed animate-fade-in-up delay-300 border-l-4 border-emerald-500 pl-6">
                            Discover the creative minds behind your favorite dishes. Explore their profiles, exclusive recipes, and join their workshops.
                        </p>
                    </div>
                </div>

                {/* Search and Filters Section */}
                <div className="max-w-4xl mx-auto mb-5   animate-fade-in-up delay-200">
                    <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="flex-1 w-full">
                                <SearchBar
                                    placeholder="Search chefs by name..."
                                    onSearch={handleSearch}
                                    initialValue={searchQuery}
                                />
                            </div>
                            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                                {['', 'chinese', 'arabic', 'Indian', 'Italian'].map((spec) => (
                                    <button
                                        key={spec}
                                        onClick={() => {
                                            setFilter(spec);
                                            setCurrentPage(1);
                                        }}
                                        className={`px-5 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all duration-300 ${filter === spec
                                            ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20'
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                    >
                                        {spec ? spec.charAt(0).toUpperCase() + spec.slice(1) : 'All'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chef Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                            {chefs.map((chef) => (
                                <div
                                    key={chef._id}
                                    className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] transition-all duration-500 border border-gray-100 group flex flex-col"
                                >
                                    <div className="relative h-72 overflow-hidden bg-gray-100">
                                        <img
                                            src={String((chef as unknown as Record<string, unknown>)?.image || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=400&fit=crop')}
                                            alt={chef.chefId?.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                        <div className="absolute bottom-4 left-4 right-4 text-white">
                                            <h3 className="text-2xl font-extrabold mb-1 drop-shadow-md">
                                                {chef.chefId?.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
                                                <MapPin className="w-4 h-4 text-emerald-400" />
                                                {chef.location || "Location not set"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex flex-wrap gap-2 mb-8">
                                            {(chef.specialities || []).slice(0, 3).map((spec: string, idx: number) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold border border-gray-100"
                                                >
                                                    {spec}
                                                </span>
                                            ))}
                                            {(chef.specialities?.length || 0) > 3 && (
                                                <span className="px-3 py-1 bg-gray-50 text-gray-400 rounded-xl text-xs font-bold border border-gray-100">
                                                    +{(chef.specialities?.length || 0) - 3}
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-auto">
                                            <button
                                                onClick={() => navigate(`/foodie/chef/${chef.chefId?._id}`)}
                                                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-600/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group/btn"
                                            >
                                                View Profile
                                                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-20 flex justify-center">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onChange={handlePageChange}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
