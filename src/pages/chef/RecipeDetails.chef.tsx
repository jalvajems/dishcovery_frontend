import { useEffect, useState } from "react";
import { Clock, Users, Tag, ChefHat, Edit2, Trash2, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteRecipeApi, getRecipeDetailApi } from "@/api/chefApi";
import { showError } from "@/utils/toast";
import { getErrorMessage, logError } from "@/utils/errorHandler";

import ChefReviewSection from "@/components/shared/ChefReviewSection";
import ChefNavbar from "@/components/shared/chef/NavBar.chef";
import { useUserStore } from "@/store/userStore";

import type { IRecipe } from "@/types/recipe.types";

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate()

  const [recipe, setRecipe] = useState<IRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const { isVerifiedUser } = useUserStore()

  if (!id) throw Error('no recipe found')


  useEffect(() => {

    async function fetchRecipe() {
      try {
        if (!id) return;
        const res = await getRecipeDetailApi(id);
        setRecipe(res.data.data as IRecipe);
      } catch (error: unknown) {
        logError(error);
        showError(getErrorMessage(error, "Failed to load recipe"));
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [id]);
  console.log('recipe', recipe);

  console.log("asdfasdfa", recipe?.images[0])


  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading recipe...
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-red-600">
        Recipe not found
      </div>
    );
  }
  const handleEditButton = async () => {
    navigate(`/recipe-edit/${id}`, { state: { recipeId: id } })
  }
  const handleDelete = async (id: string) => {
    await deleteRecipeApi(id)
    navigate('/recipes-listing')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      <ChefNavbar />
      <main className="max-w-6xl mx-auto px-8 py-12">
        {/* MAIN CONTENT */}
        <div className="flex items-center gap-2 text-sm mb-8">
          <a href="/chef/recipes-listing" className="text-green-600 font-semibold hover:underline">Recipe Lists</a>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <a href="/chef/" className="text-green-600 font-semibold hover:underline">{recipe?.title}</a>
        </div>

        {/* TITLE SECTION */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-green-700 to-emerald-700 bg-clip-text text-transparent">
            {recipe.title}
          </h1>
          <div className="flex items-center gap-4 text-gray-700">
            <span className="text-green-600 font-semibold">By: {recipe?.chefId?.name} </span>
          </div>
        </div>

        {/* HERO IMAGE */}
        <div className="relative mb-10 rounded-3xl overflow-hidden shadow-2xl">
          <img src={recipe.images[0]} alt={recipe.title} className="w-full h-96 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20"></div>
        </div>

        {/* DETAILS CARD */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-10 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6">Recipe Details</h2>

          <div className="grid grid-cols-2 gap-6">
            <DetailItem icon={<ChefHat />} label="Cuisine" value={recipe.cuisine} />
            <DetailItem icon={<Clock />} label="Cooking Time" value={`${recipe.cookingTime} min`} />
            <DetailItem icon={<Users />} label="diet type" value={recipe.dietType?.join(",")} />
            <DetailItem icon={<Tag />} label="Tags" value={recipe.tags?.join(", ")} />
          </div>
        </div>

        {/* INGREDIENTS */}
        <div className="bg-white/90 rounded-2xl shadow-xl p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6">Ingredients</h2>
          <ul className="space-y-3">
            {recipe.ingredients?.map((item: string, index: number) => (
              <li key={index} className="flex items-start gap-3 text-gray-700">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                <span className="text-lg">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* INSTRUCTIONS */}
        <div className="bg-white/90 rounded-2xl shadow-xl p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6">Steps</h2>
          <div className="space-y-6">
            {recipe.steps?.map((step: string, i: number) => (
              <div key={i} className="flex gap-6">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {i + 1}
                </div>
                <div>
                  <p className="text-gray-700 leading-relaxed">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4">
          <button disabled={!isVerifiedUser} onClick={() => handleEditButton()} className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:scale-105 transition">
            <Edit2 className="w-5 h-5" />
            Edit
          </button>
          <button disabled={!isVerifiedUser} onClick={() => handleDelete(id)} className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:scale-105 transition">
            <Trash2 className="w-5 h-5" />
            Delete
          </button>
        </div>

        <ChefReviewSection reviewableId={id} reviewableType="Recipe" />
      </main>
    </div>
  );

}

/* Small reusable detail item */
/* Small reusable detail item */
interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number | undefined;
}

function DetailItem({ icon, label, value }: DetailItemProps) {
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
