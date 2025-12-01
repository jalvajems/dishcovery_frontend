import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Star, Mail, Wallet, Plus, ChevronRight } from "lucide-react";
import {
  getAllRecipeApi,
  getChefProfileApi,
  getMyBlogsChefApi
} from "@/api/chefApi";
import { showError } from "@/utils/toast";
import { useAuthStore } from "@/store/authStore";
import Pagination from "@/components/shared/Pagination";

export default function ChefProfilePage() {
  const id=useAuthStore.getState().user?._id
  const navigate=useNavigate()
  const [chef, setChef] = useState<any>(null);
  const [recipes, setRecipes] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const limit=4
    const [currentPageRecipe, setCurrentPageRecipe] = useState(1);
  const [totalPagesRecipe,setTotalPagesRecipe ]=useState(1);
    const [currentPageBlog, setCurrentPageBlog] = useState(1);
  const [totalPagesBlog,setTotalPagesBlog ]=useState(1);

  const handlePageChangeRecipe=(page:number)=>{
    setCurrentPageRecipe(page)
  }
  const handlePageChangeBlog=(page:number)=>{
    setCurrentPageBlog(page)
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const chefRes = await getChefProfileApi()
        const recipeRes=await  getAllRecipeApi(id,currentPageRecipe,limit);
        const blogRes= await  getMyBlogsChefApi(currentPageBlog,limit)
        

        setChef(chefRes.data.datas);
        setRecipes(recipeRes.data.data||[]);
              console.log('recpe',chefRes.data.data);

        setBlogs(blogRes.data.datas||[]);
setTotalPagesRecipe(recipeRes.data.totalCount)
setTotalPagesBlog(blogRes.data.totalCount)
      } catch (error: any) {
        showError(error?.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id,currentPageBlog,currentPageRecipe]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-semibold">
        Loading profile...
      </div>
    );

  if (!chef)
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-semibold">
        Profile not found!
      </div>
    );
    const handleEditButton=()=>{
      navigate('/chef/profile-edit')
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">

      {/* NAVBAR — unchanged */}

      <main className="max-w-6xl mx-auto px-8 py-12">

        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-sm mb-8">
          <a href="/chef/dashboard" className="text-green-600 font-semibold hover:underline">Home</a>
          <ChevronRight className="w-4 h-4 text-gray-400" />
         
          <span className="text-gray-800 font-medium">{chef.chefId.name}</span>
        </div>

        {/* CHEF HEADER */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border p-10 mb-12">
          <div className="flex gap-8 items-start">
            <div className="w-40 h-40 rounded-full overflow-hidden shadow-xl ring-8 ring-green-100">
              <img src={chef.image || "/default-avatar.png"} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-700 to-emerald-700 bg-clip-text text-transparent">
                {chef.chefId.name}
              </h1>

              <p className="text-green-600 font-semibold text-lg mb-3">
                Specialty: {chef.specialties || "Not added"}
              </p>

              <div className="flex items-center gap-6 mb-4">
              
                <span className="text-green-600 font-semibold">{chef.followers || 0} followers</span>
                    <button
                    onClick={() => handleEditButton()}
                    className="mt-4 px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all"
                  >
                    View Recipe
                  </button>
              </div>
            </div>
          </div>
        </div>

        {/* ABOUT SECTION */}
        <div className="bg-white/90 rounded-2xl p-8 shadow-xl mb-12">
          <h2 className="text-3xl font-bold mb-4">About {chef.chefId.name}</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            {chef.bio || "This chef has not added a bio yet."}
          </p>
        </div>

        {/* RECIPES */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Recipes</h2>

          {recipes.length === 0 ? (
            <p className="text-gray-600 italic">No recipes yet.</p>
          ) : (
            <div className="grid grid-cols-3 gap-6 mb-6">
              {recipes.map((recipe: any) => (
                <div key={recipe._id} className="bg-white rounded-2xl shadow">
                  <div className="h-56 overflow-hidden">
                    <img src={recipe.image} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg">{recipe.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Pagination totalPages={totalPagesRecipe} currentPage={currentPageRecipe} onChange={handlePageChangeRecipe} />

      
        {/* BLOGS */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Blogs</h2>

          {blogs.length === 0 ? (
            <p className="text-gray-600 italic">No blogs yet.</p>
          ) : (
            <div className="grid grid-cols-3 gap-6 mb-6">
              {blogs.map((blog: any) => (
                <div key={blog._id} className="bg-white shadow rounded-2xl overflow-hidden">
                  <img src={blog.image} className="h-48 w-full object-cover" />
                  <div className="p-5">
                    <h3 className="font-bold">{blog.title}</h3>
                    <p className="text-sm text-green-600">{blog.author}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
          <Pagination totalPages={totalPagesBlog} currentPage={currentPageBlog} onChange={handlePageChangeBlog} />
      </main>
    </div>
  );
}
