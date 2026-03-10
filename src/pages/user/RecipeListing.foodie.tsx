import { useEffect, useState } from 'react';
import { Search, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllRecipesFoodieApi } from '@/api/foodieApi';
import { useNavigate } from 'react-router-dom';
import Pagination from '@/components/shared/Pagination';
import SearchBar from '@/components/shared/SearchBar';

export default function RecipeListing() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5
  const [recipes, setRecipes] = useState([]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }


  useEffect(() => {
    fetchRecipes()
  }, [currentPage, limit, searchQuery])
  async function fetchRecipes() {
    console.log('reach');

    const result = await getAllRecipesFoodieApi(currentPage, limit, searchQuery)

    setRecipes(result.data.datas)
    setTotalPages(result.data.total)


  }
  const handleViewButton = async (id: any) => {
    console.log('id is', id);

    navigate(`/foodie/recipe-detail/${id}`)
  }




  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Banner */}
        <div className="relative mb-12 rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=500&fit=crop"
            alt="Food dishes"
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-8">
            <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-2xl">
              Explore new Recipes
            </h1>
            <p className="text-xl text-white/95 mb-8 max-w-2xl drop-shadow-lg">
              Explore a curated list of food spots, from hidden gems to popular favorites. Find your next culinary adventure.
            </p>

            {/* Search Bar */}
            <SearchBar
              placeholder="Search recipes, cuisine..."
              onSearch={(value) => {
                setSearchQuery(value);
                setCurrentPage(1); // reset to page 1 for search
              }}
            />

          </div>
        </div>


        {/* Recipes Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-gray-900 via-green-700 to-emerald-700 bg-clip-text text-transparent">
            Recipes
          </h2>
          <p className="text-green-600 font-medium mb-8">
            Discover stories, tips, and culinary adventures.
          </p>

          {/* Recipe Cards */}
          <div className="space-y-8">
            {recipes.map((recipe: any) => (
              <div
                key={recipe.id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
              >
                <div className="flex gap-6 items-center">
                  <div className="flex-1">
                    {recipe.tags && (
                      <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-lg font-semibold text-sm mb-3">
                        {recipe.tags}
                      </span>
                    )}
                    <h3 className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
                      {recipe.title}
                    </h3>

                    <button onClick={() => { handleViewButton(recipe._id) }} className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-green-100 hover:text-green-700 hover:scale-105 transition-all">
                      View Details
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="w-72 h-56 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
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