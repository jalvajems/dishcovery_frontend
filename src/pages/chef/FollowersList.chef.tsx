import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFollowersApi } from '@/api/followApi';
import { UserCircle, MapPin, ArrowRight, ArrowLeft, ChefHat } from 'lucide-react';
import ChefNavbar from '@/components/shared/chef/NavBar.chef';
import { getErrorMessage, logError } from '@/utils/errorHandler';
import { showError } from '@/utils/toast';
import Pagination from '@/components/shared/Pagination';

import type { IFollower } from "@/types/follower.types";

export default function FollowersList() {
    const navigate = useNavigate();
    const [followers, setFollowers] = useState<IFollower[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 8;

    useEffect(() => {
        fetchFollowers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const fetchFollowers = async () => {
        setLoading(true);
        try {
            const response = await getFollowersApi(page, limit);
            setFollowers(response.data.datas);
            setTotal(response.data.total);
        } catch (error: unknown) {
            logError(error);
            showError(getErrorMessage(error, "Failed to fetch followers"));
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="min-h-screen bg-white pb-20 font-sans">
            <ChefNavbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header Section */}
                <div className="mb-12">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-colors mb-6 group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Profile
                    </button>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-gray-100">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
                                Your <span className="text-emerald-600">Community</span>
                            </h1>
                            <p className="text-lg text-gray-500 max-w-xl leading-relaxed">
                                The passionate foodies following your culinary journey.
                            </p>
                        </div>

                        <div className="bg-emerald-50 px-6 py-3 rounded-2xl flex items-center gap-3 border border-emerald-100">
                            <div className="bg-white p-2 rounded-full shadow-sm text-emerald-600">
                                <UserCircle size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Total Followers</p>
                                <p className="text-2xl font-black text-emerald-600 leading-none">{total}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="bg-gray-50 h-80 rounded-[2rem] animate-pulse" />
                        ))}
                    </div>
                ) : followers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-300">
                        <div className="bg-white p-6 rounded-full shadow-sm mb-6">
                            <UserCircle size={48} className="text-emerald-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No followers yet</h3>
                        <p className="text-gray-500 max-w-md text-center">
                            Share your profile and recipes to start building your community!
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {followers.map((follow: IFollower) => (
                                <div
                                    key={follow._id}
                                    onClick={() => navigate(`/chef/foodie-profile/${follow.followerId?._id}`)}
                                    className="group bg-white rounded-[2rem] p-6 shadow-[0_2px_10px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-gray-100 hover:border-emerald-100 transition-all duration-300 cursor-pointer flex flex-col items-center hover:-translate-y-1"
                                >
                                    <div className="relative mb-6">
                                        <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-emerald-500 to-teal-400 group-hover:from-emerald-400 group-hover:to-teal-300 transition-colors shadow-lg">
                                            <div className="w-full h-full rounded-full border-4 border-white overflow-hidden bg-white">
                                                <img
                                                    src={follow.followerId?.image || "/default-avatar.png"}
                                                    alt={follow.followerId?.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow-md text-emerald-500">
                                            <ChefHat size={14} />
                                        </div>
                                    </div>

                                    <div className="text-center w-full mb-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors truncate">
                                            {follow.followerId?.name}
                                        </h3>
                                        <div className="flex items-center justify-center gap-1.5 text-gray-500 text-sm font-medium">
                                            <MapPin size={14} className="text-gray-400" />
                                            {String((follow.followerId as Record<string, unknown>)?.location || "Foodie")}
                                        </div>
                                    </div>

                                    <button className="w-full mt-auto py-3 rounded-xl bg-gray-50 text-gray-700 font-bold text-sm group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                                        View Profile
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 flex justify-center">
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onChange={(p) => setPage(p)}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
