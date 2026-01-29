import { useEffect, useState } from 'react';
import { Search, Calendar, Video, MapPin, ArrowRight, Clock } from 'lucide-react';
import { getApprovedWorkshopsApi } from '@/api/workshopApi';
import { useNavigate } from 'react-router-dom';
import Pagination from '@/components/shared/Pagination';
import SearchBar from '@/components/shared/SearchBar';

export default function WorkshopDiscovery() {
    const navigate = useNavigate();
    const [workshops, setWorkshops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [modeFilter, setModeFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 6;

    useEffect(() => {
        fetchWorkshops();
    }, [currentPage, searchQuery, modeFilter]);

    const fetchWorkshops = async () => {
        try {
            setLoading(true);
            const res = await getApprovedWorkshopsApi(currentPage, limit, searchQuery, modeFilter);
            const { data, totalCount } = res.data;

            setWorkshops(data);
            setTotalPages(Math.ceil(totalCount / limit));
        } catch (error) {
            console.error("Failed to fetch workshops");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20">
            {/* Dynamic Hero Section */}
            <div className="relative h-[450px] overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600&h=600&fit=crop"
                    className="w-full h-full object-cover"
                    alt="Cooking Workshop"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center">
                    <div className="max-w-7xl mx-auto px-8 w-full">
                        <div className="max-w-2xl">
                            <span className="px-4 py-1 bg-green-500 text-white rounded-full text-xs font-black tracking-widest uppercase mb-4 inline-block">Live Experiences</span>
                            <h1 className="text-6xl font-black text-white leading-tight mb-6">Master Culinary Arts with Elite <span className="text-green-400">Chefs.</span></h1>
                            <p className="text-white/80 text-xl font-medium mb-8">Join interactive, live cooking sessions from the comfort of your kitchen or at exclusive venues near you.</p>

                            <div className="max-w-md">
                                <SearchBar
                                    placeholder="Search workshops or chefs..."
                                    onSearch={(val) => { setSearchQuery(val); setCurrentPage(1); }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 -mt-10 relative z-10">
                {/* Filters Bar */}
                <div className="bg-white p-4 rounded-[2rem] shadow-2xl border border-gray-100 flex flex-wrap gap-4 items-center justify-between mb-12">
                    <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
                        {['all', 'ONLINE', 'OFFLINE'].map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setModeFilter(mode)}
                                className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${modeFilter === mode ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {mode === 'all' ? 'All Sessions' : mode}
                            </button>
                        ))}
                    </div>

                    <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                        Showing {workshops.length} curated workshops
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => <div key={i} className="h-[400px] bg-white rounded-[2.5rem] animate-pulse"></div>)}
                    </div>
                ) : workshops.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[3rem] shadow-xl border border-gray-50">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">No Workshops Found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {workshops.map((w: any) => (
                            <div
                                key={w._id}
                                className="group bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-50 flex flex-col h-full"
                            >
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={w.banner || `https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80`}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        alt={w.title}
                                    />
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase ${w.mode === 'ONLINE' ? 'bg-indigo-600/90 text-white' : 'bg-orange-600/90 text-white'}`}>
                                            {w.mode}
                                        </span>
                                        {w.status === 'LIVE' && (
                                            <span className="px-3 py-1 bg-red-600 text-white rounded-lg text-[10px] font-black tracking-widest uppercase animate-pulse">
                                                Live Now
                                            </span>
                                        )}
                                    </div>
                                    <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg">
                                        <p className="text-sm font-black text-gray-900">
                                            {w.isFree ? 'FREE' : `₹${w.price}`}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-[10px] font-black text-green-700">
                                            {w.chefId?.name?.charAt(0) || 'C'}
                                        </div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Chef {w.chefId?.name || 'Pro Chef'}</p>
                                    </div>

                                    <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-green-600 transition-colors line-clamp-2 leading-tight">
                                        {w.title}
                                    </h3>

                                    <div className="space-y-3 mb-8">
                                        <div className="flex items-center gap-3 text-gray-500">
                                            <Calendar className="w-4 h-4 text-green-500" />
                                            <span className="text-xs font-bold">{new Date(w.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-500">
                                            <Clock className="w-4 h-4 text-green-500" />
                                            <span className="text-xs font-bold">{w.startTime} ({w.duration} min)</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-500">
                                            {w.mode === 'ONLINE' ? <Video className="w-4 h-4 text-green-500" /> : <MapPin className="w-4 h-4 text-green-500" />}
                                            <span className="text-xs font-bold truncate">{w.mode === 'ONLINE' ? 'Interactive Virtual Kitchen' : w.location?.city || 'Local Venue'}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/foodie/workshop-detail/${w._id}`)}
                                        disabled={w.isBooked || w.status === 'LIVE' || w.status === 'COMPLETED' || w.status === 'CANCELLED'}
                                        className={`mt-auto w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black transition-all group/btn shadow-xl ${w.isBooked
                                            ? 'bg-green-100 text-green-700 cursor-not-allowed shadow-none'
                                            : w.status === 'LIVE'
                                                ? 'bg-red-50 text-red-600 cursor-not-allowed shadow-none'
                                                : w.status === 'COMPLETED'
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                                    : w.status === 'CANCELLED'
                                                        ? 'bg-red-50 text-red-400 cursor-not-allowed shadow-none'
                                                        : 'bg-gray-900 text-white hover:bg-green-600 shadow-gray-200'
                                            }`}
                                    >
                                        {w.isBooked ? (
                                            <>Already Booked</>
                                        ) : w.status === 'LIVE' ? (
                                            <>Live Now</>
                                        ) : w.status === 'COMPLETED' ? (
                                            <>Workshop Completed</>
                                        ) : w.status === 'CANCELLED' ? (
                                            <>Cancelled</>
                                        ) : (
                                            <>
                                                Reserve Spot
                                                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-16 bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-50">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
}
