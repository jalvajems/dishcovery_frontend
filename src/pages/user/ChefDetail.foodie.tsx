import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getChefDetailApi,
    getChefRecipesApi,
    getChefBlogsApi,
    getChefWorkshopsApi
} from '@/api/foodieApi';
import {
    ChefHat,
    BookOpen,
    Calendar,
    MapPin,
    Star,
    MessageSquare,
    Clock,
    ArrowRight,
    Award,
    Trophy,
    Zap,
    UserPlus,
    UserMinus,
    ShieldCheck,
    Users
} from 'lucide-react';
import { followChefApi, unfollowChefApi, checkIsFollowingApi, getFollowStatsApi } from '@/api/followApi';
import FoodieNavbar from '@/components/shared/foodie/Navbar.foodie';
import ReviewSection from '@/components/shared/ReviewPage';
import Pagination from '@/components/shared/Pagination';

type ActiveTab = 'recipes' | 'blogs' | 'workshops' | 'reviews';

export default function ChefDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [chef, setChef] = useState<any>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [stats, setStats] = useState({ followers: 0, following: 0 });
    const [loading, setLoading] = useState(true);
    const [followLoading, setFollowLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<ActiveTab>('recipes');

    // Activity states
    const [activities, setActivities] = useState<any[]>([]);
    const [activityLoading, setActivityLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 4;

    useEffect(() => {
        if (id) {
            fetchChefDetails();
        }
    }, [id]);

    useEffect(() => {
        if (id && activeTab !== 'reviews') {
            fetchActivities();
        }
    }, [id, activeTab, currentPage]);

    const fetchChefDetails = async () => {
        setLoading(true);
        try {
            const response = await getChefDetailApi(id!);
            setChef(response.data.data);

            // Fetch follow status and stats
            const [isFollowingRes, statsRes] = await Promise.all([
                checkIsFollowingApi(response.data.data.chefId._id),
                getFollowStatsApi(response.data.data.chefId._id)
            ]);
            setIsFollowing(isFollowingRes.data.datas);
            setStats(statsRes.data.datas);
        } catch (error) {
            console.error('Error fetching chef details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async () => {
        if (!chef || followLoading) return;
        setFollowLoading(true);
        try {
            if (isFollowing) {
                await unfollowChefApi(chef.chefId._id);
                setIsFollowing(false);
                setStats(prev => ({ ...prev, followers: prev.followers - 1 }));
            } else {
                await followChefApi(chef.chefId._id);
                setIsFollowing(true);
                setStats(prev => ({ ...prev, followers: prev.followers + 1 }));
            }
        } catch (error) {
            console.error('Error toggling follow:', error);
        } finally {
            setFollowLoading(false);
        }
    };

    const fetchActivities = async () => {
        setActivityLoading(true);
        try {
            let response: any;
            if (activeTab === 'recipes') {
                response = await getChefRecipesApi(id!, currentPage, limit, '');
            } else if (activeTab === 'blogs') {
                response = await getChefBlogsApi(id!, currentPage, limit, '');
            } else if (activeTab === 'workshops') {
                response = await getChefWorkshopsApi(id!, currentPage, limit);
            }

            if (response) {
                setActivities(response.data.datas);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error(`Error fetching ${activeTab}:`, error);
        } finally {
            setActivityLoading(false);
        }
    };

    const handleTabChange = (tab: ActiveTab) => {
        setActiveTab(tab);
        setCurrentPage(1);
        setActivities([]);
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (!chef) {
        return <div className="text-center py-20">Chef not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <FoodieNavbar />

            {/* Header / Hero */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                        <div className="relative">
                            <img
                                src={chef.image || chef.chefId?.image || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=400&fit=crop'}
                                alt={chef.chefId?.name}
                                className="w-40 h-40 md:w-56 md:h-56 rounded-3xl object-cover shadow-xl border-4 border-white"
                            />
                            <div className="absolute -bottom-4 right-0 md:right-4 bg-emerald-500 text-white px-4 py-2 rounded-2xl shadow-lg border-2 border-white flex items-center gap-2 font-bold whitespace-nowrap">
                                <Star className="w-4 h-4 fill-white" />
                                4.8 Rating
                            </div>
                        </div>

                        <div className="flex-1 space-y-4 pt-4">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
                                    {chef.chefId?.name}
                                </h1>
                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-gray-500 font-medium">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4 text-emerald-600" />
                                        {chef.location}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <Users className="w-4 h-4 text-emerald-600" />
                                        {stats.followers} Followers
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                        {chef.isVerified ? 'Verified Chef' : 'Master Chef'}
                                    </span>
                                </div>
                            </div>

                            <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
                                {chef.bio || "Crafting culinary magic through passion and tradition."}
                            </p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4 py-2">
                                <button
                                    onClick={handleFollow}
                                    disabled={followLoading}
                                    className={`px-8 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-lg ${isFollowing
                                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-105 active:scale-95'
                                        } disabled:opacity-50`}
                                >
                                    {followLoading ? (
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    ) : isFollowing ? (
                                        <>
                                            <UserMinus size={20} />
                                            Unfollow
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus size={20} />
                                            Follow Chef
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                                {chef.specialities?.map((spec: string, idx: number) => (
                                    <span key={idx} className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold border border-emerald-100">
                                        {spec}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Professional Details Section */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Certificates */}
                        <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100">
                            <div className="flex items-center gap-3 mb-4 text-emerald-700">
                                <Award className="w-6 h-6" />
                                <h3 className="font-bold text-lg">Certificates</h3>
                            </div>
                            {chef.certificates?.length > 0 ? (
                                <ul className="space-y-2">
                                    {chef.certificates.map((cert: string, idx: number) => (
                                        <li key={idx} className="text-sm font-medium text-gray-700 flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                                            {cert}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-400 italic">No certificates listed</p>
                            )}
                        </div>

                        {/* Achievements */}
                        <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-100">
                            <div className="flex items-center gap-3 mb-4 text-amber-700">
                                <Trophy className="w-6 h-6" />
                                <h3 className="font-bold text-lg">Achievements</h3>
                            </div>
                            {chef.achievements?.length > 0 ? (
                                <ul className="space-y-2">
                                    {chef.achievements.map((ach: string, idx: number) => (
                                        <li key={idx} className="text-sm font-medium text-gray-700 flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                            {ach}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-400 italic">No achievements listed</p>
                            )}
                        </div>

                        {/* Skills */}
                        <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                            <div className="flex items-center gap-3 mb-4 text-blue-700">
                                <Zap className="w-6 h-6" />
                                <h3 className="font-bold text-lg">Culinary Skills</h3>
                            </div>
                            {chef.skills?.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {chef.skills.map((skill: string, idx: number) => (
                                        <span key={idx} className="px-3 py-1 bg-white border border-blue-100 text-blue-600 rounded-lg text-xs font-bold shadow-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 italic">No skills listed</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <div className="max-w-7xl mx-auto px-4 mt-8">
                <div className="flex overflow-x-auto gap-2 p-1 bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 hide-scrollbar">
                    <TabButton
                        active={activeTab === 'recipes'}
                        label="Recipes"
                        icon={ChefHat}
                        onClick={() => handleTabChange('recipes')}
                    />
                    <TabButton
                        active={activeTab === 'blogs'}
                        label="Blogs"
                        icon={BookOpen}
                        onClick={() => handleTabChange('blogs')}
                    />
                    <TabButton
                        active={activeTab === 'workshops'}
                        label="Workshops"
                        icon={Calendar}
                        onClick={() => handleTabChange('workshops')}
                    />
                    <TabButton
                        active={activeTab === 'reviews'}
                        label="Reviews"
                        icon={MessageSquare}
                        onClick={() => handleTabChange('reviews')}
                    />
                </div>

                {/* Content Area */}
                <div className="min-h-[400px]">
                    {activeTab === 'reviews' ? (
                        <div className="max-w-4xl mx-auto">
                            <ReviewSection reviewableId={chef.chefId?._id} reviewableType="Chef" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {activityLoading ? (
                                <div className="flex justify-center py-20">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
                                </div>
                            ) : activities.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {activities.map((item: any) => (
                                            <ActivityCard
                                                key={item._id}
                                                item={item}
                                                type={activeTab}
                                                navigate={navigate}
                                            />
                                        ))}
                                    </div>
                                    <div className="mt-12 flex justify-center">
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onChange={setCurrentPage}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        {activeTab === 'recipes' ? <ChefHat size={32} className="text-gray-300" /> :
                                            activeTab === 'blogs' ? <BookOpen size={32} className="text-gray-300" /> :
                                                <Calendar size={32} className="text-gray-300" />}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">No {activeTab} yet</h3>
                                    <p className="text-gray-500">This chef hasn't posted any {activeTab} yet.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function TabButton({ active, label, icon: Icon, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${active
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-gray-500 hover:bg-gray-50 hover:text-emerald-600'
                }`}
        >
            <Icon size={18} />
            {label}
        </button>
    );
}

function ActivityCard({ item, type, navigate }: any) {
    const isWorkshop = type === 'workshops';
    const isBlog = type === 'blogs';

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
            <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-48 h-48 sm:h-auto overflow-hidden">
                    <img
                        src={item.images || item.image || 'https://images.unsplash.com/photo-1495195129352-aed325a55b65?w=400&h=300&fit=crop'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt={item.title}
                    />
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
                                {isWorkshop ? item.category : isBlog ? item.tags?.[0] : item.cuisine}
                            </span>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-1">
                            {item.title}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            {isWorkshop ? (
                                <>
                                    <span className="flex items-center gap-1"><Clock size={14} /> {item.duration} min</span>
                                    <span className="flex items-center gap-1"><Star size={14} className="text-amber-400 fill-amber-400" /> 4.9</span>
                                </>
                            ) : isBlog ? (
                                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                            ) : (
                                <>
                                    <span className="flex items-center gap-1"><Clock size={14} /> {item.cookingTime} min</span>
                                    <span className="flex items-center gap-1"><Star size={14} className="text-amber-400 fill-amber-400" /> 4.8</span>
                                </>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            const path = isWorkshop ? `/foodie/workshop-detail/${item._id}` :
                                isBlog ? `/foodie/blog-detail/${item._id}` :
                                    `/foodie/recipe-detail/${item._id}`;
                            navigate(path);
                        }}
                        className="flex items-center gap-2 text-emerald-600 font-bold hover:gap-3 transition-all"
                    >
                        View More <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
