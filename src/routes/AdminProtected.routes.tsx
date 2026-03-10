import { useAuthStore } from "@/store/authStore";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminProtectedRoute() {
    const { token, role } = useAuthStore();

    // Check if token exists AND user has admin role
    if (!token || role !== 'admin') {
        // Redirect completely if not admin
        // If they are logged in as user/chef, they shouldn't even see the admin login
        // But for safety, send to admin login, or better yet, just generic login or home
        // sending to admin-login is standard behavior for admin routes
        return <Navigate to='/admin-login' replace />
    }

    return <Outlet />;
}
