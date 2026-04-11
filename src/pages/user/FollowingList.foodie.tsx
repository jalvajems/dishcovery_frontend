import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFollowingApi } from '@/api/followApi';
import { MapPin, ArrowRight, Users, Search } from 'lucide-react';
import { showError } from '@/utils/toast';
import { getErrorMessage } from "@/utils/errorHandler";
import SearchBar from '@/components/shared/SearchBar';
import Pagination from '@/components/shared/Pagination';
import { expandImageUrl } from '@/utils/imageUrl';
import type { IFollowing } from '@/types/follower.types';

export default function FollowingList() {
    const navigate = useNavigate();
    const [following, setFollowing] = useState<IFollowing[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const limit = 4

    useEffect(() => {
        fetchFollowing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, searchQuery, currentPage, limit]);
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }
    const fetchFollowing = async () => {
        setLoading(true);
        try {
            const response = await getFollowingApi(page, limit, searchQuery);
            setFollowing(response.data.datas);
            setTotal(response.data.total);
        } catch (error: unknown) {
            showError(getErrorMessage(error, "Failed to fetch followed chefs"));
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
        <div className="min-h-screen bg-white text-gray-900 pb-20 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">



                {/* Hero Banner Section */}
                <div className="relative h-[40vh] md:h-[50vh] rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl uppercase group ring-1 ring-black/5">
                    <img
                        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
                        alt="Delicious Food Banner"
                        className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-[2s] ease-in-out"
                    />
                    {/* Stronger Overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />

                    <div className="absolute inset-0 flex flex-col justify-center items-start px-8 md:px-16 max-w-6xl">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg">
                                <Users className="w-6 h-6 text-emerald-400" />
                            </div>
                            <span className="text-emerald-300 font-bold tracking-[0.3em] text-xs uppercase shadow-black drop-shadow-md">Your Curated Feed</span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-[1.1] drop-shadow-2xl">
                            Following <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Chefs</span><br />
                            <span className="text-3xl md:text-5xl font-thin text-gray-200">Creative Masters</span>
                        </h1>
                    </div>
                </div>

                {/* Search Section */}
                <div className="max-w-3xl mx-auto mb-12 relative z-10  px-4">
                    <div className="bg-white/95 backdrop-blur-xl p-3 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 ring-1 ring-gray-100">
                        <SearchBar
                            placeholder="Search your followed chefs..."
                            onSearch={handleSearch}
                        />
                    </div>
                </div>

                {/* Results Section */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white rounded-[2rem] h-80 animate-pulse bg-gray-100" />
                        ))}
                    </div>
                ) : following.length === 0 ? (
                    <div className="bg-gray-50 rounded-[3rem] p-16 text-center border border-gray-100 shadow-inner max-w-2xl mx-auto">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            {searchQuery ? <Search size={32} className="text-emerald-500" /> : <Users size={32} className="text-emerald-500" />}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            {searchQuery ? "No matches found" : "Not following anyone yet"}
                        </h3>
                        <p className="text-gray-500 mb-8 max-w-xs mx-auto">
                            {searchQuery
                                ? "Try searching for a different name."
                                : "Start exploring to fill your feed with delicious content!"}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={() => navigate('/foodie/chefs')}
                                className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-500/30"
                            >
                                Explore Chefs <ArrowRight size={18} />
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {following.map((follow) => (
                                <div
                                    key={follow._id}
                                    onClick={() => navigate(`/foodie/chef/${follow.followingId?._id}`)}
                                    className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] transition-all duration-500 border border-gray-100 group flex flex-col cursor-pointer"
                                >
                                    <div className="relative h-64 overflow-hidden bg-gray-100">
                                        <img
                                            src={expandImageUrl(follow.followingId?.image || (follow.followingId as any)?.chefId?.image)}
                                            alt={follow.followingId?.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                        <div className="absolute bottom-4 left-4 right-4 text-white">
                                            <h3 className="text-xl font-extrabold mb-1 drop-shadow-md truncate">
                                                {follow.followingId?.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
                                                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                                                {follow.followingId?.location || "Location not set"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col">
                                        {follow.followingId?.specialities && (
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {follow.followingId.specialities.slice(0, 3).map((s: string, i: number) => (
                                                    <span
                                                        key={i}
                                                        className="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold border border-gray-100"
                                                    >
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-sm font-bold text-emerald-600 group-hover:text-emerald-700">
                                            <span>View Profile</span>
                                            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                                                <ArrowRight size={14} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 flex justify-center">
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
