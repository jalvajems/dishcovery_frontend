import { useEffect, useState, useCallback } from 'react';
import {
  ArrowRight, MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { showError } from '@/utils/toast';
import { getAllFoodSpotApi } from '@/api/foodieApi';
import Pagination from '@/components/shared/Pagination';
import SearchBar from '@/components/shared/SearchBar';
import { getErrorMessage } from '@/utils/errorHandler';
import { expandImageUrl } from '@/utils/imageUrl';

import type { IFoodSpot } from '@/types/foodSpot.types';

export default function FoodSpotListing() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1);
  const [spots, setSpots] = useState<IFoodSpot[]>([])
  const [sortBy, setSortBy] = useState<string>('')
  const limit = 4;

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  async function fetchFoodSpots() {
    try {
      const res = await getAllFoodSpotApi(currentPage, limit, searchQuery, filter, sortBy);
      const computedTotalPages = Math.ceil(res.data.totalCount / limit);
      setTotalPages(computedTotalPages || 1);
      setSpots(res.data.data)
    } catch (error: unknown) {
      showError(getErrorMessage(error));
    }
  }

  useEffect(() => {
    fetchFoodSpots();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, limit, currentPage, filter, sortBy]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Banner */}
        <div className="relative mb-8 md:mb-12 rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=500&fit=crop"
            alt="Food spots"
            className="w-full h-64 md:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 md:px-8">
            <h1 className="text-3xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
              Discover Food Spots
            </h1>
            <p className="text-sm md:text-xl text-white/95 mb-6 md:mb-8 max-w-2xl drop-shadow-lg line-clamp-2 md:line-clamp-none">
              Find the best cafés, restaurants, and hidden gems loved by the community.
            </p>

            <div className="w-full max-w-2xl px-4 md:px-0">
              <SearchBar
                placeholder="Search spots by name or tag..."
                onSearch={handleSearch}
              />
            </div>
          </div>
        </div>

        {/* Food Spots Section */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-700 to-emerald-700 bg-clip-text text-transparent">
                Culinary Hotspots
              </h2>
              <p className="text-sm md:text-base text-green-600 font-medium">Explore hand-picked food spots around you.</p>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 md:gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex gap-2 mr-2 md:mr-4 md:border-r md:pr-4 border-gray-200">
               <button
                  onClick={() => {
                    setSortBy(sortBy === 'distance' ? '' : 'distance');
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-2 px-4 md:px-6 py-2 rounded-xl font-bold transition-all text-xs md:text-sm whitespace-nowrap ${sortBy === 'distance'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-white text-emerald-700 border border-emerald-100 hover:bg-emerald-50'
                    }`}
                >
                  <MapPin size={16} className="md:w-[18px] md:h-[18px]" />
                  {sortBy === 'distance' ? 'Near Me' : 'Sort by Near Me'}
                </button>
            </div>

            {['', 'Cafe', 'Restaurant', 'Bakery'].map((category) => (
              <button
                key={category}
                onClick={() => {
                  setFilter(category);
                  setCurrentPage(1);
                }}
                className={`px-4 md:px-6 py-2 rounded-xl font-bold transition-all text-xs md:text-sm whitespace-nowrap ${filter === category
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-green-50 border border-transparent hover:border-green-100'
                  }`}
              >
                {category || 'All'}
              </button>
            ))}
          </div>

          {/* Spot Cards */}
          <div className="space-y-6 md:space-y-8">
            {spots.map((spot) => (
              <div
                key={spot._id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
              >
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center">
                  <div className="w-full md:w-72 h-48 md:h-56 rounded-2xl overflow-hidden shadow-lg flex-shrink-0 order-1 md:order-2">
                    <img
                      src={expandImageUrl(spot.coverImage)}
                      alt={spot.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 order-2 md:order-1 w-full">
                    {spot.tags && (
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-lg font-semibold text-xs mb-3 uppercase tracking-wider">
                        {spot.tags}
                      </span>
                    )}
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors line-clamp-1">
                      {spot.name}
                    </h3>

                    <button
                      onClick={() => navigate(`/foodie/foodspot/${spot._id}`)}
                      className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 text-gray-700 font-semibold rounded-xl hover:bg-green-100 hover:text-green-700 hover:scale-[1.02] transition-all border border-gray-100 hover:border-green-200"
                    >
                      View Details
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
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
