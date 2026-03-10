import { useEffect, useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Clock, Flame, Droplet, ChefHat, Users, Tag } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getRecipeDetailFoodieApi, getRelatedRecipesApi } from '@/api/foodieApi';
import { showError } from '@/utils/toast';
import ReviewSection from '@/components/shared/ReviewPage';

export default function RecipeDetailFoodie() {
    const {id}=useParams()
    console.log('id indetail',id);
    
  const [likedReviews, setLikedReviews] = useState<{ [key: number]: boolean }>({});
  const [dislikedReviews, setDislikedReviews] = useState<{ [key: number]: boolean }>({});
  const[recipe, setRecipe]= useState<any>(null);
  const[relatedRecipes,setRelatedRecipes]=useState<any[]>([])


  useEffect(()=>{
      async function fetchRecipe() {
            try {
              if (!id) return;
              console.log('1');
              
              const res = await getRecipeDetailFoodieApi(id);
              console.log('2');
              setRecipe(res.data.data);
              console.log('recipe',res.data.data);
              
            } catch (error: any) {
              showError(error.response?.data?.message || "Failed to load recipe");
            }
          }
          fetchRecipe()
  },[id])

  
  useEffect(() => {
  if (!recipe?.cuisine) return;

  async function fetchRelatedRecipes() {
    try {
      console.log('Fetching related recipes for:', recipe.cuisine);
      const result = await getRelatedRecipesApi(recipe.cuisine);
      console.log("RELATED RESULT:", result.data.relatedData);
      setRelatedRecipes(result.data.relatedData || []);
    } catch (error) {
      console.error("Error fetching related recipes:", error);
    }
  }

  fetchRelatedRecipes();
}, [recipe]);



  if (!recipe) {
    return (
      <div className="p-10 text-center text-xl font-bold text-green-700">
        Loading recipe...
      </div>
    );
  }
  console.log('recichef',recipe.chefId.name);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="col-span-2 space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-gray-900 via-green-700 to-emerald-700 bg-clip-text text-transparent">
                {recipe.title}
              </h1>
              <p className="text-green-600 font-semibold">Recipe by {recipe.chefId.name}</p>
            </div>

            {/* Main Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={recipe.image} 
                alt={recipe.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>


            {/* Tags and Save Button */}
            <div className="flex items-center gap-4">
              
              <button className="ml-auto px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all shadow-lg">
                Save
              </button>
            </div>
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-10 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6">Recipe Details</h2>

          <div className="grid grid-cols-2 gap-6">
            <DetailItem icon={<ChefHat />} label="Cuisine" value={recipe.cuisine} />
            <DetailItem icon={<Clock />} label="Cooking Time" value={`${recipe.cookingTime} min`} />
            <DetailItem icon={<Users />} label="diet type" value={recipe.dietType?.join(",")} />
            <DetailItem icon={<Tag />} label="Tags" value={recipe.tags?.join(", ")} />
          </div>
        </div>

            {/* Ingredients */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Ingredients</h2>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient:string, index:number) => (
                  <li key={index} className="flex items-start gap-3 text-gray-700 text-lg">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Instructions</h2>
              <div className="space-y-6">
                {recipe.steps.map((instruction:any) => (
                  <div key={instruction.step} className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                        {/* <span className="text-white font-bold text-lg">{recipe.steps}</span> */}
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{instruction}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
      <ReviewSection reviewableId={id} reviewableType="Recipe" />

            {/* Related Recipes */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Related Recipes</h2>
              <div className="grid grid-cols-3 gap-6">
                {relatedRecipes.map((related:any) => (
                  <div key={related.id} className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
                    <div className="h-56 overflow-hidden">
                      <img 
                        src={related.image} 
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-green-700 transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{related.dietType}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
function DetailItem({ icon, label, value }: any) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200">
      <span className="text-green-600 font-semibold flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span className="font-bold text-gray-900">{value}</span>
    </div>
  );
}
