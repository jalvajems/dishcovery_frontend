import { Routes, Route } from "react-router-dom";
import AdminLayout from "@/pages/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import { useAuthStore } from "@/store/authStore";
import FoodieManagement from "@/pages/admin/FoodieManagement";
import ChefManagement from "@/pages/admin/ChefManagement";
import RecipeManagement from "@/pages/admin/RecipeManagement";
import BlogManagement from "@/pages/admin/BlogManagement";
import FoodSpotManagement from "@/pages/admin/FoodSpotManagement";

export default function AdminRoutes() {
  const { role } = useAuthStore();
  return (
    <Routes>
      <Route path="/admin-dashboard" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="foodie-management" element={<FoodieManagement />} />
        <Route path="chef-management" element={<ChefManagement />} />
        <Route path="recipe-management" element={<RecipeManagement />} />
        <Route path="blog-management" element={<BlogManagement />} />
        <Route path="foodspot-management" element={<FoodSpotManagement />} />
      </Route>
    </Routes>
  );
}
