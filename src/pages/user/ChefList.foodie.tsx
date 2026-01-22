import { useEffect, useState } from 'react';
import { MapPin, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getChefsApi } from '@/api/foodieApi';
import Pagination from '@/components/shared/Pagination';
import SearchBar from '@/components/shared/SearchBar';
import { getFollowingApi } from '@/api/followApi';

export default function ChefList() {
    const navigate = useNavigate();
    const [chefs, setChefs] = useState([]);
    const [followedChefs, setFollowedChefs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [followedLoading, setFollowedLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState(""); // New state for filter
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 6;

    useEffect(() => {
        fetchChefs();
        fetchFollowedChefs(); // Keep fetching followed chefs
    }, [currentPage, searchQuery, filter]); // Added filter to dependency array

    const fetchFollowedChefs = async () => {
        setFollowedLoading(true);
        try {
            const response = await getFollowingApi();
            setFollowedChefs(response.data.datas);
        } catch (error) {
            console.error('Error fetching followed chefs:', error);
        } finally {
            setFollowedLoading(false);
        }
    };

    const fetchChefs = async () => {
        setLoading(true);
        try {
            const response = await getChefsApi(currentPage, limit, searchQuery, filter);
            setChefs(response.data.datas);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching chefs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-12 text-center">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
                        Meet Our <span className="text-emerald-600">Master Chefs</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Discover the culinary artists behind your favorite dishes. Explore their profiles, recipes, and workshops.
                    </p>
                </div>

                {/* Followed Chefs Section */}
                {/* {followedLoading ? (
                    <div className="flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 mb-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex-shrink-0 w-32 md:w-40 animate-pulse">
                                <div className="w-full aspect-square bg-gray-200 rounded-[2rem] mb-3" />
                                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                            </div>
                        ))}
                    </div>
                ) : followedChefs.length > 0 && (
                    <div className="mb-16">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                <Star className="text-amber-400 fill-amber-400" size={24} />
                                Chefs You Follow
                            </h2>
                            <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                                {followedChefs.length} Following
                            </span>
                        </div>
                        <div className="flex gap-6 overflow-x-auto pb-6 hide-scrollbar -mx-4 px-4">
                            {followedChefs.map((follow: any) => (
                                <div
                                    key={follow._id}
                                    onClick={() => navigate(`/foodie/chef/${follow.followingId?._id}`)}
                                    className="flex-shrink-0 w-32 md:w-40 group cursor-pointer"
                                >
                                    <div className="relative mb-3">
                                        <div className="w-full aspect-square rounded-[2rem] overflow-hidden shadow-md ring-4 ring-white group-hover:ring-emerald-100 transition-all duration-300">
                                            <img
                                                src={follow.followingId.image || follow.followingId?.image || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=400&fit=crop'} alt={follow.followingId?.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-xl border-2 border-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ArrowRight size={14} />
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-center truncate px-2 group-hover:text-emerald-600 transition-colors">
                                        {follow.followingId?.name}
                                    </h4>
                                </div>
                            ))}
                        </div>
                    </div>
                )} */}

                {/* Search and Filters Section */}
                <div className="max-w-4xl mx-auto mb-16">
                    <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-100">
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <div className="flex-1 w-full">
                                <SearchBar
                                    placeholder="Search by specialty or name..."
                                    onSearch={handleSearch}
                                />
                            </div>
                            <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl">
                                {['', 'chinese','arabic', 'Indian', 'Italian'].map((spec) => (
                                    <button
                                        key={spec}
                                        onClick={() => {
                                            setFilter(spec);
                                            setCurrentPage(1);
                                        }}
                                        className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${filter === spec
                                            ? 'bg-emerald-600 text-white shadow-md'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-white'
                                            }`}
                                    >
                                        {spec || 'All'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chef Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {chefs.map((chef: any) => (
                                <div
                                    key={chef._id}
                                    className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        <img
                                            src={chef.image || chef.chefId?.image || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=400&fit=crop'}
                                            alt={chef.chefId?.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />

                                    </div>

                                    <div className="p-6">
                                        <div className="mb-4">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                                                {chef.chefId?.name}
                                            </h3>
                                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                                                <MapPin className="w-4 h-4" />
                                                {chef.location}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {chef.specialities.slice(0, 3).map((spec: string, idx: number) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold"
                                                >
                                                    {spec}
                                                </span>
                                            ))}
                                            {chef.specialities.length > 3 && (
                                                <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-xs font-semibold">
                                                    +{chef.specialities.length - 3} more
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => navigate(`/foodie/chef/${chef.chefId?._id}`)}
                                            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-emerald-600 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                        >
                                            View Profile
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-12 flex justify-center">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onChange={setCurrentPage}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
