import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Ticket, ShieldCheck, Zap, X, Video, Play, ArrowLeft } from 'lucide-react';
import { getWorkshopByIdApi } from '@/api/workshopApi';
import FoodieNavbar from '@/components/shared/foodie/Navbar.foodie';
import { toast } from 'react-toastify';
import ReviewSection from '@/components/shared/ReviewPage';
import Map, { Marker } from 'react-map-gl/mapbox';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getErrorMessage } from '@/utils/errorHandler';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

import type { IWorkshopPopulated } from '@/types/workshop.types';

// ... imports

export default function BookedWorkshopDetailFoodie() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [workshop, setWorkshop] = useState<IWorkshopPopulated | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDetails() {
            try {
                if (!id) return;
                const res = await getWorkshopByIdApi(id);
                setWorkshop(res.data.data);
            } catch (error) {
                toast.error(getErrorMessage(error, "Failed to load workshop details"));
            } finally {
                setLoading(false);
            }
        }
        fetchDetails();
        window.scrollTo(0, 0);
    }, [id]);
    console.log('workshop=====', workshop);


    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-green-100 border-t-green-600 rounded-full animate-spin"></div>
                    <div className="mt-4 text-center font-black text-gray-400 uppercase tracking-widest text-[10px]">Loading Your Session</div>
                </div>
            </div>
        );
    }

    if (!workshop) return <div className="p-20 text-center">Workshop not found</div>;



    return (
        <div className="min-h-screen bg-[#fcfcfc]">
            <FoodieNavbar />

            {/* Back Button */}
            <div className="absolute top-24 left-8 z-50">
                <button
                    onClick={() => navigate('/foodie/my-workshops')}
                    className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white text-gray-700 font-bold text-sm transition-all"
                >
                    <ArrowLeft size={16} />
                    Back to My Workshops
                </button>
            </div>


            {workshop.status === 'CANCELLED' && (
                <div className="bg-red-50 border-b border-red-100 p-4 sticky top-[72px] z-40">
                    <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-red-700 font-medium animate-pulse">
                        <X className="w-5 h-5" />
                        <span>This workshop has been cancelled by the Chef. Reason: {workshop.cancellationReason || "Unforseen circumstances"}</span>
                    </div>
                </div>
            )}
            {workshop.status === 'EXPIRED' && (
                <div className="bg-orange-50 border-b border-orange-100 p-4 sticky top-[72px] z-40">
                    <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-orange-700 font-medium">
                        <Clock className="w-5 h-5" />
                        <span>This workshop has expired as the chef did not start the session on time. Refunds have been initiated.</span>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <div className="relative h-[500px] w-full group overflow-hidden">
                <img
                    src={workshop.banner || "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600&h=800&fit=crop"}
                    alt={workshop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 text-white w-full mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase backdrop-blur-md border ${workshop.mode === 'ONLINE' ? 'bg-indigo-500/20 border-indigo-500/30' : 'bg-orange-500/20 border-orange-500/30'
                            }`}>
                            {workshop.mode} Session
                        </span>

                        <span className="px-4 py-1.5 bg-green-600 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg shadow-green-900/20 flex items-center gap-2">
                            <ShieldCheck size={12} />
                            Booking Confirmed
                        </span>

                        {workshop.status === 'LIVE' && (
                            <span className="px-4 py-1.5 bg-red-600 rounded-full text-[10px] font-black tracking-widest uppercase animate-pulse flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                                Live Now
                            </span>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black mb-6 leading-[1.1] max-w-4xl tracking-tight">
                        {workshop.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-8 text-gray-200">
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
                            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-black text-sm">
                                {workshop.chefId?.name?.charAt(0) || 'C'}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Master Chef</p>
                                <p className="font-bold text-white">{workshop.chefId?.name || 'Pro Chef'}</p>
                            </div>
                        </div>

                        <div className="hidden md:flex flex-col">
                            <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Date</p>
                            <p className="font-bold text-white">{new Date(workshop.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                        </div>

                        <div className="hidden md:flex flex-col">
                            <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Time</p>
                            <p className="font-bold text-white">{workshop.startTime}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full mx-auto px-4 md:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Content */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Online Session Join Card */}
                        {workshop.mode === 'ONLINE' && workshop.status === 'LIVE' && (
                            <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-gray-200">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center animate-pulse">
                                            <Video className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black">Session is Live!</h3>
                                            <p className="text-gray-400">The chef is waiting for you in the virtual kitchen.</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/foodie/live-session/${id}`)}
                                        className="w-full py-4 bg-green-500 hover:bg-green-400 text-gray-900 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3"
                                    >
                                        <Play fill="currentColor" size={20} />
                                        Join Now
                                    </button>
                                </div>
                            </div>
                        )}

                        <section>
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <div className="w-1.5 h-8 bg-green-500 rounded-full"></div>
                                Workshop Details
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed font-medium">
                                {workshop.description || "Indulge in a premium culinary journey where every detail is crafted for your learning. Our master chefs bring years of expertise to your kitchen."}
                            </p>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <HighlightCard icon={Users} label="Group Size" value={`Up to ${workshop.participantLimit} Foodies`} />
                            <HighlightCard icon={Clock} label="Duration" value={`${workshop.duration} Minutes`} />
                            <HighlightCard icon={Zap} label="Level" value="All Levels" />
                        </div>

                        {/* Offline Location Section */}
                        {workshop.mode === 'OFFLINE' && workshop.location && (
                            <section>
                                <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                    <div className="w-1.5 h-8 bg-orange-500 rounded-full"></div>
                                    The Venue
                                </h2>
                                <div className="space-y-6">
                                    <div className="bg-orange-50 rounded-[2.5rem] p-8 border border-orange-100 flex flex-col md:flex-row gap-6 items-center overflow-hidden relative">
                                        <MapPin className="absolute -bottom-10 -right-10 w-48 h-48 text-orange-200/30 rotate-12" />
                                        <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-orange-600 flex-shrink-0">
                                            <MapPin size={32} />
                                        </div>
                                        <div className="relative z-10 text-center md:text-left">
                                            <h3 className="text-2xl font-black text-orange-950 mb-1">{workshop.location.venueName}</h3>
                                            <p className="text-orange-900/70 text-base font-bold">{workshop.location.address}, {workshop.location.city}</p>
                                        </div>
                                    </div>

                                    {workshop.location.latitude && workshop.location.longitude && (
                                        <div className="h-64 w-full rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-md relative bg-gray-100">
                                            <Map
                                                initialViewState={{
                                                    longitude: workshop.location.longitude,
                                                    latitude: workshop.location.latitude,
                                                    zoom: 14
                                                }}
                                                style={{ width: '100%', height: '100%' }}
                                                mapStyle="mapbox://styles/mapbox/streets-v11"
                                                accessToken={mapboxgl.accessToken || ""}
                                            >
                                                <Marker longitude={workshop.location.longitude} latitude={workshop.location.latitude} color="#ea580c" />
                                            </Map>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        <ReviewSection reviewableId={workshop._id} reviewableType='Workshop' />

                    </div>

                    {/* Right Sidebar - Booking Summary */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 bg-white rounded-[2.5rem] p-8 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-50 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16"></div>

                            <div className="relative z-10">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Your Booking Summary</h3>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center py-3 border-b border-gray-50">
                                        <div className="flex items-center gap-3 text-gray-500">
                                            <Calendar size={16} />
                                            <span className="text-sm font-bold">Date</span>
                                        </div>
                                        <p className="font-black text-gray-900">{new Date(workshop.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-gray-50">
                                        <div className="flex items-center gap-3 text-gray-500">
                                            <Clock size={16} />
                                            <span className="text-sm font-bold">Time</span>
                                        </div>
                                        <p className="font-black text-gray-900">{workshop.startTime}</p>
                                    </div>

                                    {/* Ticket Count Display for Offline */}
                                    {workshop.mode === 'OFFLINE' && (
                                        <div className="flex justify-between items-center py-3 border-b border-gray-50">
                                            <div className="flex items-center gap-3 text-gray-500">
                                                <Ticket size={16} />
                                                <span className="text-sm font-bold">Tickets Booked</span>
                                            </div>
                                            <p className="font-black text-green-600 text-lg">{workshop.participantsCount}</p>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center py-3 border-b border-gray-50">
                                        <div className="flex items-center gap-3 text-gray-500">
                                            <span className="text-sm font-bold">Amount Paid</span>
                                        </div>
                                        <p className="font-black text-gray-900">₹{workshop.participantsCount * workshop.price || 0}</p>
                                    </div>
                                </div>

                                <div className="bg-green-50 rounded-2xl p-6 text-center border border-green-100 mb-6">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-600 mx-auto mb-3 shadow-sm">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <p className="font-black text-green-800 text-lg mb-1">You're All Set!</p>
                                    <p className="text-green-700/70 text-xs font-bold leading-relaxed px-4">
                                        your spot is reserved. We'll send you a reminder before the session starts.
                                    </p>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface HighlightCardProps {
    icon: React.ElementType;
    label: string;
    value: string | number;
}

function HighlightCard({ icon: Icon, label, value }: HighlightCardProps) {
    return (
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-lg shadow-gray-50 hover:-translate-y-1 transition-all">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-4 border border-green-100">
                <Icon size={20} />
            </div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-lg font-black text-gray-900">{value}</p>
        </div>
    );
}
