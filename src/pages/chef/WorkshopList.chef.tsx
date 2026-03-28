import { useEffect, useState } from 'react';
import { Plus, Search, Calendar, Video, MapPin, ArrowRight, Edit3, Send, XCircle } from 'lucide-react';
import { getChefWorkshopsApi, submitWorkshopForApprovalApi, cancelWorkshopApi } from '@/api/workshopApi';
import { useUserStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getErrorMessage, logError } from '@/utils/errorHandler';
import Pagination from '@/components/shared/Pagination';

import type { IWorkshop } from "@/types/workshop.types";

export default function WorkshopListChef() {
    const navigate = useNavigate();
    const { isVerifiedUser } = useUserStore();
    const [workshops, setWorkshops] = useState<IWorkshop[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 6;
    const [activeTab, setActiveTab] = useState("All");

    const tabs = ["All", "DRAFT", "PENDING_APPROVAL", "APPROVED", "LIVE", "COMPLETED", "CANCELLED", "REJECTED", "EXPIRED"];

    // Modal State
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancellationReason, setCancellationReason] = useState("");
    const [selectedWorkshopId, setSelectedWorkshopId] = useState<string | null>(null);

    useEffect(() => {
        fetchWorkshops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, searchQuery, activeTab]);

    const fetchWorkshops = async () => {
        try {
            setLoading(true);
            const res = await getChefWorkshopsApi(currentPage, limit, searchQuery, activeTab);
            setWorkshops(res.data.datas as IWorkshop[]);
            setTotalPages(res.data.totalPages || 1);
        } catch (error: unknown) {
            logError(error);
            toast.error(getErrorMessage(error, "Failed to load workshops"));
        } finally {
            setLoading(false);
        }
    };


    const handleSubmitForApproval = async (id: string) => {
        try {
            await submitWorkshopForApprovalApi(id);
            toast.success("Workshop submitted for admin approval");
            fetchWorkshops();
        } catch (error: unknown) {
            logError(error);
            toast.error(getErrorMessage(error, "Failed to submit workshop"));
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
        } catch (err: unknown) {
            logError(err);
            toast.error(getErrorMessage(err, "Failed to cancel workshop"));
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            DRAFT: "bg-gray-100 text-gray-700 border-gray-200",
            PENDING_APPROVAL: "bg-yellow-100 text-yellow-700 border-yellow-200",
            APPROVED: "bg-green-100 text-green-700 border-green-200",
            REJECTED: "bg-red-100 text-red-700 border-red-200",
            LIVE: "bg-purple-100 text-purple-700 border-purple-200 animate-pulse",
            COMPLETED: "bg-blue-100 text-blue-700 border-blue-200",
            EXPIRED: "bg-orange-100 text-orange-700 border-orange-200",
        };
        return (
            <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tighter uppercase border ${styles[status] || styles.DRAFT}`}>
                {status.replace('_', ' ')}
            </span>
        );
    };

    return (
        <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
            {/* Header section */}
            <div className="mb-8 md:mb-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">Workshop <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Studio</span></h1>
                        <p className="text-sm md:text-lg text-gray-500 mt-2 font-medium">Create, manage, and host your culinary sessions.</p>
                    </div>
                    <button
                        disabled={!isVerifiedUser}
                        onClick={() => navigate('/chef/workshop-add')}
                        className={`w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold shadow-2xl transition-all duration-300 ${isVerifiedUser
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
                <div className="flex flex-wrap gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                            className={`px-4 md:px-5 py-2 md:py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-300 whitespace-nowrap ${activeTab === tab
                                ? "bg-black text-white shadow-lg shadow-gray-200 scale-105"
                                : "bg-white text-gray-500 hover:bg-green-50 hover:text-green-600 shadow-sm"
                                }`}
                        >
                            {tab === 'All' ? 'All' : tab.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>
            ) : workshops?.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 md:p-20 text-center shadow-xl border border-gray-50 px-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Plus className="w-8 h-8 md:w-10 md:h-10 text-green-500" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">No Workshops Found</h2>
                    <p className="text-sm md:text-base text-gray-500 mb-8">Ready to host your first cooking session? Create it now!</p>
                    <button
                        onClick={() => navigate('/chef/workshop-add')}
                        className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg"
                    >
                        Get Started
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
                    {workshops.map((w: IWorkshop) => (
                        <div key={w._id} className="group bg-white rounded-[2rem] md:rounded-[2.5rem] p-4 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-50 flex flex-col h-full relative overflow-hidden">
                            {/* Banner */}
                            <div className="h-40 md:h-48 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden mb-4 relative">
                                <img src={w.banner || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80'} alt={w.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                <div className="absolute top-4 left-4 flex gap-2">
                                    {getStatusBadge(w.status)}
                                </div>
                            </div>

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="px-2 mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${w.mode === 'ONLINE' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                                            {w.mode}
                                        </span>
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2 leading-tight">
                                        {w.title}
                                    </h3>
                                    <div className="flex flex-col gap-2 mt-4 text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 flex-shrink-0" />
                                            <span className="text-[11px] md:text-xs font-semibold">{new Date(w.date).toLocaleDateString()} · {w.startTime}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {w.mode === 'ONLINE' ? <Video className="w-4 h-4 flex-shrink-0" /> : <MapPin className="w-4 h-4 flex-shrink-0" />}
                                            <span className="text-[11px] md:text-xs font-semibold truncate">{w.mode === 'ONLINE' ? 'Virtual Kitchen' : w.location?.venueName || 'Venue'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto p-2 bg-gray-50 rounded-2xl md:rounded-3xl border border-gray-100 flex justify-between items-center">
                                    <div className="pl-2">
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Price</p>
                                        <p className="text-base md:text-lg font-black text-gray-900">
                                            {w.isFree ? <span className="text-green-600 uppercase">Free</span> : `₹${w.price}`}
                                        </p>
                                    </div>
                                    <div className="flex gap-1 md:gap-2">
                                        {(w.status === 'DRAFT' || w.status === 'REJECTED') && (
                                            <>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); navigate(`/chef/workshop-edit/${w._id!}`); }}
                                                    className="p-2 md:p-3 bg-white text-gray-600 rounded-xl md:rounded-2xl hover:text-green-600 hover:shadow-md transition-all border border-gray-100"
                                                    title="Edit"
                                                >
                                                    <Edit3 className="w-4 h-4 md:w-5 md:h-5" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleSubmitForApproval(w._id!); }}
                                                    className="p-2 md:p-3 bg-green-600 text-white rounded-xl md:rounded-2xl hover:bg-green-700 hover:shadow-lg transition-all"
                                                    title="Submit for Approval"
                                                >
                                                    <Send className="w-4 h-4 md:w-5 md:h-5" />
                                                </button>
                                            </>
                                        )}
                                        {(w.status === 'APPROVED' || w.status === 'UPCOMING') && (
                                            <button
                                                onClick={(e) => handleOpenCancelModal(e, w._id!)}
                                                className="px-3 py-1.5 md:p-3 bg-red-50 text-red-600 rounded-xl md:rounded-2xl hover:bg-red-100 transition-all border border-red-100 text-[10px] md:text-xs font-bold"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <button
                                            onClick={() => navigate(`/chef/workshop-detail/${w._id!}`)}
                                            className="p-2 md:p-3 bg-black text-white rounded-xl md:rounded-2xl hover:bg-green-600 transition-all group/btn"
                                        >
                                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {workshops.length > 0 && (
                <div className="mb-20 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-100 overflow-x-auto">
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
                    <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="flex items-center gap-3 mb-2 text-red-600">
                            <XCircle className="w-8 h-8" />
                            <h2 className="text-xl md:text-2xl font-black text-gray-900">Cancel Workshop</h2>
                        </div>
                        <p className="text-sm text-gray-500 mb-6">Are you sure? This will refund all enrolled foodies. Please provide a reason.</p>

                        <textarea
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl h-32 focus:ring-2 focus:ring-red-500 outline-none transition-all resize-none mb-6 text-sm"
                            placeholder="Reason for cancellation..."
                            value={cancellationReason}
                            onChange={(e) => setCancellationReason(e.target.value)}
                            autoFocus
                        ></textarea>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all text-sm"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleConfirmCancellation}
                                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg hover:bg-red-700 transition-all text-sm"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
