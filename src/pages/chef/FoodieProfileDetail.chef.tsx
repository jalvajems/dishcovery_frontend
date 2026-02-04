import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFoodieProfileForChefApi } from '@/api/followApi';
import { MapPin, Mail, ArrowLeft, Heart, MessageSquare } from 'lucide-react';
import ChefNavbar from '@/components/shared/chef/NavBar.chef';
import { showError } from '@/utils/toast';
import { useChatStore } from '@/store/chatStore';

export default function FoodieProfileDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchProfile();
        }
    }, [id]);

    const fetchProfile = async () => {
        try {
            const response = await getFoodieProfileForChefApi(id!);
            setProfile(response.data.datas.data);
        } catch (error: any) {
            showError(error.response?.data?.message || "Failed to fetch foodie profile");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!profile) {
        return <div className="text-center py-20 font-bold">Profile not found</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <ChefNavbar />

            <div className="max-w-4xl mx-auto px-6 py-12">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-green-600 font-bold mb-8 transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Followers
                </button>

                <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-8 md:p-12">
                        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                            <div className="w-40 h-40 md:w-48 md:h-48 rounded-[2rem] overflow-hidden shadow-2xl ring-8 ring-green-50">
                                <img
                                    src={profile.image || "/default-avatar.png"}
                                    alt={profile.userId?.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1 space-y-4">
                                <div>
                                    <h1 className="text-4xl font-black text-gray-900">
                                        {profile.userId?.name}
                                    </h1>
                                    <p className="text-lg text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2 mt-2">
                                        <Mail size={18} className="text-green-500" />
                                        {profile.userId?.email}
                                    </p>
                                </div>
                                <p className="text-gray-600 text-lg italic italic">
                                    "{profile.bio || "A passionate food lover exploring new tastes."}"
                                </p>
                                <div className="mt-6">
                                    <button
                                        onClick={async () => {
                                            try {
                                                console.log('Profile data:', profile);
                                                console.log('userId object:', profile.userId);

                                                // Try different possible structures
                                                let foodieUserId = profile.userId?._id || profile.userId?.id || profile.userId;

                                                // If userId is a string, use it directly
                                                if (typeof foodieUserId === 'object') {
                                                    foodieUserId = foodieUserId._id || foodieUserId.id;
                                                }

                                                console.log('Foodie User ID:', foodieUserId);

                                                if (!foodieUserId || typeof foodieUserId !== 'string') {
                                                    console.error('Foodie ID not found or invalid', profile);
                                                    alert('Unable to start conversation. User ID not found.');
                                                    return;
                                                }

                                                const conversation = await useChatStore.getState().createOrGetConversation(foodieUserId, 'foodie');
                                                console.log('Conversation created:', conversation);
                                                if (conversation) {
                                                    navigate(`/chef/chat/${conversation._id}`);
                                                }
                                            } catch (error) {
                                                console.error('Error creating conversation:', error);
                                            }
                                        }}
                                        className="px-8 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-lg bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95"
                                    >
                                        <MessageSquare size={20} />
                                        Message
                                    </button>
                                </div>
                            </div>
                        </div>

                        <hr className="my-12 border-gray-100" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            <div className="bg-slate-50 p-6 rounded-3xl border border-gray-100">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                                        <MapPin size={20} />
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg">Location</h3>
                                </div>
                                <p className="text-gray-600 font-semibold pl-14">
                                    {profile.location || "Not provided"}
                                </p>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-3xl border border-gray-100">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                                        <Heart size={20} />
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg">Interests</h3>
                                </div>
                                <div className="flex flex-wrap gap-2 pl-14">
                                    {profile.preferences?.length > 0 ? (
                                        profile.preferences.map((pref: string, idx: number) => (
                                            <span key={idx} className="px-3 py-1 bg-white border border-green-100 text-green-700 rounded-lg text-xs font-bold">
                                                {pref}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 italic">No interests listed</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
