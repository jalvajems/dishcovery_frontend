import AddRecipe from "@/pages/chef/AddRecipe.chef";
import ChefDashboard from "@/pages/chef/ChefDashboard";
import ChefLayout from "@/pages/chef/ChefLayout";
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
        {/* <Route path="blogs" element={<Blogs />} /> */}
        {/* <Route path="chat" element={<Chat />} /> */}
        {/* <Route path="profile" element={<Profile />} /> */}
      </Route>
      <Route path="/recipe-detail/:id" element={<RecipeDetailPage/>}/>
      <Route path="/recipe-add" element={<AddRecipe/>} />
    </Routes>

            
           
       
    )
}

export default ChefRoutes;