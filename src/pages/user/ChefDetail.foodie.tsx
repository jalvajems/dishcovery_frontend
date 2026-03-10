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
import { logError } from '@/utils/errorHandler';
import { followChefApi, unfollowChefApi, checkIsFollowingApi, getFollowStatsApi } from '@/api/followApi';
import FoodieNavbar from '@/components/shared/foodie/Navbar.foodie';
import ReviewSection from '@/components/shared/ReviewPage';
import Pagination from '@/components/shared/Pagination';
import { useChatStore } from '@/store/chatStore';

import type { IRecipe } from '@/types/recipe.types';
import type { IBlog } from '@/types/blog.types';
import type { IWorkshop } from '@/types/workshop.types';
import type { IChefDetail } from '@/types/chef.types';

type ActiveTab = 'recipes' | 'blogs' | 'workshops' | 'reviews';
type ActivityItem = IRecipe | IBlog | IWorkshop;

export default function ChefDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [chef, setChef] = useState<IChefDetail | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [stats, setStats] = useState({ followers: 0, following: 0 });
    const [loading, setLoading] = useState(true);
    const [followLoading, setFollowLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<ActiveTab>('recipes');

    // Activity states
    const [activities, setActivities] = useState<ActivityItem[]>([]);
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
            logError(error, 'Error fetching chef details');
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
            logError(error, 'Error toggling follow');
        } finally {
            setFollowLoading(false);
        }
    };

    const fetchActivities = async () => {
        setActivityLoading(true);
        try {
            let response: { data: { datas: ActivityItem[]; totalPages: number } } | undefined;
            if (activeTab === 'recipes') {
                response = await getChefRecipesApi(id!, currentPage, limit, '');
            } else if (activeTab === 'blogs') {
                response = await getChefBlogsApi(id!, currentPage, limit, '');
            } else if (activeTab === 'workshops') {
                response = await getChefWorkshopsApi(id!, currentPage, limit, '', '');
            }

            if (response) {
                setActivities(response.data.datas);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            logError(error, `Error fetching ${activeTab}`);
        } finally {
            setActivityLoading(false);
        }
    };
    console.log("----", activities);

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
        <div className="min-h-screen bg-gray-50/50 pb-20 font-sans">
            <FoodieNavbar />

            {/* Hero Banner with Gradient Overlay */}
            <div className="relative h-[350px] md:h-[450px] w-full group overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1428515613728-6b4607e44363?q=80&w=2070&auto=format&fit=crop"
                    alt="Kitchen Banner"
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Sidebar - Profile Info */}
                    <div className="lg:w-1/3 flex flex-col gap-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-gray-100 flex flex-col items-center text-center animate-fade-in-up">
                            <div className="relative mb-6">
                                <div className="w-40 h-40 rounded-full p-2 bg-white shadow-lg -mt-20">
                                    <img
                                        src={chef.chefId?.image || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=400&fit=crop'}
                                        alt={chef.chefId?.name}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                </div>
                                <div className="absolute bottom-2 right-2 bg-emerald-500 text-white p-2 rounded-full shadow-lg border-4 border-white">
                                    <ShieldCheck size={20} />
                                </div>
                            </div>

                            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{chef.chefId?.name}</h1>
                            <p className="text-emerald-600 font-bold text-sm uppercase tracking-wider mb-4">
                                {chef.isVerified ? 'Verified Master Chef' : 'Culinary Artist'}
                            </p>

                            <div className="flex flex-wrap justify-center gap-2 mb-6">
                                {chef.specialities?.slice(0, 3).map((spec: string, idx: number) => (
                                    <span key={idx} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100">
                                        {spec}
                                    </span>
                                ))}
                            </div>

                            <p className="text-gray-600 leading-relaxed mb-6 text-sm px-2">
                                {chef.bio || "Crafting culinary magic through passion and tradition. Join me on a journey of flavors."}
                            </p>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-3 w-full">
                                <button
                                    onClick={handleFollow}
                                    disabled={followLoading}
                                    className={`py-3 px-4 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2 shadow-sm ${isFollowing
                                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-emerald-200 hover:-translate-y-0.5'
                                        }`}
                                >
                                    {followLoading ? <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" /> :
                                        isFollowing ? <UserMinus size={18} /> : <UserPlus size={18} />}
                                    {isFollowing ? 'Unfollow' : 'Follow'}
                                </button>
                                <button
                                    onClick={async () => {
                                        try {
                                            const chefUserId = chef.chefId?._id;
                                            if (!chefUserId) return;
                                            const conversation = await useChatStore.getState().createOrGetConversation(chefUserId, 'chef');
                                            if (conversation) navigate(`/foodie/chat/${conversation._id}`);
                                        } catch (error) {
                                            logError(error, 'Error creating conversation');
                                        }
                                    }}
                                    className="py-3 px-4 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 shadow-sm"
                                >
                                    <MessageSquare size={18} /> Message
                                </button>
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 animate-fade-in-up delay-100">
                            <h3 className="font-bold text-lg text-gray-900 mb-4 px-2">Chef Stats</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-emerald-50/50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform text-emerald-600">
                                            <Users size={18} />
                                        </div>
                                        <span className="text-gray-600 font-medium text-sm">Followers</span>
                                    </div>
                                    <span className="font-bold text-gray-900">{stats.followers}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-amber-50/50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform text-amber-500">
                                            <Star size={18} className="fill-current" />
                                        </div>
                                        <span className="text-gray-600 font-medium text-sm">Rating</span>
                                    </div>
                                    <span className="font-bold text-gray-900">4.8/5.0</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-blue-50/50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform text-blue-500">
                                            <MapPin size={18} />
                                        </div>
                                        <span className="text-gray-600 font-medium text-sm">Location</span>
                                    </div>
                                    <span className="font-bold text-gray-900 truncate max-w-[120px] text-right">{chef.location}</span>
                                </div>
                            </div>
                        </div>

                        {/* Professional Details (Certificates, etc.) */}
                        <div className="space-y-4 animate-fade-in-up delay-200">
                            {/* Certificates */}
                            {chef.certificates && chef.certificates.length > 0 && (
                                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-4 text-emerald-700">
                                        <Award className="w-5 h-5" />
                                        <h3 className="font-bold text-gray-900">Certificates</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {chef.certificates?.map((cert: string, idx: number) => (
                                            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                                                {cert}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Achievements */}
                            {chef.achievements && chef.achievements.length > 0 && (
                                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-4 text-amber-600">
                                        <Trophy className="w-5 h-5" />
                                        <h3 className="font-bold text-gray-900">Achievements</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {chef.achievements?.map((ach: string, idx: number) => (
                                            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                                {ach}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Skills */}
                            {chef.skills && chef.skills.length > 0 && (
                                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-4 text-blue-600">
                                        <Zap className="w-5 h-5" />
                                        <h3 className="font-bold text-gray-900">Skills</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {chef.skills?.map((skill: string, idx: number) => (
                                            <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Content - Tabs and Grid */}
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-[2rem] p-2 shadow-sm border border-gray-100 mb-8 flex overflow-x-auto hide-scrollbar sticky top-24 z-30">
                            {[
                                { id: 'recipes', icon: ChefHat, label: 'Recipes' },
                                { id: 'blogs', icon: BookOpen, label: 'Blogs' },
                                { id: 'workshops', icon: Calendar, label: 'Workshops' },
                                { id: 'reviews', icon: MessageSquare, label: 'Reviews' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id as ActiveTab)}
                                    className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all whitespace-nowrap flex-1 justify-center ${activeTab === tab.id
                                        ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/10'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <tab.icon size={18} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="min-h-[400px]">
                            {activeTab === 'reviews' ? (
                                <div className="animate-fade-in-up">
                                    <ReviewSection reviewableId={chef.chefId?._id} reviewableType="Chef" />
                                </div>
                            ) : (
                                <div className="space-y-8 animate-fade-in-up">
                                    {activityLoading ? (
                                        <div className="flex justify-center py-20">
                                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-emerald-600"></div>
                                        </div>
                                    ) : activities.length > 0 ? (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {activities.map((item: ActivityItem) => (
                                                    <ActivityCard
                                                        key={item._id}
                                                        item={item}
                                                        type={activeTab}
                                                        navigate={navigate}
                                                    />
                                                ))}
                                            </div>
                                            <div className="flex justify-center pt-4">
                                                <Pagination
                                                    currentPage={currentPage}
                                                    totalPages={totalPages}
                                                    onChange={setCurrentPage}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2rem] border border-gray-100 border-dashed text-center">
                                            <div className="bg-gray-50 p-6 rounded-full mb-4">
                                                {activeTab === 'recipes' ? <ChefHat size={32} className="text-gray-300" /> :
                                                    activeTab === 'blogs' ? <BookOpen size={32} className="text-gray-300" /> :
                                                        <Calendar size={32} className="text-gray-300" />}
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">No {activeTab} Found</h3>
                                            <p className="text-gray-400 max-w-sm">
                                                This chef hasn't posted any {activeTab} yet. Check back later!
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface ActivityCardProps {
    item: ActivityItem;
    type: ActiveTab;
    navigate: (path: string) => void;
}

function ActivityCard({ item, type, navigate }: ActivityCardProps) {
    const isWorkshop = type === 'workshops';
    const isBlog = type === 'blogs';

    // Type guards or direct safe access
    const title = item.title;
    // Images handling: Workshop has 'banner', Blog has 'coverImage', Recipe has 'images[]'
    const image = (item as IRecipe).images?.[0] || (item as IBlog).coverImage || (item as IWorkshop).banner || 'https://images.unsplash.com/photo-1495195129352-aed325a55b65?w=400&h=300&fit=crop';

    // Category/Tag/Cuisine
    const tag = (item as IWorkshop).category || (item as IBlog).tags?.[0] || (item as IRecipe).cuisine || 'General';

    return (
        <div
            onClick={() => {
                const path = isWorkshop ? `/foodie/workshop-detail/${item._id}` :
                    isBlog ? `/foodie/blog-detail/${item._id}` :
                        `/foodie/recipe-detail/${item._id}`;
                navigate(path);
            }}
            className="group bg-white rounded-[2rem] shadow-sm hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={image}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-gray-900 rounded-lg text-xs font-bold shadow-sm">
                        {tag}
                    </span>
                </div>
            </div>

            <div className="p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                    {title}
                </h4>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    {isWorkshop ? (
                        <>
                            <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg"><Clock size={14} className="text-emerald-500" /> {(item as IWorkshop).duration}m</span>
                            <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg"><Star size={14} className="text-amber-400 fill-amber-400" /> 4.9</span>
                        </>
                    ) : isBlog ? (
                        <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg"><Calendar size={14} className="text-emerald-500" /> {new Date((item as IBlog).createdAt).toLocaleDateString()}</span>
                    ) : (
                        <>
                            <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg"><Clock size={14} className="text-emerald-500" /> {(item as IRecipe).cookingTime}m</span>
                            <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg"><Star size={14} className="text-amber-400 fill-amber-400" /> 4.8</span>
                        </>
                    )}
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <span className="text- emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        View Details
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all text-gray-400">
                        <ArrowRight size={14} />
                    </div>
                </div>
            </div>
        </div>
    );
}
