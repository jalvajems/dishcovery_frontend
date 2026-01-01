import { useEffect, useState } from 'react';
import {
  Search,
  ChevronDown,
  ArrowRight,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { showError } from '@/utils/toast';
import { getAllFoodSpotApi, getAllMyFoodSpotApi } from '@/api/foodieApi';
import Pagination from '@/components/shared/Pagination';
import SearchBar from '@/components/shared/SearchBar';

export default function MyFoodSpotList() {
  const navigate=useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
      const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);
    const limit = 1;
  const [foodSpots , setFoodSpots]=useState([])

    const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleFetchSpots=async()=>{
    try {
      const res=await getAllMyFoodSpotApi(currentPage,limit,searchQuery);
      console.log('res----',res.data);
      setTotalPages(res.data.totalCount)
      setFoodSpots(res.data.data)
    } catch (error:any) {
      showError(error.response?.data?.message || `Something went wrong:${error}`)
    }
  }

  useEffect(()=>{
    handleFetchSpots()
  },[currentPage,searchQuery, limit])




  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 p-8">
      <div className="max-w-6xl mx-auto">

        {/* HERO BANNER */}
        <div className="relative mb-12 rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&h=500&fit=crop"
            alt="Food Spots"
            className="w-full h-96 object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-8">
            <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-2xl">
              My Food Spots
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mb-8">
              Find cafés, restaurants, and hidden gems loved by foodies
            </p>

            {/* Search inside banner */}
            <div className="relative w-full max-w-2xl">
              <SearchBar
                        placeholder="Search recipes, cuisine..."
                        onSearch={(value)=>{
                            setSearchQuery(value);
                            setCurrentPage(1)
                        }}
                        />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* FILTERS + ADD */}
        <div className="flex justify-between items-center mb-10">
          {/* <div className="flex gap-3">
            {['Cuisine', 'Rating', 'Distance', 'Popularity'].map((f) => (
              <button
                key={f}
                className="flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur rounded-xl shadow border hover:bg-green-50"
              >
                {f} <ChevronDown className="w-4 h-4" />
              </button>
            ))}
          </div> */}

          <button 
          onClick={()=>navigate('/foodie/foodspot-add')}
          className="flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow hover:scale-105 transition">
            <Plus className="w-5 h-5" />
            Add Spot
          </button>
        </div>

        {/* FOOD SPOT CARDS */}
        <div className="space-y-8">
          {foodSpots.map((spot:any) => (
            <div
              key={spot._id}
              className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl hover:shadow-2xl transition group"
            >
              <div className="flex gap-6 items-center">
                <div className="flex-1">
                  {spot.badge && (
                    <span className="inline-block mb-3 px-4 py-1.5 bg-green-100 text-green-700 rounded-lg font-semibold text-sm">
                      {spot.badge}
                    </span>
                  )}
                  <h3 className="text-3xl font-bold mb-3 group-hover:text-green-700 transition">
                    {spot.name}
                  </h3>
                  <p className="text-gray-600 mb-5 text-lg leading-relaxed">
                    {spot.description}
                  </p>
                  <button onClick={()=>navigate(`/foodie/myfoodspot/${spot._id}`)} className="flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-xl font-semibold hover:bg-green-100 hover:text-green-700 transition">
                    View Details
                    <ArrowRight />
                  </button>
                </div>

                <div className="w-72 h-56 rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={spot.coverImage}
                    alt={spot.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={handlePageChange}
        
        />

      </div>
    </div>
  );
}
