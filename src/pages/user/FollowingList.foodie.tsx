import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFollowingApi } from '@/api/followApi';
import { MapPin, ArrowRight, ArrowLeft, Users, Search, X } from 'lucide-react';
import { showError } from '@/utils/toast';
import SearchBar from '@/components/shared/SearchBar';
import Pagination from '@/components/shared/Pagination';

export default function FollowingList() {
    const navigate = useNavigate();
    const [following, setFollowing] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const limit = 4

    useEffect(() => {
        fetchFollowing();
    }, [page, searchQuery,currentPage,limit]);
const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
    const fetchFollowing = async () => {
        setLoading(true);
        try {
            const response = await getFollowingApi(page, limit, searchQuery);
            setFollowing(response.data.datas);
            setTotal(response.data.total);
        } catch (error: any) {
            showError(error.response?.data?.message || "Failed to fetch followed chefs");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setPage(1); // Reset to first page on search
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div className="space-y-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 font-bold transition-colors group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back
                    </button>
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
                            <Users size={36} className="text-emerald-600" />
                            Following Chefs
                        </h1>
                        <p className="text-gray-500 font-medium mt-1">
                            Manage and discover the culinary masters you follow
                        </p>
                    </div>
                </div>

                <div className="w-full md:w-96">
                    <SearchBar
                        placeholder="Search by name or specialty..."
                        onSearch={handleSearch}
                    />
                </div>
            </div>

            {/* Results Section */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="bg-white p-6 rounded-[2.5rem] border animate-pulse h-48" />
                    ))}
                </div>
            ) : following.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-20 text-center border shadow-sm">
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        {searchQuery ? <Search size={40} className="text-emerald-200" /> : <Users size={40} className="text-emerald-200" />}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {searchQuery ? "No chefs match your search" : "Not following any chefs yet"}
                    </h3>
                    <p className="text-gray-500 max-w-xs mx-auto font-medium mb-8">
                        {searchQuery
                            ? "Try adjusting your search terms to find what you're looking for."
                            : "Explore our world-class chefs and follow those who inspire you!"}
                    </p>
                    {searchQuery ? (
                        <button
                            onClick={() => handleSearch('')}
                            className="flex items-center gap-2 mx-auto px-6 py-2 border-2 border-emerald-600 text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-all"
                        >
                            <X size={18} /> Clear Search
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/foodie/chefs')}
                            className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                        >
                            Explore Chefs
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {following.map((follow: any) => (
                            <div
                                key={follow._id}
                                onClick={() => navigate(`/foodie/chef/${follow.followingId?._id}`)}
                                className="group bg-white p-6 rounded-[2.5rem] border shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all cursor-pointer flex flex-col"
                            >
                                <div className="relative mb-6 mx-auto">
                                    <div className="w-32 h-32 rounded-[2rem] overflow-hidden shadow-lg ring-4 ring-emerald-50 group-hover:ring-emerald-100 transition-all duration-300">
                                        <img
                                            src={follow.followingId?.image || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=400&fit=crop'}
                                            alt={follow.followingId?.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-2xl shadow-md border text-emerald-600 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                        <ArrowRight size={18} />
                                    </div>
                                </div>

                                <div className="text-center space-y-2 mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors truncate">
                                        {follow.followingId?.name}
                                    </h3>
                                    <div className="flex items-center justify-center gap-1.5 text-gray-500 text-sm font-medium">
                                        <MapPin size={14} className="text-emerald-500" />
                                        {follow.followingId?.location || "Expert Chef"}
                                    </div>
                                </div>

                                {follow.followingId?.specialities && (
                                    <div className="flex flex-wrap justify-center gap-1.5 mt-auto">
                                        {follow.followingId.specialities.slice(0, 2).map((s: string, i: number) => (
                                            <span key={i} className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                                {s}
                                            </span>
                                        ))}
                                        {follow.followingId.specialities.length > 2 && (
                                            <span className="px-2.5 py-1 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-bold">
                                                +{follow.followingId.specialities.length - 2}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-16 bg-white/80 backdrop-blur-md p-4 rounded-[2rem] border w-fit mx-auto shadow-sm sticky bottom-8">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className={`p-2.5 rounded-2xl transition-all ${page === 1 ? 'text-gray-200' : 'text-emerald-600 hover:bg-emerald-50'}`}
                            >
                                <ArrowLeft size={24} />
                            </button>
                            <div className="flex items-center gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`w-11 h-11 rounded-2xl font-bold transition-all ${page === p ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-110' : 'text-gray-500 hover:bg-emerald-50'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className={`p-2.5 rounded-2xl transition-all ${page === totalPages ? 'text-gray-200' : 'text-emerald-600 hover:bg-emerald-50'}`}
                            >
                                <ArrowRight size={24} />
                            </button>
                        </div>
                    )} */}
                    <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
}
