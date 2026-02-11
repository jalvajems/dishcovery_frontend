import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Heart, Share2, ChevronLeft, Star, Navigation, Plus, UtensilsCrossed } from 'lucide-react';
import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox';
import mapboxgl from 'mapbox-gl';
import { getFoodSpotDetailApi } from '@/api/foodieApi';
import 'mapbox-gl/dist/mapbox-gl.css';
import FoodieNavbar from '@/components/shared/foodie/Navbar.foodie';
import ReviewSection from '@/components/shared/ReviewPage';
import { logError } from '@/utils/errorHandler';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const isFoodSpotOpen = (openTime: string, closeTime: string) => {
  if (!openTime || !closeTime) return false;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [openH, openM] = openTime.split(':').map(Number);
  const [closeH, closeM] = closeTime.split(':').map(Number);

  const openTotal = openH * 60 + openM;
  const closeTotal = closeH * 60 + closeM;

  if (closeTotal < openTotal) {
    // spans midnight
    return currentMinutes >= openTotal || currentMinutes <= closeTotal;
  }

  return currentMinutes >= openTotal && currentMinutes <= closeTotal;
};

interface FoodSpot {
  _id: string;
  name: string;
  coverImage: string;
  description: string;
  images: string[];
  address: {
    placeName: string;
    city: string;
    state: string;
    country: string;
    fullAddress: string;
  };
  location: {
    type: string;
    coordinates: number[];
  };
  openingHours: {
    open: string;
    close: string;
    isOpenNow: boolean;
  };
  speciality: string[];
  tags: string[];
  likesCount: number;
  savesCount: number;
  foodieId: {
    id: string;
    name: string;
  };
  exploredFoods: any[];
}

