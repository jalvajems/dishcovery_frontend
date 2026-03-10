import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getWorkshopByIdApi, approveWorkshopApi, rejectWorkshopApi } from "@/api/workshopApi";
import {
    ChevronLeft,
    Calendar,
    Clock,
    Users,
    MapPin,
    Video,
    DollarSign,
    CheckCircle,
    XCircle,
    AlertCircle
} from "lucide-react";
import { toast } from "react-toastify";
import { getErrorMessage, logError } from "@/utils/errorHandler";

import type { IWorkshop } from "@/types/workshop.types";

interface IWorkshopDetail extends Omit<IWorkshop, 'chefId'> {
    chefId: {
        _id: string;
        name: string;
        avatar?: string;
    };
}

export default function WorkshopDetailAdmin() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [workshop, setWorkshop] = useState<IWorkshopDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [rejectionReason, setRejectionReason] = useState("");
    const [showRejectModal, setShowRejectModal] = useState(false);

    useEffect(() => {
        fetchWorkshop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchWorkshop = async () => {
        try {
            if (!id) return;
            const response = await getWorkshopByIdApi(id);
            setWorkshop(response.data.data as IWorkshopDetail);
        } catch (error: unknown) {
            logError(error);
            toast.error(getErrorMessage(error, "Failed to fetch workshop details"));
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        try {
            await approveWorkshopApi(id!);
            toast.success("Workshop approved successfully");
            fetchWorkshop();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to approve workshop"));
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            toast.error("Please provide a rejection reason");
            return;
        }
        try {
            await rejectWorkshopApi(id!, { rejectionReason });
            toast.success("Workshop rejected");
            setShowRejectModal(false);
            fetchWorkshop();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to reject workshop"));
        }
    };

    if (loading) return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div></div>;
    if (!workshop) return <div className="p-8 text-center text-gray-500">Workshop not found</div>;

    return (
        <div className="p-8 max-w-5xl mx-auto pb-20">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition-colors"
            >
                <ChevronLeft className="w-5 h-5" />
                Back to Management
            </button>

            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-3 inline-block ${workshop.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                workshop.status === 'PENDING_APPROVAL' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {workshop.status.replace('_', ' ')}
                            </span>
                            <h1 className="text-4xl font-black text-gray-900 leading-tight">{workshop.title}</h1>
                            <div className="flex items-center gap-3 mt-4 text-gray-600">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold uppercase">
                                    {workshop.chefId?.name?.charAt(0) || 'C'}
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-semibold uppercase">Chef</p>
                                    <p className="font-bold text-gray-800">{workshop.chefId?.name || 'Unknown Chef'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                    {/* Details Section */}
                    <div className="md:col-span-2 p-8 space-y-8 border-r border-gray-50">
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-green-600" />
                                Description
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                                {workshop.description}
                            </p>
                        </section>

                        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

                        <section className="grid grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Schedule</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <Calendar className="w-5 h-5 text-green-500" />
                                        <span className="font-medium">{new Date(workshop.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <Clock className="w-5 h-5 text-green-500" />
                                        <span className="font-medium">{workshop.startTime} ({workshop.duration} mins)</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Capacity</h3>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <Users className="w-5 h-5 text-green-500" />
                                    <span className="font-medium">{workshop.participantLimit} Foodies Max</span>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Location & Mode</h3>
                            {workshop.mode === 'ONLINE' ? (
                                <div className="flex items-center gap-3 p-4 bg-indigo-50 text-indigo-700 rounded-2xl border border-indigo-100">
                                    <Video className="w-6 h-6" />
                                    <div>
                                        <p className="font-bold">Online Session</p>
                                        <p className="text-sm opacity-90 text-indigo-500">In-app video call hosted by {workshop.chefId?.name}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-orange-50 text-orange-700 rounded-2xl border border-orange-100 p-5">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-6 h-6 mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="font-bold text-lg">{workshop.location?.venueName}</p>
                                            <p className="opacity-90">{workshop.location?.address}, {workshop.location?.city}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Pricing & Actions Section */}
                    <div className="bg-gray-50/50 p-8 flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Pricing</h3>
                            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm mb-8 text-center">
                                {workshop.isFree ? (
                                    <span className="text-4xl font-black text-green-600">FREE</span>
                                ) : (
                                    <div className="flex items-center justify-center text-4xl font-black text-gray-900">
                                        <DollarSign className="w-8 h-8 text-green-500" />
                                        <span>{workshop.price}</span>
                                    </div>
                                )}
                                <p className="text-xs text-gray-400 font-bold uppercase mt-2">Per Participant</p>
                            </div>

                            {workshop.status === 'PENDING_APPROVAL' && (
                                <div className="space-y-3">
                                    <button
                                        onClick={handleApprove}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-2xl font-bold shadow-lg hover:bg-green-700 hover:scale-[1.02] transition-all"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        Approve Workshop
                                    </button>
                                    <button
                                        onClick={() => setShowRejectModal(true)}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white text-red-600 border-2 border-red-50 rounded-2xl font-bold hover:bg-red-50 transition-all font-bold"
                                    >
                                        <XCircle className="w-5 h-5" />
                                        Reject
                                    </button>
                                </div>
                            )}

                            {workshop.status === 'REJECTED' && workshop.rejectionReason && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                                    <p className="text-xs font-bold text-red-400 uppercase mb-1">Rejection Reason</p>
                                    <p className="text-red-700 italic text-sm">"{workshop.rejectionReason}"</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <p className="text-[10px] text-gray-400 font-bold uppercase text-center tracking-widest">
                                Workshop ID: {workshop._id}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rejection Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Reject Workshop</h2>
                        <p className="text-gray-500 mb-6">Please provide a constructive reason for rejecting this workshop so the chef can improve it.</p>

                        <textarea
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl h-32 focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none mb-6"
                            placeholder="e.g., Description is too vague, or pricing doesn't match the duration..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        ></textarea>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition-all"
                            >
                                Confirm Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
