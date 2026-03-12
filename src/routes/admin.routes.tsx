import { Route } from "react-router-dom";
import AdminLayout from "@/pages/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import FoodieManagement from "@/pages/admin/FoodieManagement";
import ChefManagement from "@/pages/admin/ChefManagement";
import RecipeManagement from "@/pages/admin/RecipeManagement";
import BlogManagement from "@/pages/admin/BlogManagement";
import FoodSpotManagement from "@/pages/admin/FoodSpotManagement";
import WorkshopManagement from "@/pages/admin/WorkshopManagement";
import WorkshopDetailAdmin from "@/pages/admin/WorkshopDetail.admin";
import FoodSpotDetailAdmin from "@/pages/admin/FoodSpotDetail.admin";

import AdminProtectedRoute from './AdminProtected.routes';

export default function AdminRoutes() {
  return (
    <>
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin-dashboard" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="foodie-management" element={<FoodieManagement />} />
          <Route path="chef-management" element={<ChefManagement />} />
          <Route path="recipe-management" element={<RecipeManagement />} />
          <Route path="blog-management" element={<BlogManagement />} />
          <Route path="foodspot-management" element={<FoodSpotManagement />} />
          <Route path="foodspot-management/:id" element={<FoodSpotDetailAdmin />} />
          <Route path="workshop-management" element={<WorkshopManagement />} />
          <Route path="workshop-management/:id" element={<WorkshopDetailAdmin />} />
        </Route>
      </Route>
    </>
  );
}
