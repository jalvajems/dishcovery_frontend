import {
  Home,
  BookOpen,
  FileText,
  MessageCircle,
  User,
  LogOut,
  Wallet,
  ChefHat,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { logoutApi } from "@/api/authApi";
import { useUserStore } from "@/store/userStore";

interface SidebarProps {
  activePath: string;
  onMenuSelect: (path: string) => void;
  onClose?: () => void;
}

export default function ChefSidebar({ activePath, onMenuSelect, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const delUserStore = useUserStore().delUserStore
  const { isVerifiedUser } = useUserStore()


  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/chef/dashboard" },
    { icon: BookOpen, label: "Recipes", path: "/chef/recipes-listing" },
    { icon: FileText, label: "Blogs", path: "/chef/blog-listing" },
    { icon: ChefHat, label: "Workshops", path: "/chef/workshop-listing" },
    { icon: Wallet, label: "Wallet", path: "/chef/wallet" },
    { icon: MessageCircle, label: "Chat", path: "/chef/chat" },
    { icon: User, label: "Profile", path: "/chef/profile" },
  ];


  const handleLogout = async () => {
    await logoutApi();
    logout();
    delUserStore()
    navigate("/login");
  };

  return (
    <aside className="w-72 bg-white h-screen p-6 shadow-xl flex flex-col justify-between border-r scrollbar-hide overflow-y-auto relative">
      
      {/* Mobile Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-xl bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all md:hidden"
      >
        <X className="w-5 h-5" />
      </button>

      <nav className="space-y-2 mt-8 md:mt-0">
        {menuItems.map(({ icon: Icon, label, path }) => {
          const isActive = activePath === path;

          return (
            <button
              key={path}
              disabled={!isVerifiedUser}
              onClick={() => onMenuSelect(path)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all ${isActive
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg font-semibold translate-x-1"
                : "text-gray-700 hover:bg-green-50 hover:text-green-700 hover:translate-x-1"
                }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          );
        })}
      {/* Logout */}
      <div className="pt-4 mt-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-5 py-4 text-red-600 hover:bg-red-50 rounded-xl font-semibold transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          Logout
        </button>
      </div>
      </nav>

    </aside>
  );
}
