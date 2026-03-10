import { useAuthStore } from "@/store/authStore";
import { Navigate, Outlet } from "react-router-dom";



export default function AuthProtectedRoute() {
  const { token, role } = useAuthStore();

  if (token) {

    if (role === "user") {
      return <Navigate to="/foodie/dashboard" replace />;
    } else if (role === "chef") {
      return <Navigate to="/chef/dashboard" replace />;
    } else if (role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    }
  }
  return <Outlet />;
}