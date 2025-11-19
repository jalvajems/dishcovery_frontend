import { Routes, Route } from "react-router-dom";
import AdminLayout from "@/pages/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import { useAuthStore } from "@/store/authStore";
import FoodieManagement from "@/pages/admin/FoodieManagement";
import ChefManagement from "@/pages/admin/ChefManagement";

export default function AdminRoutes() {
    const  {role}=useAuthStore();
  return (
    <Routes>
      <Route path="/admin-dashboard" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="foodie-management" element={<FoodieManagement />} />
        <Route path="chef-management" element={<ChefManagement />} />
        </Route>
    </Routes>
  );
}
