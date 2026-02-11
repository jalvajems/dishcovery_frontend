import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Pagination from '@/components/shared/Pagination';
import { getAllRecipeApi } from '@/api/chefApi';
import { showError } from '@/utils/toast';
import { getErrorMessage, logError } from '@/utils/errorHandler';
import { useNavigate } from 'react-router-dom';
import SearchBar from '@/components/shared/SearchBar';
import { useUserStore } from '@/store/userStore';

export default function RecipeListing() {

  const navigate = useNavigate()
  const [recipes, setRecipes] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;
  const [searchQuery, setSearchQuery] = useState("")
  const { isVerifiedUser } = useUserStore()


  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }



  useEffect(() => {
    fetchRecipes()
  }, [currentPage, limit, searchQuery])

  async function fetchRecipes() {
    try {

      const res = await getAllRecipeApi(currentPage, limit, searchQuery);
      setRecipes(res.data.data)

      setTotalPages(res.data.totalPages)
      console.log(res.data.data)

    } catch (error: unknown) {
      logError(error);
      showError(getErrorMessage(error));
    }

  }
  async function handleViewButton(id: string) {
    try {
      navigate(`/recipe-detail/${id}`)
    } catch (error) {
      console.error(error)
    }
  }
  async function handleAddRecipe() {

    navigate('/recipe-add')
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-50 via-green-50 to-blue-50">

      {/* Hero Banner */}
      <div className="relative mb-12 rounded-3xl overflow-hidden shadow-2xl">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop"
          alt="Food dishes"
          className="w-full h-96 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-8">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-2xl">
            My Recipes
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

      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
          My Recipes
        </h2>
        <button disabled={!isVerifiedUser} onClick={() => handleAddRecipe()} className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all shadow-lg flex items-center gap-2">

          <Plus className="w-5 h-5" />
          Add Recipe
        </button>
      </div>



      {/* Recipe Cards */}
      <div className="space-y-6 mb-8">
        {recipes.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-20 text-center shadow-xl border border-gray-100">
            <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Plus className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Recipes Yet</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Share your culinary masterpieces with the world! Start by adding your first recipe.
            </p>
            <button
              disabled={!isVerifiedUser}
              onClick={() => handleAddRecipe()}
              className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg hover:shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Your First Recipe
            </button>
          </div>
        ) : (
          recipes.map((recipe: any) => (
            <div
              key={recipe.title}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
            >
              <div className="flex gap-6">
                <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                  <img
                    src={recipe.images}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
                      {recipe.title}
                    </h3>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{recipe.cuisine}</span>
                        <span className="text-gray-600">· {recipe.cookingTime} Cooking time</span>
                      </div>
                    </div>
                    <button
                      disabled={!isVerifiedUser}
                      onClick={() => handleViewButton(recipe._id)}
                      className="mt-4 px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all"
                    >
                      View Recipe
                    </button>

                  </div>
                </div>
              </div>
            </div>
          ))
        )}
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
  );
}
