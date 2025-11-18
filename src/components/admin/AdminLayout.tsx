import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "@/components/reusable/admin/Sidebar";
import Navbar from "@/components/reusable/admin/Navbar";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      <div className="flex flex-1 pt-16">
        <div className="fixed top-16 left-0 bottom-0 w-72 bg-white border-r shadow-lg z-40 overflow-y-auto">
          <Sidebar
            activePath={location.pathname}
            onMenuSelect={(path) => navigate(path)}
          />
        </div>

        <main className="flex-1 ml-72  overflow-y-auto bg-gray-50 p-6 h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>

  );
}
