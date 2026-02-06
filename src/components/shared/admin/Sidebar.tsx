import {
  LayoutDashboard,
  Users,
  ChefHat,
  BookOpen,
  MapPin,
  Heart,
  BarChart3,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { logoutApi } from "@/api/authApi";
import { useUserStore } from "@/store/userStore";

interface SidebarProps {
  activePath: string;
  onMenuSelect: (path: string) => void;
}

export default function Sidebar({ activePath, onMenuSelect }: SidebarProps) {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const delUserStore = useUserStore().delUserStore

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin-dashboard" },
    { icon: Users, label: "User Management", path: "/admin-dashboard/foodie-management" },
    { icon: ChefHat, label: "Chef Management", path: "/admin-dashboard/chef-management" },
    { icon: Heart, label: "Recipe Managemnent", path: "/admin-dashboard/recipe-management" },
    { icon: BookOpen, label: "Blogs Management", path: "/admin-dashboard/blog-management" },
    { icon: MapPin, label: "Food Spot Management", path: "/admin-dashboard/foodspot-management" },
    { icon: BookOpen, label: "Workshop Management", path: "/admin-dashboard/workshop-management" },
  ];

  const handleLogout = async () => {
    try {
      logout();
      await logoutApi()
      delUserStore()
      navigate("/admin-login");
    } catch (error) {

    }
  };

  return (
    <aside className="w-72 bg-white/80 backdrop-blur-md min-h-screen p-6 shadow-2xl border-r border-gray-200 flex flex-col justify-between">
      <nav className="space-y-1.5">
        {menuItems.map(({ icon: Icon, label, path }) => {
          const isActive = activePath === path;
          return (
            <button
              key={path}
              onClick={() => onMenuSelect(path)}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 ${isActive
                ? "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 text-white shadow-lg font-semibold"
                : "text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700"
                }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="pt-6 border-t border-gray-200 mt-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-red-600 hover:bg-red-50 transition-all font-semibold"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
