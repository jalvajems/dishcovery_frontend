import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Video, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { getMyBookingsApi, cancelBookingApi } from '@/api/bookingApi';
import { useNavigate } from 'react-router-dom';
import Pagination from '@/components/shared/Pagination';
import FoodieNavbar from '@/components/shared/foodie/Navbar.foodie';
import { toast } from 'react-toastify';

export default function MyWorkshopsFoodie() {
    const navigate = useNavigate();
    const [workshops, setWorkshops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 4;

    useEffect(() => {
        fetchMyWorkshops();
    }, [currentPage]);

    const fetchMyWorkshops = async () => {
        try {
            setLoading(true);
            const res = await getMyBookingsApi();
            const data = res.data.data;

            setTotalPages(Math.ceil(data.length / limit));
            const paginated = data.slice((currentPage - 1) * limit, currentPage * limit);
            setWorkshops(paginated);
        } catch (error) {
            console.error("Failed to fetch my workshops");
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="min-h-screen bg-[#fcfcfc] pb-20">
            {/* <FoodieNavbar /> */}

            <div className="max-w-7xl mx-auto px-8 pt-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div>
                        <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">My <span className="text-green-600">Workshops</span></h1>
                        <p className="text-gray-500 font-medium text-lg">Manage your upcoming and completed culinary sessions.</p>
                    </div>

                    <div className="flex gap-4 p-1.5 bg-gray-100 rounded-2xl">
                        <button className="px-6 py-2.5 bg-white text-gray-900 rounded-xl font-black text-xs uppercase tracking-wider shadow-sm">All Bookings</button>
                        <button className="px-6 py-2.5 text-gray-400 font-black text-xs uppercase tracking-wider hover:text-gray-600 transition-all">Upcoming</button>
                        <button className="px-6 py-2.5 text-gray-400 font-black text-xs uppercase tracking-wider hover:text-gray-600 transition-all">Past</button>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-6">
                        {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-50 animate-pulse rounded-[2.5rem]"></div>)}
                    </div>
                ) : workshops.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[3rem] shadow-xl border border-gray-50">
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-100">
                            <Calendar className="w-10 h-10 text-green-500" />
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 mb-4">You haven't joined any workshops yet</h3>
                        <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto">Master new skills and flavors by joining a session with our pro chefs.</p>
                        <button
                            onClick={() => navigate('/foodie/workshop-discovery')}
                            className="px-10 py-5 bg-gray-900 text-white rounded-2xl font-black hover:bg-green-600 transition-all shadow-xl shadow-gray-100"
                        >
                            Explore Workshops
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {workshops.map((booking: any) => {
                            const workshop = booking.workshopId;
                            if (!workshop) return null;

                            const isCancelled = booking.status === 'CANCELLED';
                            const isConfirmed = booking.status === 'CONFIRMED';
                            const isPending = booking.status === 'PENDING';
                            const isCompleted = workshop.status === 'COMPLETED';

                            return (
                                <div
                                    key={booking._id}
                                    className={`bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-50 overflow-hidden hover:border-green-200 transition-all group ${isCancelled ? 'opacity-60 saturate-50' : ''}`}
                                >
                                    <div className="flex flex-col md:flex-row items-stretch">
                                        <div className="md:w-64 h-48 md:h-auto overflow-hidden relative">
                                            <img
                                                src={workshop.images || "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=400&fit=crop"}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                alt={workshop.title}
                                            />
                                            <div className="absolute top-4 left-4">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-white/90 backdrop-blur-sm text-gray-900 shadow-sm`}>
                                                    {workshop.mode}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex-1 p-8 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-4">
                                                    <h3 className="text-2xl font-black text-gray-900 group-hover:text-green-600 transition-colors leading-tight">
                                                        {workshop.title}
                                                    </h3>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${workshop.status === 'LIVE' ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' :
                                                            isCancelled ? 'bg-red-50 text-red-600 border-red-100' :
                                                                isConfirmed ? 'bg-green-50 text-green-600 border-green-100' :
                                                                    isCompleted ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                                        'bg-yellow-50 text-yellow-600 border-yellow-100'
                                                            }`}>
                                                            {isCancelled ? 'Cancelled' : workshop.status === 'LIVE' ? 'Live Now' : isCompleted ? 'Completed' : booking.status}
                                                        </span>
                                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                                                            {booking.bookingType} • ₹{booking.amount}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-6 mb-6">
                                                    <div className="flex items-center gap-2 text-gray-500">
                                                        <Calendar size={16} className="text-green-500" />
                                                        <span className="text-xs font-bold uppercase tracking-wider">{new Date(workshop.date).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-500">
                                                        <Clock size={16} className="text-green-500" />
                                                        <span className="text-xs font-bold uppercase tracking-wider">{workshop.startTime}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-500">
                                                        {workshop.mode === 'ONLINE' ? <Video size={16} className="text-green-500" /> : <MapPin size={16} className="text-green-500" />}
                                                        <span className="text-xs font-bold uppercase tracking-wider">{workshop.mode === 'ONLINE' ? 'Virtual Kitchen' : workshop.location?.city}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-50">
                                                {workshop.status === 'LIVE' && workshop.mode === 'ONLINE' && isConfirmed ? (
                                                    <button
                                                        onClick={() => navigate(`/foodie/live-session/${workshop._id}`)}
                                                        className="flex-1 flex items-center justify-center gap-3 py-4 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 transition-all shadow-lg shadow-red-100"
                                                    >
                                                        <Play size={18} fill="currentColor" />
                                                        Join Live Room
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => navigate(`/foodie/workshop-detail/${workshop._id}`)}
                                                        className="flex-1 flex items-center justify-center gap-3 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-green-600 transition-all"
                                                    >
                                                        <ArrowRight size={18} />
                                                        {isCancelled ? 'Rebook Workshop' : 'View Details'}
                                                    </button>
                                                )}

                                                {isCompleted && (
                                                    <button
                                                        onClick={() => navigate(`/foodie/workshop-summary/${workshop._id}`)}
                                                        className="flex-1 flex items-center justify-center gap-3 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                                                    >
                                                        <CheckCircle2 size={18} />
                                                        View Summary
                                                    </button>
                                                )}

                                                {/* {booking.status === 'CONFIRMED'&&isConfirmed && workshop.status !== 'LIVE' && (
                                                    <button
                                                        onClick={async () => {
                                                            if (window.confirm("Are you sure you want to cancel this booking?")) {
                                                                try {
                                                                    await cancelBookingApi(booking._id);
                                                                    toast.success("Booking cancelled successfully");
                                                                    fetchMyWorkshops();
                                                                } catch (err: any) {
                                                                    toast.error(err.response?.data?.message || "Failed to cancel");
                                                                }
                                                            }
                                                        }}
                                                        className="flex-1 flex items-center justify-center gap-3 py-4 bg-red-50 text-red-600 rounded-2xl font-black hover:bg-red-100 transition-all border border-red-100"
                                                    >
                                                        Cancel Seat
                                                    </button>
                                                )} */}

                                                {workshop.status === 'COMPLETED' && (
                                                    <button className="flex-1 flex items-center justify-center gap-3 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black hover:bg-gray-100 transition-all border border-gray-100">
                                                        <CheckCircle2 size={18} />
                                                        Review Chef
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {workshops.length > 0 && (
                    <div className="mt-12 bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-50">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
