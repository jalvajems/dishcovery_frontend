import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, Home, Star, MessageSquare, Calendar, Clock, Users as UsersIcon } from 'lucide-react';
import { getWorkshopByIdApi } from '@/api/workshopApi';
import { getSessionInfoApi } from '@/api/sessionApi';
import { toast } from 'react-toastify';

const WorkshopSummary = () => {
    const { workshopId } = useParams<{ workshopId: string }>();
    const navigate = useNavigate();
    const [workshop, setWorkshop] = useState<any>(null);
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!workshopId) return;
            try {
                const [wRes, sRes] = await Promise.all([
                    getWorkshopByIdApi(workshopId),
                    getSessionInfoApi(workshopId)
                ]);
                setWorkshop(wRes.data.data);
                setSession(sRes.data);
            } catch (error) {
                console.error("Error fetching summary data:", error);
                toast.error("Failed to load workshop summary");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [workshopId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-[3rem] p-10 shadow-2xl text-center border border-gray-100">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-lg">
                    <CheckCircle2 size={40} className="text-green-600" />
                </div>

                <h1 className="text-3xl font-black text-gray-900 mb-2">Workshop Completed!</h1>
                <p className="text-gray-500 font-medium mb-8">
                    {workshop?.title || "Culinary Session"}
                </p>

                {/* Data Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                    <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100">
                        <Calendar className="text-indigo-600 mx-auto mb-2" size={20} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Date</p>
                        <p className="text-xs font-black text-gray-900">{workshop ? new Date(workshop.date).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100">
                        <Clock className="text-orange-600 mx-auto mb-2" size={20} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Time</p>
                        <p className="text-xs font-black text-gray-900">{workshop?.startTime || 'N/A'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100 col-span-2 md:col-span-1">
                        <UsersIcon className="text-green-600 mx-auto mb-2" size={20} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Participants</p>
                        <p className="text-xs font-black text-gray-900">{session?.participants?.length || 0} Joined</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                    <button className="flex flex-col items-center gap-3 p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:bg-green-50 hover:border-green-100 transition-all group">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Star className="text-yellow-500" size={24} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Rate Session</span>
                    </button>
                    <button className="flex flex-col items-center gap-3 p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:bg-green-50 hover:border-green-100 transition-all group">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                            <MessageSquare className="text-blue-500" size={24} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Feedback</span>
                    </button>
                </div>

                <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black shadow-xl shadow-gray-200 hover:bg-green-600 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                    <Home size={20} />
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default WorkshopSummary;
