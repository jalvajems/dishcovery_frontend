import { useEffect, useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import Pagination from '@/components/shared/Pagination';
import { getAllRecipeApi } from '@/api/chefApi';
import { showError } from '@/utils/toast';
import { getErrorMessage, logError } from '@/utils/errorHandler';
import { useNavigate } from 'react-router-dom';
import SearchBar from '@/components/shared/SearchBar';
import { useUserStore } from '@/store/userStore';

import type { IRecipe } from "@/types/recipe.types";

export default function RecipeListing() {

  const navigate = useNavigate()
  const [recipes, setRecipes] = useState<IRecipe[]>([])
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;
  const [searchQuery, setSearchQuery] = useState("")
  const { isVerifiedUser } = useUserStore()


  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    fetchRecipes()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit, searchQuery])

  async function fetchRecipes() {
    try {

      const res = await getAllRecipeApi(currentPage, limit, searchQuery);
      setRecipes(res.data.data as IRecipe[])

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
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-slate-50 via-green-50 to-blue-50">

      {/* Hero Banner */}
      <div className="relative mb-8 md:mb-12 rounded-3xl overflow-hidden shadow-2xl">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop"
          alt="Food dishes"
          className="w-full h-64 md:h-96 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 md:px-8">
          <h1 className="text-3xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
            My Recipes
          </h1>
          <p className="text-sm md:text-xl text-white/95 mb-6 md:mb-8 max-w-2xl drop-shadow-lg line-clamp-2 md:line-clamp-none">
            Explore a curated list of food spots, from hidden gems to popular favorites. Find your next culinary adventure.
          </p>

          <div className="w-full max-w-2xl px-4 md:px-0">
            <SearchBar
              placeholder="Search recipes, cuisine..."
              onSearch={handleSearch}
            />
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
          My Recipes
        </h2>
        <button 
          disabled={!isVerifiedUser} 
          onClick={() => handleAddRecipe()} 
          className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-[1.02] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
          Add Recipe
        </button>
      </div>

      {/* Recipe Cards */}
      <div className="space-y-6 mb-8">
        {recipes.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 md:p-20 text-center shadow-xl border border-gray-100">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Plus className="w-8 h-8 md:w-10 md:h-10 text-green-500" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">No Recipes Yet</h2>
            <p className="text-sm md:text-base text-gray-500 mb-8 max-w-md mx-auto">
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
          recipes.map((recipe: IRecipe) => (
            <div
              key={recipe._id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                  <img
                    src={recipe.images[0]}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors line-clamp-2">
                      {recipe.title}
                    </h3>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm md:text-base">
                        <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase text-xs tracking-wider">{recipe.cuisine}</span>
                        <span className="text-gray-600">· {recipe.cookingTime} min</span>
                      </div>
                    </div>
                    <button
                      disabled={!isVerifiedUser}
                      onClick={() => handleViewButton(recipe._id)}
                      className="w-full md:w-auto px-6 py-2 bg-gray-50 text-gray-700 border border-gray-100 rounded-xl font-semibold hover:bg-green-600 hover:text-white hover:border-green-600 hover:shadow-lg transition-all"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
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
  );
}
