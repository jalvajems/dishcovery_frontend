import {
  Home,
  BookOpen,
  Utensils,
  FileText,
  MessageCircle,
  User,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { logoutApi } from "@/api/authApi";

interface SidebarProps {
  activePath: string;
  onMenuSelect: (path: string) => void;
}

export default function ChefSidebar({ activePath, onMenuSelect }: SidebarProps) {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const menuItems = [
  { icon: Home, label: "Dashboard", path: "/chef/dashboard" },
  { icon: BookOpen, label: "Recipes", path: "/chef/recipes-listing" },
  { icon: Utensils, label: "Workshops", path: "/chef/workshops" },
  { icon: FileText, label: "Blogs", path: "/chef/blogs" },
  { icon: MessageCircle, label: "Chat", path: "/chef/chat" },
  { icon: User, label: "Profile", path: "/chef/profile" },
];


  const handleLogout = async () => {
    await logoutApi();
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-72 bg-white min-h-screen p-6 shadow-xl flex flex-col justify-between border-r">
      <nav className="space-y-2">
        {menuItems.map(({ icon: Icon, label, path }) => {
          const isActive = activePath === path;

          return (
            <button
              key={path}
              onClick={() => onMenuSelect(path)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all ${
                isActive
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg font-semibold"
                  : "text-gray-700 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-5 py-4 text-red-600 hover:bg-red-50 rounded-xl font-semibold"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
