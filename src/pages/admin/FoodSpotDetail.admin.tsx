import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    adminApproveFoodSpotApi,
    adminUnapproveFoodSpotApi,
    rejectFoodSpotApi
} from "@/api/adminApi";
import { getFoodSpotDetailApi } from "@/api/foodieApi";
import {
    ChevronLeft,
    MapPin,
    Clock,
    Tag,
    User,
    CheckCircle,
    XCircle,
    AlertCircle,
    UtensilsCrossed,
} from "lucide-react";
import { toast } from "react-toastify";
import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getErrorMessage, logError } from "@/utils/errorHandler";
import type { IFoodSpot } from "@/types/foodSpot.types";

// Ensure Mapbox token is set
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function FoodSpotDetailAdmin() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [foodSpot, setFoodSpot] = useState<IFoodSpot | null>(null);
    const [loading, setLoading] = useState(true);
    const [rejectionReason, setRejectionReason] = useState("");
    const [showRejectModal, setShowRejectModal] = useState(false);

    useEffect(() => {
        fetchFoodSpot();
    }, [id]);

    const fetchFoodSpot = async () => {
        try {
            if (!id) return;
            const response = await getFoodSpotDetailApi(id);
            if (response.data && response.data.success) {
                setFoodSpot(response.data.data);
            } else {
                // Fallback or error handling
                setFoodSpot(response.data.data);
            }
        } catch (error: unknown) {
            logError(error);
            toast.error(getErrorMessage(error, "Failed to fetch food spot details"));
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        try {
            await adminApproveFoodSpotApi(id!);
            toast.success("Food Spot approved successfully");
            fetchFoodSpot();
            fetchFoodSpot();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to approve food spot"));
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            toast.error("Please provide a rejection reason");
            return;
        }
        try {
            await rejectFoodSpotApi(id!, rejectionReason);
            toast.success("Food Spot rejected/unapproved");
            setShowRejectModal(false);
            fetchFoodSpot();
            fetchFoodSpot();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to reject food spot"));
        }
    };

    const handleUnapprove = async () => {
        try {
            await adminUnapproveFoodSpotApi(id!);
            toast.success("Food Spot unapproved successfully");
            fetchFoodSpot();
            fetchFoodSpot();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to unapprove food spot"));
        }
    };

    if (loading) return <div className="flex justify-center items-center h-full min-h-[500px]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div></div>;
    if (!foodSpot) return <div className="p-8 text-center text-gray-500">Food Spot not found</div>;

    const {
        name,
        coverImage,
        description,
        images,
        address,
        openingHours,
        speciality,
        tags,
        foodieId,
        isApproved,
        isBlocked,
        location,
        rejectionReason: existingRejectionReason,
        exploredFoods,
    } = foodSpot;

    const [lng, lat] = location?.coordinates || [0, 0];

    return (
        <div className="p-8 max-w-7xl mx-auto pb-20">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition-colors"
            >
                <ChevronLeft className="w-5 h-5" />
                Back to Management
            </button>

            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                {/* Header Section */}
                <div className="relative h-64 md:h-80 w-full">
                    {coverImage ? (
                        <img src={coverImage} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                            No Cover Image
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-8 w-full">
                        <div className="flex justify-between items-end">
                            <div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-3 inline-block ${isApproved ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                                    }`}>
                                    {isApproved ? 'Approved' : 'Pending Approval'}
                                </span>
                                {isBlocked && (
                                    <span className="ml-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-3 inline-block bg-red-500 text-white">
                                        Blocked
                                    </span>
                                )}
                                <h1 className="text-4xl font-black text-white leading-tight">{name}</h1>
                                {address && (
                                    <p className="text-white/90 mt-2 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        {address.fullAddress}
                                    </p>
                                )}
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
                                {description || "No description provided."}
                            </p>
                        </section>

                        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Specialities</h3>
                                <div className="flex flex-wrap gap-2">
                                    {speciality?.map((spec: string, idx: number) => (
                                        <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                                            {spec}
                                        </span>
                                    )) || "N/A"}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {tags?.map((tag: string, idx: number) => (
                                        <span key={idx} className="flex items-center gap-1 text-gray-600 text-sm">
                                            <Tag className="w-3 h-3" /> {tag}
                                        </span>
                                    )) || "N/A"}
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Explored Foods</h3>
                            {exploredFoods && exploredFoods.length > 0 ? (
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                    {exploredFoods.map((food: any, idx: number) => (
                                        <div key={idx} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex gap-4 items-center">
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden relative">
                                                {food.image ? (
                                                    <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <UtensilsCrossed className="w-6 h-6" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-1 gap-2">
                                                    <span className="font-semibold text-gray-900 text-sm">{food.name || "Food Item"}</span>
                                                    {food.price != null && (
                                                        <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-lg text-xs border border-green-100 whitespace-nowrap">
                                                            ₹{food.price}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 line-clamp-2">{food.description || "No description provided."}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No explored foods listed</p>
                            )}
                        </section>

                        {/* Location Map */}
                        <section className="h-64 rounded-2xl overflow-hidden border border-gray-200 shadow-inner relative">
                            {lng && lat ? (
                                <Map
                                    initialViewState={{
                                        longitude: lng,
                                        latitude: lat,
                                        zoom: 14
                                    }}
                                    style={{ width: '100%', height: '100%' }}
                                    mapStyle="mapbox://styles/mapbox/streets-v11"
                                    accessToken={mapboxgl.accessToken || undefined}
                                    scrollZoom={false}
                                >
                                    <Marker longitude={lng} latitude={lat} color="#10B981" />
                                    <NavigationControl position="top-right" />
                                </Map>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                                    Map location not available
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Meta & Actions Section */}
                    <div className="bg-gray-50/50 p-8 flex flex-col justify-between">
                        <div className="space-y-6">
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Curator</h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">{foodieId?.name || "Unknown"}</p>
                                        <p className="text-xs text-gray-500">Foodie</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Opening Hours</h3>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <Clock className="w-5 h-5 text-gray-400" />
                                    <span className="font-medium">{openingHours?.open} - {openingHours?.close}</span>
                                </div>
                            </div>

                            {existingRejectionReason && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                                    <p className="text-xs font-bold text-red-400 uppercase mb-1">Rejection Reason</p>
                                    <p className="text-red-700 italic text-sm">"{existingRejectionReason}"</p>
                                </div>
                            )}

                            <div className="space-y-3 pt-4">
                                {!isApproved ? (
                                    <>
                                        <button
                                            onClick={handleApprove}
                                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-2xl font-bold shadow-lg hover:bg-green-700 hover:scale-[1.02] transition-all"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => setShowRejectModal(true)}
                                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white text-red-600 border-2 border-red-50 rounded-2xl font-bold hover:bg-red-50 transition-all"
                                        >
                                            <XCircle className="w-5 h-5" />
                                            Reject
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleUnapprove} // Or use reject for unapprove logic if preferred
                                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-yellow-100 text-yellow-700 rounded-2xl font-bold hover:bg-yellow-200 transition-all"
                                    >
                                        <XCircle className="w-5 h-5" />
                                        Unapprove / Revoke
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <p className="text-[10px] text-gray-400 font-bold uppercase text-center tracking-widest">
                                Spot ID: {id}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rejection Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Reject Food Spot</h2>
                        <p className="text-gray-500 mb-6">Please provide a reason for rejecting this food spot.</p>

                        <textarea
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl h-32 focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none mb-6"
                            placeholder="e.g., Inappropriate content, Duplicate listing..."
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
