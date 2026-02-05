import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { showError } from '@/utils/toast';
import { getAllFoodSpotApi } from '@/api/foodieApi';
import Pagination from '@/components/shared/Pagination';
import SearchBar from '@/components/shared/SearchBar';

export default function FoodSpotListing() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1);
  const [spots, setSpots] = useState([])
  const limit = 4;

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  async function fetchFoodSpots() {
    try {
      const res = await getAllFoodSpotApi(currentPage, limit, searchQuery, filter);
      setTotalPages(res.data.totalCount)
      setSpots(res.data.data)
    } catch (error: any) {
      showError(error.response?.data?.message || `Something went wrong:${error}`)
    }
  }

  useEffect(() => {
    fetchFoodSpots();
  }, [searchQuery, limit, currentPage, filter]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Banner */}
        <div className="relative mb-12 rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=500&fit=crop"
            alt="Food spots"
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-8">
            <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-2xl">
              Discover Food Spots
            </h1>
            <p className="text-xl text-white/95 mb-8 max-w-2xl drop-shadow-lg">
              Find the best cafés, restaurants, and hidden gems loved by the community.
            </p>

            <SearchBar
              placeholder="Search spots by name or tag..."
              onSearch={(value) => {
                setSearchQuery(value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Food Spots Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-700 to-emerald-700 bg-clip-text text-transparent">
                Culinary Hotspots
              </h2>
              <p className="text-green-600 font-medium">Explore hand-picked food spots around you.</p>
            </div>
            <button
              onClick={() => navigate('/foodie/spot-listing/add')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-green-200 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Spot
            </button>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-4 mb-8">
            {['', 'Cafe', 'Restaurant', 'Bakery'].map((category) => (
              <button
                key={category}
                onClick={() => {
                  setFilter(category);
                  setCurrentPage(1);
                }}
                className={`px-6 py-2 rounded-xl font-bold transition-all ${filter === category
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-green-50'
                  }`}
              >
                {category || 'All'}
              </button>
            ))}
          </div>

          {/* Spot Cards */}
          <div className="space-y-8">
            {spots.map((spot: any) => (
              <div
                key={spot._id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
              >
                <div className="flex gap-6 items-center">
                  <div className="flex-1">
                    {spot.tags && (
                      <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-lg font-semibold text-sm mb-3">
                        {spot.tags}
                      </span>
                    )}
                    <h3 className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
                      {spot.name}
                    </h3>
                    <p className="text-gray-600 mb-5 line-clamp-2">
                      {spot.description}
                    </p>

                    <button
                      onClick={() => navigate(`/foodie/foodspot/${spot._id}`)}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-green-100 hover:text-green-700 hover:scale-105 transition-all"
                    >
                      View Details
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="w-72 h-56 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                    <img
                      src={spot.coverImage}
                      alt={spot.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
