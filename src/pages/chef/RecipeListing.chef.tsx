import { useEffect, useState } from 'react';
import { Star, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import Pagination from '@/components/shared/Pagination';
import { getAllRecipeApi, getRecipeDetailApi } from '@/api/chefApi';
import { useAuthStore } from '@/store/authStore';
import { showError } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';

export default function RecipeListing() {

  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Cards');
  const [recipes, setRecipes] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
  const user = useAuthStore().user?._id
  useEffect(() => {
    fetchRecipes()
  }, [])
  async function fetchRecipes() {
    try {
      if (!user) {
        showError("User ID missing");
        return;
      }
      const res = await getAllRecipeApi(user);
      setRecipes(res.data.data)

      console.log(res.data.data)
    } catch (error: any) {
      const message = error.response?.data?.message
      showError(message)
    }

  }
  async function handleViewButton(id:string) {
    try {
      navigate(`/recipe-detail/${id}`)
    } catch (error) {
      console.error(error)
    }
  }
  async function handleAddRecipe(){
    navigate('/recipe-add')
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-50 via-green-50 to-blue-50">

      {/* Hero Banner */}
      <div className="relative mb-8 rounded-3xl overflow-hidden shadow-2xl group">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop"
          alt="My Recipe Banner"
          className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-8 left-10">
          <h1 className="text-5xl font-bold text-white drop-shadow-2xl">
            My Recipe
          </h1>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
          My Recipes
        </h2>
        <button onClick={()=>handleAddRecipe()}  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all shadow-lg flex items-center gap-2">
          
          <Plus className="w-5 h-5" />
          Add Recipe
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('Cards')}
          className={`px-6 py-3 font-semibold transition-all ${activeTab === 'Cards'
            ? 'text-green-600 border-b-2 border-green-600'
            : 'text-gray-600 hover:text-green-600'
            }`}
        >
          Cards
        </button>
        <button
          onClick={() => setActiveTab('List')}
          className={`px-6 py-3 font-semibold transition-all ${activeTab === 'List'
            ? 'text-green-600 border-b-2 border-green-600'
            : 'text-gray-600 hover:text-green-600'
            }`}
        >
          List
        </button>
      </div>

      {/* Recipe Cards */}
      <div className="space-y-6 mb-8">
        {recipes.map((recipe) => (
          <div
            key={recipe.title}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
          >
            <div className="flex gap-6">
              <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                <img
                  src={recipe.image}
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
                    onClick={() => handleViewButton(recipe._id)}
                    className="mt-4 px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all"
                  >
                    View Recipe
                  </button>

                </div>
              </div>
            </div>
          </div>
        ))}
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
