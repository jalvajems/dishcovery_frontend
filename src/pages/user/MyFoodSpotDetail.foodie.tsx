import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Heart, Share2, ChevronLeft, Star, Navigation, Plus } from 'lucide-react';
import Map, { Marker } from 'react-map-gl/mapbox';
import mapboxgl from 'mapbox-gl';
import { getFoodSpotDetailApi } from '@/api/foodieApi';
import 'mapbox-gl/dist/mapbox-gl.css';
import FoodieNavbar from '@/components/shared/foodie/Navbar.foodie';
import ReviewSection from '@/components/shared/ReviewPage';

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
        console.error("Failed to fetch food spot details:", error);
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
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Navigation Bar */}
      <FoodieNavbar />

      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] lg:h-[60vh] w-full ">
        {coverImage ? (
          <img
            src={coverImage}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
            <span className="text-lg">No Image Available</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {speciality?.map((spec, index) => (
                  <span key={index} className="px-3 py-1 bg-green-500/90 backdrop-blur text-white text-xs font-bold rounded-full uppercase tracking-wider">
                    {spec}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-lg tracking-tight">
                {name}
              </h1>
              <div className="flex items-center text-white/90 text-sm md:text-base space-x-4">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-green-400" />
                  {address?.city}, {address?.state}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {isOpen ? 'Open Now' : 'Closed'}
                </span>
              </div>
            </div>

         
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-6">
 <button 
          onClick={()=>navigate(`/foodie/foodspot-edit/${id}`)}
          className="flex items-center gap-2 px-7 mt-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow hover:scale-105 transition">
            <Plus className="w-5 h-5" />
            Edit Spot
          </button>
            {/* About Card */}
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About the Spot</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {description || "No description available."}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {tags?.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>


            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Explored Foods</h2>
              {foodSpot.exploredFoods && foodSpot.exploredFoods.length > 0 ? (
                <div className="space-y-4">
                  {foodSpot.exploredFoods.map((food: any, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-xl flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                        {food.image ? <img src={food.image} alt={food.name} className="w-full h-full object-cover" /> : <span className="flex items-center justify-center h-full text-xs text-center text-gray-400">No Img</span>}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{food.name || "Food Item"}</h4>
                        <p className="text-sm text-gray-500">{food.description || "Tasty delight explored here."}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No specific food items explored yet.</p>
              )}
            </div>

          </div>

          {/* Right Column: Info & Map */}
          <div className="lg:col-span-1 space-y-6">

            {/* Info Card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Information</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Opening Hours</p>
                    <p className="text-sm text-gray-600">{openingHours?.open} - {openingHours?.close}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Address</p>
                    <p className="text-sm text-gray-600">{address?.fullAddress}</p>
                  </div>
                </div>

                {/* Foodie Credit */}
                <div className="mt-6 pt-4 border-t flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {foodSpot.foodieId?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Curated by</p>
                    <p className="font-bold text-sm text-gray-900">{foodSpot.foodieId?.name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Card */}
            <div className="bg-white rounded-2xl shadow-md p-2 h-72 overflow-hidden relative">
              {/* Overlay if needed or make interactive */}
              {lng && lat && (
                <Map
                  initialViewState={{
                    longitude: lng,
                    latitude: lat,
                    zoom: 14
                  }}
                  style={{ width: '100%', height: '100%', borderRadius: '1rem' }}
                  mapStyle="mapbox://styles/mapbox/streets-v11"
                  accessToken={mapboxgl.accessToken}
                >
                  <Marker longitude={lng} latitude={lat} color="#10B981" />
                </Map>
              )}
            </div>

          </div>
        </div>
        <div className="space-y-6 mb-8 mt-8">

          <ReviewSection reviewableId={foodSpot._id} reviewableType="FoodSpot" />

        </div>
      </main>
    </div>
  );
};

export default MyFoodSpotDetailPage;