import { useEffect, useState } from 'react';
import { Star, Clock, ChefHat, Users, Heart, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { getRecipeDetailFoodieApi, getRelatedRecipesApi } from '@/api/foodieApi';
import { showError } from '@/utils/toast';
import ReviewSection from '@/components/shared/ReviewPage';
import API from '@/api/apiInstance';
import FoodieNavbar from '@/components/shared/foodie/Navbar.foodie';

export default function RecipeDetailFoodie() {
  const { id } = useParams();
  const [isSaved, setIsSaved] = useState(false);
  const [recipe, setRecipe] = useState<any>(null);
  const [relatedRecipes, setRelatedRecipes] = useState<any[]>([]);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        if (!id) return;
        const res = await getRecipeDetailFoodieApi(id);
        setRecipe(res.data.data);
        setIsSaved(res.data.isSaved);
      } catch (error: any) {
        showError(error.response?.data?.message || "Failed to load recipe");
      }
    }
    fetchRecipe();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!recipe?.cuisine) return;
    async function fetchRelatedRecipes() {
      try {
        const result = await getRelatedRecipesApi(recipe.cuisine);
        const related = result.data.relatedData?.filter((r: any) => r._id !== recipe._id) || [];
        setRelatedRecipes(related.slice(0, 3));
      } catch (error) {
        console.error("Error fetching related recipes:", error);
      }
    }
    fetchRelatedRecipes();
  }, [recipe]);

  const handleToggleSave = async () => {
    try {
      const res = await API.post("/foodie/toggle-save-recipe", { recipeId: recipe?._id });
      setIsSaved(res.data.isSaved);
    } catch (err) {
      console.error(err);
    }
  };

  if (!recipe) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-xl font-bold text-emerald-600 animate-pulse">Loading amazing flavors...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <FoodieNavbar />

      {/* Hero Header */}
      <div className="relative h-[500px] w-full bg-gray-900 group">
        <img
          src={recipe.images}
          alt={recipe.title}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-50 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-90"></div>

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-4 mb-4 text-emerald-300 font-medium">
            <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full backdrop-blur-md flex items-center gap-2">
              <ChefHat size={16} /> {recipe.cuisine}
            </span>
            <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full backdrop-blur-md flex items-center gap-2">
              <Clock size={16} /> {recipe.cookingTime} min
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            {recipe.title}
          </h1>

          <div className="flex items-center gap-6 text-gray-300">
            <span className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                {recipe.chefId.name.charAt(0)}
              </div>
              by <span className="text-white hover:text-emerald-400 cursor-pointer underline-offset-4 hover:underline transition-colors">{recipe.chefId.name}</span>
            </span>
            <span className="hidden md:inline-block">•</span>
            <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Main Content (Left) */}
          <div className="lg:col-span-8 space-y-12">

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <StatBox icon={Clock} label="Time" value={`${recipe.cookingTime} m`} />
              <StatBox icon={ChefHat} label="Difficulty" value={recipe.difficulty || "Medium"} />
              <StatBox icon={Users} label="Servings" value={recipe.servings || "2-4"} />
              <StatBox icon={Star} label="Rating" value="4.8/5" color="text-yellow-500" />
            </div>

            {/* Description */}
            <div className="prose max-w-none text-gray-600 text-lg leading-relaxed">
              <p>{recipe.description || "Experience the burst of flavors with this amazing recipe crafted with passion. Perfect for any occasion and guaranteed to impress your guests."}</p>
            </div>

            {/* Ingredients Section */}
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-gray-900 border-b pb-4">
                <span className="text-emerald-600">🌿</span> Ingredients
              </h2>
              <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-emerald-500">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {recipe.ingredients.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-700 bg-emerald-50/50 p-3 rounded-lg hover:bg-emerald-100/50 transition-colors">
                      <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Instructions Section */}
            <div>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-900 border-b pb-4">
                <span className="text-emerald-600"></span> Instructions
              </h2>
              <div className="space-y-8">
                {recipe.steps.map((step: string, idx: number) => (
                  <div key={idx} className="relative pl-10 group">
                    {/* Connecting Line */}
                    {idx !== recipe.steps.length - 1 && (
                      <div className="absolute left-[19px] top-10 w-0.5 h-full bg-gray-200 group-hover:bg-emerald-200 transition-colors"></div>
                    )}

                    {/* Number Badge */}
                    <div className="absolute left-0 top-0 w-10 h-10 bg-emerald-100 text-emerald-700 font-bold rounded-full flex items-center justify-center border-2 border-white shadow-md group-hover:bg-emerald-500 group-hover:text-white transition-all transform group-hover:scale-110 z-10">
                      {idx + 1}
                    </div>

                    {/* Step Content */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-gray-700 text-lg leading-relaxed">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="pt-10">
              <ReviewSection reviewableId={id} reviewableType="Recipe" />
            </div>

          </div>

          {/* Sidebar (Right) */}
          <div className="lg:col-span-4 space-y-8">

            {/* Actions Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold mb-6">Actions</h3>
              <button
                onClick={handleToggleSave}
                className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all transform hover:scale-[1.02] ${isSaved ? 'bg-emerald-100 text-emerald-700' : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:shadow-emerald-500/30'}`}
              >
                <Heart size={20} className={isSaved ? "fill-emerald-700" : ""} />
                {isSaved ? "Saved to Cookbook" : "Save Recipe"}
              </button>
              <div className='my-6 border-b border-gray-100'></div>

              <h4 className="font-semibold text-gray-900 mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {recipe.tags?.map((tag: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-emerald-50 hover:text-emerald-600 transition-colors cursor-pointer">
                    #{tag}
                  </span>
                ))}
                {recipe.dietType?.map((dt: string, idx: number) => (
                  <span key={`dt-${idx}`} className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
                    {dt}
                  </span>
                ))}
              </div>
            </div>

            {/* Related Recipes */}
            {relatedRecipes.length > 0 && (
              <div className='space-y-4'>
                <h3 className="text-xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-3">More Like This</h3>
                {relatedRecipes.map((r) => (
                  <Link to={`/foodie/recipe/${r._id}`} key={r._id} className="block group">
                    <div className="flex gap-4 bg-white p-3 rounded-xl shadow-sm border border-transparent hover:border-emerald-200 transition-all hover:bg-emerald-50/30">
                      <img src={r.images} alt={r.title} className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />
                      <div className='flex flex-col justify-center gap-1'>
                        <h4 className="font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-emerald-700 transition-colors">
                          {r.title}
                        </h4>
                        <div className='flex items-center gap-2 text-xs text-gray-500'>
                          <Clock size={12} /> {r.cookingTime} min
                        </div>
                        <div className='flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-1'>
                          <span className="hover:underline">View Recipe</span> <ArrowRight size={12} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

function StatBox({ icon: Icon, label, value, color = "text-emerald-600" }: any) {
  return (
    <div className="flex flex-col items-center justify-center p-3 text-center">
      <Icon className={`w-6 h-6 mb-2 ${color}`} />
      <span className="text-sm text-gray-500 font-medium">{label}</span>
      <span className="text-lg font-bold text-gray-800">{value}</span>
    </div>
  )
}