export const MyFoodSpotDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [foodSpot, setFoodSpot] = useState<FoodSpot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchFoodSpot = async () => {
      try {
        const res = await getFoodSpotDetailApi(id);
        if (res.data && res.data.success) {
          setFoodSpot(res.data.data);
        } else if (res.data) {
          // Fallback if structure is different
          setFoodSpot(res.data);
        }
      } catch (error) {
        logError(error, "Failed to fetch food spot details");
      } finally {
        setLoading(false);
      }
    };

    fetchFoodSpot();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!foodSpot) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Food Spot Not Found</h2>
        <button
          onClick={() => navigate('/foodie/foodspots')}
          className="text-green-600 hover:underline font-medium"
        >
          Back to list
        </button>
      </div>
    );
  }

  const {
    name,
    coverImage,
    description,
    images,
    address,
    openingHours,
    speciality,
    tags,
    likesCount,
    location
  } = foodSpot;

  const [lng, lat] = location?.coordinates || [0, 0];
  const isOpen = openingHours ? isFoodSpotOpen(openingHours.open, openingHours.close) : false;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-20">
      {/* Navigation Bar */}
      <FoodieNavbar />

      {/* 1. Immersive Hero Section */}
      <div className="relative h-[60vh] lg:h-[70vh] w-full overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={name}
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
            <span className="text-xl font-light">No Image Available</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90" />

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-7xl mx-auto w-full z-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl animate-fade-in-up">
              <div className="flex flex-wrap gap-3 mb-4">
                {speciality?.map((spec, index) => (
                  <span
                    key={index}
                    className="px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/10 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-sm"
                  >
                    {spec}
                  </span>
                ))}
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2 ${isOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  {isOpen ? <span className="w-2 h-2 bg-white rounded-full animate-pulse" /> : null}
                  {isOpen ? 'Open Now' : 'Closed'}
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 leading-tight drop-shadow-2xl">
                {name}
              </h1>
              <div className="flex items-center text-white/80 text-lg font-medium space-x-6">
                <span className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-400" />
                  {address?.city}, {address?.state}
                </span>
                <span className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  {tags?.length || 0} Tags
                </span>
              </div>
            </div>

            <div className="flex gap-4 animate-fade-in-up delay-100">
              <button className="h-14 w-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-green-600 transition-all duration-300 group">
                <Heart className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
              <button className="h-14 w-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-green-600 transition-all duration-300 group">
                <Share2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-10 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column: Details (8 cols) */}
          <div className="lg:col-span-8 space-y-12">

            {/* Edit Button (Specific to MyFoodSpotDetail) */}
            <div className="flex justify-end">
              <button
                onClick={() => navigate(`/foodie/foodspot-edit/${id}`)}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-green-500/30 hover:scale-105 transition-all duration-300 ring-4 ring-white"
              >
                <Plus className="w-5 h-5" />
                Edit Spot Details
              </button>
            </div>

            {/* Gallery Preview Grid (New) */}
            {images && images.length > 0 && (
              <div className="rounded-3xl overflow-hidden shadow-2xl bg-white p-2">
                <div className="grid grid-cols-4 gap-2 h-64 md:h-80">
                  <div className="col-span-2 row-span-2 relative overflow-hidden rounded-2xl cursor-pointer group">
                    <img src={images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
                  {images.slice(1, 5).map((img, idx) => (
                    <div key={idx} className="relative overflow-hidden rounded-2xl cursor-pointer group">
                      <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* About Section */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                About the Spot
                <div className="h-1 w-12 bg-green-500 rounded-full" />
              </h2>
              <p className="text-gray-600 leading-relaxed text-xl font-light">
                {description || "No description available for this amazing spot."}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {tags?.map((tag, index) => (
                  <span key={index} className="px-4 py-2 bg-gray-100 hover:bg-green-50 text-gray-600 hover:text-green-700 text-sm rounded-xl font-semibold transition-colors cursor-default border border-transparent hover:border-green-200">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Divider */}
            <hr className="border-gray-100" />

            {/* Explored Foods Grid */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                Explored Foods
                <div className="h-1 w-12 bg-green-500 rounded-full" />
              </h2>

              {foodSpot.exploredFoods && foodSpot.exploredFoods.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {foodSpot.exploredFoods.map((food: any, idx) => (
                    <div key={idx} className="group bg-white border border-gray-100 rounded-3xl p-4 hover:shadow-xl transition-all duration-300 flex gap-5 items-center">
                      <div className="w-24 h-24 bg-gray-100 rounded-2xl flex-shrink-0 overflow-hidden shadow-inner relative">
                        {food.image ? (
                          <img src={food.image} alt={food.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                            <UtensilsCrossed className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-green-700 transition-colors">{food.name || "Food Item"}</h4>
                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{food.description || "A delicious culinary delight found at this spot."}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-3xl p-10 text-center">
                  <p className="text-gray-400 text-lg">No specific food items explored yet.</p>
                </div>
              )}
            </div>

            {/* Reviews */}
            <div className="pt-8">
              <ReviewSection reviewableId={foodSpot._id} reviewableType="FoodSpot" />
            </div>

          </div>

          {/* Right Column: Info & Map (Sticky Sidebar) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-24 space-y-8">

              {/* Map Card */}
              <div className="bg-white rounded-3xl shadow-xl p-3 border border-gray-100 overflow-hidden transform transition-all hover:shadow-2xl">
                <div className="h-64 w-full rounded-2xl overflow-hidden relative isolate">
                  {lng && lat && (
                    <Map
                      initialViewState={{
                        longitude: lng,
                        latitude: lat,
                        zoom: 14
                      }}
                      style={{ width: '100%', height: '100%' }}
                      mapStyle="mapbox://styles/mapbox/streets-v11"
                      tabIndex={0}
                      accessToken={mapboxgl.accessToken || ""}
                      scrollZoom={false}
                    >
                      <Marker longitude={lng} latitude={lat} color="#10B981" />
                      <NavigationControl position="bottom-right" />
                    </Map>
                  )}
                </div>
                <div className="p-4">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    <Navigation className="w-4 h-4" />
                    Get Directions
                  </a>
                </div>
              </div>

              {/* Info Card */}
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                  <h3 className="text-lg font-bold text-gray-800">Spot Information</h3>
                </div>
                <div className="p-6 space-y-6">

                  <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-green-50/50 transition-colors">
                    <div className="p-3 bg-green-100 rounded-xl text-green-600">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">OPENING HOURS</p>
                      <p className="font-semibold text-gray-900 text-lg">{openingHours?.open} - {openingHours?.close}</p>
                      <p className={`text-sm font-medium mt-1 ${isOpen ? "text-green-600" : "text-red-500"}`}>{isOpen ? "Creating memories now" : "Currently closed"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-blue-50/50 transition-colors">
                    <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">LOCATION</p>
                      <p className="font-medium text-gray-900 leading-snug">{address?.placeName}</p>
                      <p className="text-sm text-gray-500 mt-1">{address?.city}, {address?.state}</p>
                    </div>
                  </div>

                </div>

                {/* Curator */}
                <div className="p-6 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ring-4 ring-white">
                      {foodSpot.foodieId?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Curated by</p>
                      <p className="font-bold text-gray-900 text-lg">{foodSpot.foodieId?.name}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyFoodSpotDetailPage;