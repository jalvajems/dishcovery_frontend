import AddNewBlog from "@/pages/chef/AddBlog.chef";
import AddRecipe from "@/pages/chef/AddRecipe.chef";
import BlogDetailPage from "@/pages/chef/BlogDetail.chef";
import BlogListChef from "@/pages/chef/BlogList";
import ChefDashboard from "@/pages/chef/ChefDashboard";
import ChefLayout from "@/pages/chef/ChefLayout";
import EditBlog from "@/pages/chef/EditBlog.chef";
import CreateProfileChef from "@/pages/chef/AddProfile.chef";
import EditRecipe from "@/pages/chef/EditRecipe.chef";
import RecipeDetailPage from "@/pages/chef/RecipeDetails.chef";
import RecipeListing from "@/pages/chef/RecipeListing.chef";
import { Route, Routes } from "react-router-dom";
import ChefProfileEdit from "@/pages/chef/EditProfile.chef";
import ChefProfilePage from "@/pages/chef/Profile.chef";
import WorkshopListChef from "@/pages/chef/WorkshopList.chef";
import AddWorkshopChef from "@/pages/chef/AddWorkshop.chef";
import EditWorkshopChef from "@/pages/chef/EditWorkshop.chef";
import WorkshopDetailChef from "@/pages/chef/WorkshopDetail.chef";
import LiveSession from "@/pages/shared/LiveSession";
import WorkshopSummary from "@/pages/shared/WorkshopSummary";

function ChefRoutes() {
    return (
        <Routes>
            <Route path="/chef" element={<ChefLayout />}>
                <Route path="dashboard" element={<ChefDashboard />} />
                <Route path="recipes-listing" element={<RecipeListing />} />
                <Route path="blog-listing" element={<BlogListChef />} />
                <Route path="workshop-listing" element={<WorkshopListChef />} />
            </Route>
            <Route path="/recipe-detail/:id" element={<RecipeDetailPage />} />
            <Route path="/recipe-add" element={<AddRecipe />} />
            <Route path="/recipe-edit/:id" element={<EditRecipe />} />

            <Route path="/blog-add" element={<AddNewBlog />} />
            <Route path="/blog-edit/:blogId" element={<EditBlog />} />
            <Route path="/blog-detail/:blogId" element={<BlogDetailPage />} />

            <Route path="/chef/profile" element={<ChefProfilePage />} />
            <Route path="/chef/profile-add" element={<CreateProfileChef />} />
            <Route path="/chef/profile-edit" element={<ChefProfileEdit />} />

            <Route path="/chef/workshop-add" element={<AddWorkshopChef />} />
            <Route path="/chef/workshop-edit/:id" element={<EditWorkshopChef />} />
            <Route path="/chef/workshop-detail/:id" element={<WorkshopDetailChef />} />
            <Route path="/chef/live-session/:workshopId" element={<LiveSession />} />
            <Route path="/chef/workshop-summary/:workshopId" element={<WorkshopSummary />} />
        </Routes>
    )
}

export default ChefRoutes;
