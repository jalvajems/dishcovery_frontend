import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFollowersApi } from '@/api/followApi';
import { UserCircle, MapPin, ArrowRight, ArrowLeft, Users } from 'lucide-react';
import ChefNavbar from '@/components/shared/chef/NavBar.chef';
import { showError } from '@/utils/toast';

export default function FollowersList() {
    const navigate = useNavigate();
    const [followers, setFollowers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 8;

    useEffect(() => {
        fetchFollowers();
    }, [page]);

    const fetchFollowers = async () => {
        setLoading(true);
        try {
            const response = await getFollowersApi(page, limit);
            setFollowers(response.data.datas);
            setTotal(response.data.total);
        } catch (error: any) {
            showError(error.response?.data?.message || "Failed to fetch followers");
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="min-h-screen bg-slate-50">
            <ChefNavbar />

            <main className="max-w-4xl mx-auto px-6 py-12">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-green-600 font-bold mb-8 transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Profile
                </button>

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
                            <Users size={36} className="text-green-600" />
                            Your Foodies
                        </h1>
                        <p className="text-gray-500 font-medium mt-1">
                            People who are following your culinary journey
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    </div>
                ) : followers.length === 0 ? (
                    <div className="bg-white rounded-[2rem] p-20 text-center border shadow-sm">
                        <UserCircle size={64} className="mx-auto text-gray-100 mb-6" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No followers yet</h3>
                        <p className="text-gray-500 max-w-xs mx-auto font-medium">
                            Keep posting great recipes and blogs to attract your audience!
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-4">
                            {followers.map((follow: any) => (
                                <div
                                    key={follow._id}
                                    onClick={() => navigate(`/chef/foodie-profile/${follow.followerId?._id}`)}
                                    className="group bg-white p-6 rounded-3xl border shadow-sm hover:shadow-xl hover:border-green-100 transition-all cursor-pointer flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md ring-4 ring-green-50 group-hover:ring-green-100 transition-all">
                                            <img
                                                src={follow.followerId?.image || "/default-avatar.png"}
                                                alt={follow.followerId?.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                                                {follow.followerId?.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-gray-500 text-sm mt-1 font-medium">
                                                <MapPin size={14} className="text-green-500" />
                                                {follow.followerId?.location || "Culinary Explorer"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-green-600 font-bold flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        View Profile <ArrowRight size={18} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-12 bg-white/50 backdrop-blur-sm p-4 rounded-3xl border w-fit mx-auto shadow-sm">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}
                                    className={`p-2 rounded-2xl transition-all ${page === 1 ? 'text-gray-300' : 'text-green-600 hover:bg-green-50'}`}
                                >
                                    <ArrowLeft size={24} />
                                </button>
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`w-10 h-10 rounded-xl font-bold transition-all ${page === p ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'text-gray-500 hover:bg-green-50'}`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    disabled={page === totalPages}
                                    onClick={() => setPage(p => p + 1)}
                                    className={`p-2 rounded-2xl transition-all ${page === totalPages ? 'text-gray-300' : 'text-green-600 hover:bg-green-50'}`}
                                >
                                    <ArrowRight size={24} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
