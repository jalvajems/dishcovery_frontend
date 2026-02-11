import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowRight, ShieldCheck, Zap, X, Loader2 } from 'lucide-react';
import { getWorkshopByIdApi } from '@/api/workshopApi';
import { bookWorkshopApi } from '@/api/bookingApi';
import FoodieNavbar from '@/components/shared/foodie/Navbar.foodie';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/shared/CheckoutForm';
import ReviewSection from '@/components/shared/ReviewPage';
import Map, { Marker } from 'react-map-gl/mapbox';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getErrorMessage } from '@/utils/errorHandler';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function WorkshopDetailFoodie() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [workshop, setWorkshop] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

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

    const handleBooking = async () => {
        try {
            setBookingLoading(true);
            const res = await bookWorkshopApi(id!);

            if (res.data.clientSecret) {
                // Paid workshop
                setClientSecret(res.data.clientSecret);
                setShowCheckout(true);
            } else {
                // Free workshop
                toast.success("Workshop booked successfully!");
                navigate('/foodie/my-workshops');
            }
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to book workshop"));
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-green-100 border-t-green-600 rounded-full animate-spin"></div>
                    <div className="mt-4 text-center font-black text-gray-400 uppercase tracking-widest text-[10px]">Loading Experience</div>
                </div>
            </div>
        );
    }

    if (!workshop) return <div className="p-20 text-center">Workshop not found</div>;

    return (
        <div className="min-h-screen bg-[#fcfcfc]">
            <FoodieNavbar />

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
            <div className="relative h-[600px] w-full group overflow-hidden">
                <img
                    src={workshop.banner || "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600&h=800&fit=crop"}
                    alt={workshop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent"></div>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 text-white w-full mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase backdrop-blur-md border ${workshop.mode === 'ONLINE' ? 'bg-indigo-500/20 border-indigo-500/30' : 'bg-orange-500/20 border-orange-500/30'
                            }`}>
                            {workshop.mode} Session
                        </span>
                        {workshop.status === 'LIVE' && (
                            <span className="px-4 py-1.5 bg-red-600 rounded-full text-[10px] font-black tracking-widest uppercase animate-pulse">Live Now</span>
                        )}
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] max-w-4xl tracking-tight">
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
                            <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Pricing</p>
                            <p className="font-bold text-white text-xl">{workshop.isFree ? 'FREE' : `₹${workshop.price}`}</p>
                        </div>

                        {workshop.status === 'LIVE' && (
                            <button
                                onClick={() => navigate(`/foodie/live-session/${id}`)}
                                className="px-8 py-3 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 hover:scale-105 transition-all shadow-xl shadow-red-900/20 animate-pulse"
                            >
                                Join Live Session
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="w-full mx-auto px-4 md:px-8 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Left Content */}
                    <div className="lg:col-span-8 space-y-20">
                        <section>
                            <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-4">
                                <div className="w-2 h-10 bg-green-500 rounded-full"></div>
                                About the Workshop
                            </h2>
                            <p className="text-gray-600 text-xl leading-relaxed font-medium">
                                {workshop.description || "Indulge in a premium culinary journey where every detail is crafted for your learning. Our master chefs bring years of expertise to your kitchen."}
                            </p>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <HighlightCard icon={Users} label="Group Size" value={`Up to ${workshop.participantLimit} Foodies`} />
                            <HighlightCard icon={Clock} label="Duration" value={`${workshop.duration} Minutes`} />
                            <HighlightCard icon={Zap} label="Level" value="All Levels" />
                        </div>

                        {workshop.mode === 'OFFLINE' && workshop.location && (
                            <section>
                                <h2 className="text-3xl font-black text-gray-900 mb-8">The Venue</h2>
                                <div className="space-y-6">
                                    <div className="bg-orange-50 rounded-[3rem] p-10 border border-orange-100 flex flex-col md:flex-row gap-8 items-center overflow-hidden relative">
                                        <MapPin className="absolute -bottom-10 -right-10 w-64 h-64 text-orange-200/30 rotate-12" />
                                        <div className="w-20 h-20 bg-white rounded-[2rem] shadow-xl flex items-center justify-center text-orange-600 flex-shrink-0">
                                            <MapPin size={40} />
                                        </div>
                                        <div className="relative z-10 text-center md:text-left">
                                            <h3 className="text-3xl font-black text-orange-950 mb-2">{workshop.location.venueName}</h3>
                                            <p className="text-orange-900/70 text-lg font-bold">{workshop.location.address}, {workshop.location.city}</p>
                                        </div>
                                    </div>

                                    {workshop.location.latitude && workshop.location.longitude && (
                                        <div className="h-80 w-full rounded-[3rem] overflow-hidden border border-gray-100 shadow-lg relative bg-gray-100">
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

                        <section className="bg-gray-50 rounded-[3rem] p-12 border border-gray-100">
                            <div className="flex gap-6 items-start">
                                <div className="w-24 h-24 rounded-[2rem] bg-white shadow-xl flex items-center justify-center text-3xl font-black text-green-600 border border-green-50">
                                    {workshop.chefId?.name?.charAt(0) || 'C'}
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.3em] mb-2 font-black">Meet your host</h3>
                                    <h4 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">{workshop.chefId?.name || 'Professional Chef'}</h4>
                                    <p className="text-gray-500 font-medium leading-relaxed max-w-xl">A world-class culinary expert dedicated to bringing the finest flavors to your table. Specializing in {workshop.category} and passionate about interactive teaching.</p>
                                    <button className="mt-8 text-green-600 font-black text-xs uppercase tracking-widest border-b-2 border-green-200 py-1 hover:border-green-600 transition-all">View Full Profile</button>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Sidebar - Sticky Booking Card */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 bg-white rounded-[3rem] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-50 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16"></div>

                            <div className="relative z-10">
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Booking Details</h3>

                                <div className="space-y-6 mb-10">
                                    <div className="flex justify-between items-center py-4 border-b border-gray-50">
                                        <div className="flex items-center gap-3 text-gray-500">
                                            <Calendar size={18} />
                                            <span className="text-sm font-bold">Session Date</span>
                                        </div>
                                        <p className="font-black text-gray-900">{new Date(workshop.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex justify-between items-center py-4 border-b border-gray-50">
                                        <div className="flex items-center gap-3 text-gray-500">
                                            <Clock size={18} />
                                            <span className="text-sm font-bold">Start Time</span>
                                        </div>
                                        <p className="font-black text-gray-900">{workshop.startTime}</p>
                                    </div>
                                    <div className="flex justify-between items-center py-4 border-b border-gray-50">
                                        <div className="flex items-center gap-3 text-gray-500">
                                            <Users size={18} />
                                            <span className="text-sm font-bold">Open Spots</span>
                                        </div>
                                        <p className="font-black text-green-600">{workshop.participantLimit - (workshop.participantsCount || 0)} Available</p>
                                    </div>
                                    <p className="text-[10px] font-black text-400 uppercase tracking-widest mb-1">
                                        {workshop.isFree ? 'IT IS FREE!!' : 'REFUND IS NOT AVAILABLE!!'}
                                    </p>

                                </div>

                                <div className="mb-10 text-center bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{workshop.mode} Session</span>
                                        {workshop.myBooking?.attendanceStatus === 'PRESENT' && (
                                            <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border bg-green-100 text-green-700 border-green-200">
                                                Attended
                                            </span>
                                        )}
                                        {workshop.myBooking?.attendanceStatus === 'ABSENT' && (
                                            <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border bg-red-100 text-red-700 border-red-200">
                                                Absent
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-4xl font-black text-gray-900">
                                        {workshop.isFree ? 'Join Free' : `₹${workshop.price}`}
                                    </p>

                                </div>

                                <button
                                    onClick={handleBooking}
                                    disabled={bookingLoading || workshop.isBooked || workshop.status === 'LIVE' || workshop.status === 'COMPLETED' || workshop.status === 'CANCELLED' || workshop.status === 'EXPIRED'}
                                    className={`w-full flex items-center justify-center gap-3 py-6 rounded-[2rem] font-black shadow-2xl transition-all active:scale-95 group mb-6 disabled:opacity-50 disabled:cursor-not-allowed ${workshop.isBooked
                                        ? 'bg-green-100 text-green-700 shadow-none'
                                        : workshop.status === 'LIVE' || workshop.status === 'CANCELLED' || workshop.status === 'EXPIRED'
                                            ? 'bg-red-50 text-red-600 shadow-none'
                                            : workshop.status === 'COMPLETED'
                                                ? 'bg-gray-100 text-gray-400 shadow-none'
                                                : 'bg-gray-900 text-white shadow-gray-200 hover:bg-green-600 hover:-translate-y-1'
                                        }`}
                                >
                                    {bookingLoading ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        <>
                                            {workshop.isBooked ? 'Already Booked' :
                                                workshop.status === 'LIVE' ? 'Live Session Started' :
                                                    workshop.status === 'COMPLETED' ? 'Workshop Completed' :
                                                        workshop.status === 'CANCELLED' ? 'Workshop Cancelled' :
                                                            workshop.status === 'EXPIRED' ? 'Workshop Expired' :
                                                                'Reserve My Seat'}
                                            {!workshop.isBooked && workshop.status === 'APPROVED' && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                                        </>
                                    )}
                                </button>

                                <div className="flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <ShieldCheck size={14} className="text-green-500" />
                                    100% Secure Checkout
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ReviewSection reviewableId={workshop._id} reviewableType='Workshop' />
            {/* Checkout Modal */}
            {showCheckout && clientSecret && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl relative animate-in zoom-in duration-300">
                        <button
                            onClick={() => setShowCheckout(false)}
                            className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="mb-8">
                            <h2 className="text-3xl font-black text-gray-900 mb-2">Checkout</h2>
                            <p className="text-500 font-medium">REFUND IS NOT AVAILABLE!</p>
                            <p className="text-gray-500 font-medium">Complete your payment for <span className="text-gray-900 font-bold">{workshop.title}</span></p>
                        </div>

                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                            <CheckoutForm
                                clientSecret={clientSecret}
                                amount={workshop.price}
                                onSuccess={() => {
                                    setShowCheckout(false);
                                    navigate('/foodie/my-workshops');
                                }}
                                onCancel={() => setShowCheckout(false)}
                            />
                        </Elements>
                    </div>
                </div>
            )}
        </div>
    );
}

function HighlightCard({ icon: Icon, label, value }: any) {
    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-50 hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6 border border-green-100">
                <Icon size={28} />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-xl font-black text-gray-900">{value}</p>
        </div>
    );

}
