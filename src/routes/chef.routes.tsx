import AddNewBlog from "@/pages/chef/AddBlog.chef";
import AddRecipe from "@/pages/chef/AddRecipe.chef";
import BlogDetailPage from "@/pages/chef/BlogDetail";
import BlogListChef from "@/pages/chef/BlogList";
import ChefDashboard from "@/pages/chef/ChefDashboard";
import ChefLayout from "@/pages/chef/ChefLayout";
import EditBlog from "@/pages/chef/EditBlog.chef";
import EditRecipe from "@/pages/chef/EditRecipe.chef";
import RecipeDetailPage from "@/pages/chef/RecipeDetails.chef";
import RecipeListing from "@/pages/chef/RecipeListing.chef";
import { Route, Routes } from "react-router-dom";
// import ProtectedRoute from "./Protected.routes";
// import { useAuthStore } from "@/store/authStore";

function ChefRoutes(){
    // const {role}=useAuthStore();
    return(
    <Routes>
      <Route path="/chef" element={<ChefLayout />}>
        <Route path="dashboard" element={<ChefDashboard />} />
        <Route path="recipes-listing" element={<RecipeListing />} />
        {/* <Route path="workshops" element={<Workshops />} /> */}
        <Route path="blog-listing" element={<BlogListChef />} />
        {/* <Route path="chat" element={<Chat />} /> */}
        {/* <Route path="profile" element={<Profile />} /> */}
      </Route>
      <Route path="/recipe-detail/:id" element={<RecipeDetailPage/>}/>
      <Route path="/recipe-add" element={<AddRecipe/>} />
      <Route path="/recipe-edit/:id" element={<EditRecipe/>} />

      <Route path="/blog-add" element={<AddNewBlog/>}/>
      <Route path="/blog-edit/:blogId" element={<EditBlog/>} />
      <Route path="/blog-detail/:blogId" element={<BlogDetailPage/>} />
      
    </Routes>

            
           
       
    )
}

export default ChefRoutes;