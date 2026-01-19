import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getWorkshopByIdApi,
    submitWorkshopForApprovalApi,
    startWorkshopApi,
    endWorkshopApi
} from "@/api/workshopApi";
import {
    ChevronLeft,
    Calendar,
    Clock,
    Users,
    MapPin,
    Video,
    CheckCircle,
    Play,
    Square,
    Edit2,
    Info,
    Mail,
    UserCheck,
    XCircle
} from "lucide-react";
import { toast } from "react-toastify";
import { getWorkshopParticipantsApi } from "@/api/bookingApi";

export default function WorkshopDetailChef() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [workshop, setWorkshop] = useState<any>(null);
    const [participants, setParticipants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchWorkshop();
            fetchParticipants();
        }
    }, [id]);

    const fetchWorkshop = async () => {
        try {
            const response = await getWorkshopByIdApi(id!);
            setWorkshop(response.data.data);
        } catch (error) {
            toast.error("Failed to fetch workshop details");
        } finally {
            setLoading(false);
        }
    };

    const fetchParticipants = async () => {
        try {
            const response = await getWorkshopParticipantsApi(id!);
            setParticipants(response.data.data);
        } catch (error) {
            console.error("Failed to fetch participants");
        }
    };

    const handleSubmit = async () => {
        try {
            await submitWorkshopForApprovalApi(id!);
            toast.success("Submitted for approval");
            fetchWorkshop();
        } catch (error) {
            toast.error("Failed to submit");
        }
    };

    const handleStart = async () => {
        try {
            await startWorkshopApi(id!);
            toast.success("Workshop is now LIVE!");
            fetchWorkshop();
            navigate(`/chef/live-session/${id}`);
        } catch (error) {
            toast.error("Failed to start session");
        }
    };

    const handleEnd = async () => {
        try {
            await endWorkshopApi(id!);
            toast.success("Workshop session ended");
            fetchWorkshop();
        } catch (error) {
            toast.error("Failed to end session");
        }
    };

    if (loading) return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div></div>;
    if (!workshop) return <div className="p-8 text-center text-gray-500">Workshop not found</div>;

    const canEdit = workshop.status === 'DRAFT' || workshop.status === 'REJECTED';
    const canStart = workshop.mode === 'ONLINE' && (workshop.status === 'APPROVED' || workshop.status === 'UPCOMING');

    return (
        <div className="p-8 max-w-5xl mx-auto pb-20 bg-gray-50/30 min-h-screen">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-8 transition-all font-semibold group"
            >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back to Workshop Studio
            </button>

            <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
                {/* Header Hero Area */}
                <div className="bg-white p-10 border-b border-gray-50 relative overflow-hidden">
                    {/* Decorative Element */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-50"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${workshop.status === 'APPROVED' ? 'bg-green-100 text-green-700 border-green-200' :
                                    workshop.status === 'LIVE' ? 'bg-purple-100 text-purple-700 border-purple-200 animate-pulse' :
                                        workshop.status === 'PENDING_APPROVAL' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-gray-100 text-gray-700 border-gray-200'
                                    }`}>
                                    {workshop.status.replace('_', ' ')}
                                </span>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{workshop.mode} Session</span>
                            </div>
                            <h1 className="text-5xl font-black text-gray-900 leading-tight mb-2">{workshop.title}</h1>
                            <div className="flex items-center gap-2 text-gray-400 font-medium">
                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">{workshop.category}</span>
                                <span>•</span>
                                <span>Created {new Date(workshop.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {canEdit && (
                                <button
                                    onClick={() => navigate(`/chef/workshop-edit/${workshop._id}`)}
                                    className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit
                                </button>
                            )}
                            {canEdit && workshop.status !== 'PENDING_APPROVAL' && (
                                <button
                                    onClick={handleSubmit}
                                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-all shadow-xl"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Submit for Approval
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                    <div className="md:col-span-2 p-10 space-y-10 border-r border-gray-50">
                        {/* Admin Feedback */}
                        {workshop.status === 'REJECTED' && (
                            <div className="p-6 bg-red-50 rounded-[2rem] border border-red-100 flex gap-4 items-start">
                                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-red-600">
                                    <Info className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-red-900 font-black text-lg mb-1">Feedback from Admin</h3>
                                    <p className="text-red-700 font-medium leading-relaxed italic">"{workshop.rejectionReason}"</p>
                                    <p className="text-red-600/60 text-xs mt-3 font-bold uppercase">Please address these issues and resubmit for approval.</p>
                                </div>
                            </div>
                        )}

                        <section>
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                                Workshop Details
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-3xl border border-gray-100">
                                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-green-600">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date</p>
                                        <p className="font-bold text-gray-800">{new Date(workshop.date).toLocaleDateString(undefined, { dateStyle: 'full' })}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-3xl border border-gray-100">
                                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-green-600">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Time</p>
                                        <p className="font-bold text-gray-800">{workshop.startTime} ({workshop.duration} mins)</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-3xl border border-gray-100">
                                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-green-600">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Max Capacity</p>
                                        <p className="font-bold text-gray-800">{workshop.participantLimit} Participants</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-3xl border border-gray-100">
                                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-green-600">
                                        <Video className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Session Mode</p>
                                        <p className="font-bold text-gray-800">{workshop.mode}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-tight">About this workshop</h3>
                            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap font-medium">
                                {workshop.description}
                            </p>
                        </section>

                        <section>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                    <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                                    Participants ({participants.length})
                                </h2>
                            </div>

                            {participants.length === 0 ? (
                                <div className="p-12 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200 text-center">
                                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No foodies have booked yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {participants.map((booking) => (
                                        <div key={booking._id} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-green-200 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 font-black">
                                                    {booking.foodieId?.name?.charAt(0) || 'F'}
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900">{booking.foodieId?.name || 'Anonymous Foodie'}</p>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                            <Mail size={10} />
                                                            {booking.foodieId?.email || 'N/A'}
                                                        </span>
                                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${booking.bookingType === 'PAID' ? 'bg-indigo-50 text-indigo-600' : 'bg-green-50 text-green-600'
                                                            }`}>
                                                            {booking.bookingType}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`flex items-center justify-end gap-1.5 font-black text-[10px] uppercase tracking-widest ${booking.status === 'CONFIRMED' ? 'text-green-600' :
                                                    booking.status === 'CANCELLED' ? 'text-red-500' : 'text-yellow-600'
                                                    }`}>
                                                    {booking.status === 'CONFIRMED' ? <UserCheck size={14} /> : <XCircle size={14} />}
                                                    {booking.status}
                                                </div>
                                                <p className="text-[10px] font-bold text-gray-400 mt-1">{new Date(booking.bookedAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {workshop.mode === 'OFFLINE' && workshop.location && (
                            <section>
                                <h3 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-tight">Location</h3>
                                <div className="bg-orange-50/50 p-8 rounded-[2.5rem] border border-orange-100/50 relative overflow-hidden group">
                                    <MapPin className="absolute top-4 right-4 w-32 h-32 text-orange-200/40 -mr-8 -mt-8" />
                                    <div className="relative z-10 flex items-start gap-4">
                                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-orange-600 flex-shrink-0">
                                            <MapPin className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <p className="font-black text-2xl text-orange-950 mb-1">{workshop.location.venueName}</p>
                                            <p className="text-orange-900 font-semibold opacity-80">{workshop.location.address}, {workshop.location.city}</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Side Control Panel */}
                    <div className="bg-gray-50/50 p-10 flex flex-col justify-between overflow-hidden relative">
                        {/* Background Accent */}
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-100/30 rounded-full -mb-32 -mr-32 blur-3xl"></div>

                        <div className="relative z-10 space-y-10">
                            <section>
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Pricing</h3>
                                <div className="p-8 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 text-center">
                                    {workshop.isFree ? (
                                        <div className="py-2">
                                            <span className="text-5xl font-black text-green-600 tracking-tighter">FREE</span>
                                            <p className="text-xs font-bold text-green-400/60 uppercase mt-2">Community Session</p>
                                        </div>
                                    ) : (
                                        <div className="py-2">
                                            <div className="flex items-center justify-center gap-1">
                                                <span className="text-2xl font-black text-gray-400">₹</span>
                                                <span className="text-5xl font-black text-gray-900 tracking-tighter">{workshop.price}</span>
                                            </div>
                                            <p className="text-xs font-bold text-gray-400 uppercase mt-2">Per Participant</p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Session Control - The most practical part */}
                            <section>
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Live Control</h3>
                                {workshop.mode === 'ONLINE' ? (
                                    <div className="p-8 bg-white rounded-[2.5rem] shadow-xl border border-gray-100">
                                        {workshop.status === 'LIVE' ? (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-2xl border border-purple-100 mb-6">
                                                    <div className="w-3 h-3 bg-purple-600 rounded-full animate-ping"></div>
                                                    <span className="text-purple-700 font-black text-sm uppercase tracking-wider">Session is Live</span>
                                                </div>
                                                <button
                                                    onClick={() => navigate(`/chef/live-session/${id}`)}
                                                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-purple-600 text-white rounded-2xl font-black shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all group"
                                                >
                                                    <Video className="w-5 h-5 fill-current" />
                                                    Re-Join Session
                                                </button>
                                                <button
                                                    onClick={handleEnd}
                                                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-100 hover:bg-red-700 transition-all group"
                                                >
                                                    <Square className="w-5 h-5 fill-current" />
                                                    End Session
                                                </button>
                                            </div>
                                        ) : canStart ? (
                                            <button
                                                onClick={handleStart}
                                                className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-green-600 text-white rounded-2xl font-black shadow-xl shadow-green-100 hover:bg-green-700 hover:-translate-y-1 transition-all group"
                                            >
                                                <Play className="w-6 h-6 fill-current" />
                                                Start Session
                                            </button>
                                        ) : (
                                            <div className="text-center py-6 text-gray-400">
                                                <Video className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                                <p className="text-sm font-bold uppercase tracking-widest leading-relaxed">
                                                    Session controls will appear<br />after admin approval
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 text-center text-gray-400 shadow-sm">
                                        <MapPin className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                        <p className="text-sm font-bold uppercase tracking-widest">In-person session</p>
                                    </div>
                                )}
                            </section>
                        </div>

                        <div className="relative z-10 pt-10 mt-10 border-t border-gray-100">
                            <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <span>Workshop Studio</span>
                                <span>ID: {workshop._id.slice(-8)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}
