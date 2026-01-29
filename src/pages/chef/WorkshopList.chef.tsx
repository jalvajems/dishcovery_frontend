import { useEffect, useState } from 'react';
import { Plus, Search, Calendar, Video, MapPin, ArrowRight, Edit3, Send, XCircle } from 'lucide-react';
import { getChefWorkshopsApi, submitWorkshopForApprovalApi, cancelWorkshopApi } from '@/api/workshopApi';
import { useUserStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Pagination from '@/components/shared/Pagination';

export default function WorkshopListChef() {
    const navigate = useNavigate();
    const { isVerifiedUser } = useUserStore();
    const [workshops, setWorkshops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 6;
    const [activeTab, setActiveTab] = useState("All");

    const tabs = ["All", "DRAFT", "PENDING_APPROVAL", "APPROVED", "LIVE", "COMPLETED", "CANCELLED", "REJECTED"];

    // Modal State
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancellationReason, setCancellationReason] = useState("");
    const [selectedWorkshopId, setSelectedWorkshopId] = useState<string | null>(null);

    useEffect(() => {
        fetchWorkshops();
    }, [currentPage, searchQuery, activeTab]);

    const fetchWorkshops = async () => {
        try {
            setLoading(true);
            const res = await getChefWorkshopsApi(currentPage, limit, searchQuery, activeTab);
            setWorkshops(res.data.datas || []);
            setTotalPages(res.data.totalPages || 1);
        } catch (error) {
            toast.error("Failed to load workshops");
        } finally {
            setLoading(false);
        }
    };
    console.log('workshoppppppppppp',workshops);
    

    const handleSubmitForApproval = async (id: string) => {
        try {
            await submitWorkshopForApprovalApi(id);
            toast.success("Workshop submitted for admin approval");
            fetchWorkshops();
        } catch (error) {
            toast.error("Failed to submit workshop");
        }
    };

    const handleOpenCancelModal = (e: React.MouseEvent, workshopId: string) => {
        e.stopPropagation();
        setSelectedWorkshopId(workshopId);
        setCancellationReason("");
        setShowCancelModal(true);
    };

    const handleConfirmCancellation = async () => {
        if (!selectedWorkshopId) return;
        if (!cancellationReason.trim()) {
            toast.error("Please enter a reason for cancellation");
            return;
        }

        try {
            await cancelWorkshopApi(selectedWorkshopId, cancellationReason);
            toast.success("Workshop cancelled successfully");
            fetchWorkshops();
            setShowCancelModal(false);
            setSelectedWorkshopId(null);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to cancel workshop");
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: any = {
            DRAFT: "bg-gray-100 text-gray-700 border-gray-200",
            PENDING_APPROVAL: "bg-yellow-100 text-yellow-700 border-yellow-200",
            APPROVED: "bg-green-100 text-green-700 border-green-200",
            REJECTED: "bg-red-100 text-red-700 border-red-200",
            LIVE: "bg-purple-100 text-purple-700 border-purple-200 animate-pulse",
            COMPLETED: "bg-blue-100 text-blue-700 border-blue-200",
        };
        return (
            <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tighter uppercase border ${styles[status] || styles.DRAFT}`}>
                {status.replace('_', ' ')}
            </span>
        );
    };

    return (
        <div className="min-h-screen p-8 bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
            {/* Header section with Hero-like feel */}
            <div className="mb-12">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tight">Workshop <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Studio</span></h1>
                        <p className="text-gray-500 mt-2 font-medium">Create, manage, and host your culinary sessions.</p>
                    </div>
                    <button
                        disabled={!isVerifiedUser}
                        onClick={() => navigate('/chef/workshop-add')}
                        className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold shadow-2xl transition-all duration-300 ${isVerifiedUser
                            ? "bg-black text-white hover:bg-green-600 hover:-translate-y-1"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        <Plus className="w-5 h-5" />
                        Create Workshop
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-2xl transform transition-all focus-within:scale-[1.01] mb-8">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-3xl text-gray-900 placeholder-gray-400 shadow-xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all"
                        placeholder="Search your workshops..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-3">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === tab
                                ? "bg-black text-white shadow-lg shadow-gray-200 scale-105"
                                : "bg-white text-gray-500 hover:bg-green-50 hover:text-green-600 shadow-sm"
                                }`}
                        >
                            {tab.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>
            ) : workshops?.length === 0 ? (
                <div className="bg-white rounded-3xl p-20 text-center shadow-xl border border-gray-50">
                    <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Plus className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Workshops Found</h2>
                    <p className="text-gray-500 mb-8">Ready to host your first cooking session? Create it now!</p>
                    <button
                        onClick={() => navigate('/chef/workshop-add')}
                        className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all"
                    >
                        Get Started
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {workshops.map((w: any) => (
                        <div key={w._id} className="group bg-white rounded-[2.5rem] p-4 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-50 flex flex-col h-full relative overflow-hidden">
                            {/* Banner or Decorative background */}
                            {w.banner ? (
                                <div className="h-48 rounded-[2rem] overflow-hidden mb-4 relative">
                                    <img src={w.banner} alt={w.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                </div>
                            ) : (
                                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 group-hover:bg-green-100 transition-colors duration-500"></div>
                            )}

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4 p-2">
                                    {getStatusBadge(w.status)}
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${w.mode === 'ONLINE' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                                        {w.mode}
                                    </span>
                                </div>

                                <div className="px-2 mb-6">
                                    <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2 leading-tight">
                                        {w.title}
                                    </h3>
                                    <div className="flex flex-col gap-2 mt-4">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-xs font-semibold">{new Date(w.date).toLocaleDateString()} · {w.startTime}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500">
                                            {w.mode === 'ONLINE' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                                            <span className="text-xs font-semibold">{w.mode === 'ONLINE' ? 'Virtual Studio' : w.location?.venueName || 'Offline Location'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto p-2 bg-gray-50 rounded-3xl border border-gray-100 flex justify-between items-center">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Price</p>
                                        <p className="text-lg font-black text-gray-900 pl-2">
                                            {w.isFree ? <span className="text-green-600 uppercase">Free</span> : `₹${w.price}`}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        {(w.status === 'DRAFT' || w.status === 'REJECTED') && (
                                            <>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); navigate(`/chef/workshop-edit/${w._id}`); }}
                                                    className="p-3 bg-white text-gray-600 rounded-2xl hover:text-green-600 hover:shadow-md transition-all border border-gray-100"
                                                    title="Edit"
                                                >
                                                    <Edit3 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleSubmitForApproval(w._id); }}
                                                    className="p-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 hover:shadow-lg transition-all"
                                                    title="Submit for Approval"
                                                >
                                                    <Send className="w-5 h-5" />
                                                </button>
                                            </>
                                        )}
                                        {(w.status === 'APPROVED' || w.status === 'UPCOMING') && (
                                            <button
                                                onClick={(e) => handleOpenCancelModal(e, w._id)}
                                                className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all border border-red-100"
                                                title="Cancel Workshop"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <button
                                            onClick={() => navigate(`/chef/workshop-detail/${w._id}`)}
                                            className="p-3 bg-black text-white rounded-2xl hover:bg-green-600 transition-all group/btn"
                                            title="Manage"
                                        >
                                            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {workshops.length > 0 && (
                <div className="mt-8">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onChange={(page) => setCurrentPage(page)}
                    />
                </div>
            )}


            {/* Cancellation Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="flex items-center gap-3 mb-2 text-red-600">
                            <XCircle className="w-8 h-8" />
                            <h2 className="text-2xl font-black text-gray-900">Cancel Workshop</h2>
                        </div>
                        <p className="text-gray-500 mb-6">Are you sure? This will refund all enrolled foodies. Please provide a reason.</p>

                        <textarea
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl h-32 focus:ring-2 focus:ring-red-500 outline-none transition-all resize-none mb-6"
                            placeholder="e.g., Unforeseen personal emergency..."
                            value={cancellationReason}
                            onChange={(e) => setCancellationReason(e.target.value)}
                            autoFocus
                        ></textarea>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleConfirmCancellation}
                                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition-all"
                            >
                                Confirm Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
