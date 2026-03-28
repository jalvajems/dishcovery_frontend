import { NavLink } from "react-router-dom";
import { Home, BookOpen, FileText, MapPin, MessageCircle, LogOut, Pen, ToolCase, Store, Wallet, ChefHat, UserPlus, X } from 'lucide-react';
import { logoutApi } from "@/api/authApi";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import profile from "../../../assets/profile.jpg";



interface FoodieSidebarProps {
  onClose?: () => void;
}

export default function FoodieSidebar({ onClose }: FoodieSidebarProps) {
  const navigate = useNavigate();
  const { delUserStore, name, image } = useUserStore()

  const menuItems = [
    {
      section: "Discover", items: [
        { icon: Home, label: 'Home', path: '/foodie/dashboard' },
        { icon: BookOpen, label: 'Recipes', path: '/foodie/recipe-listing' },
        { icon: MapPin, label: 'Food Spots', path: '/foodie/spot-listing' },
        { icon: ToolCase, label: 'Workshops', path: "/foodie/workshop-discovery" },
        { icon: FileText, label: 'Blogs', path: '/foodie/blog-listing' },
      ]
    },
    {
      section: "Social", items: [
        { icon: ChefHat, label: 'Chefs', path: '/foodie/chefs' },
        { icon: UserPlus, label: 'Followings', path: '/foodie/followings' },
        { icon: MessageCircle, label: 'Chat', path: '/foodie/chat' },
      ]
    },
    {
      section: "Personal", items: [
        { icon: Store, label: 'My Food Spots', path: '/foodie/myspot-listing' },
        { icon: Pen, label: 'My Workshops', path: "/foodie/my-workshops" },
        { icon: Wallet, label: 'Wallet', path: "/foodie/wallet" },
      ]
    }
  ];

  const handleLogout = async () => {
    await logoutApi();
    useAuthStore.getState().logout();
    delUserStore()
    navigate("/login");
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className="w-72 bg-white h-screen flex flex-col overflow-y-auto scrollbar-hide border-r border-gray-100 shadow-2xl md:shadow-none relative">
      
      {/* Mobile Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-xl bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all md:hidden"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Profile Header */}
      <div className="p-6 pb-2">
        <div
          onClick={() => { navigate('/foodie/profile'); handleNavClick(); }}
          className="flex items-center gap-4 p-3 rounded-2xl bg-gradient-to-br from-gray-50 to-green-50/50 border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-300 group"
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-sm group-hover:ring-green-200 transition-all">
              <img
                src={image || profile}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 truncate text-sm group-hover:text-green-700 transition-colors">{name}</p>
            <p className="text-xs text-gray-500 truncate">View Profile</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-6">
        {menuItems.map((section, idx) => (
          <div key={idx}>
            <h3 className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">{section.section}</h3>
            <div className="space-y-1">
              {section.items.map(item => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                      ${isActive
                        ? "bg-green-500 text-white shadow-lg shadow-green-200 translate-x-1"
                        : "text-gray-600 hover:bg-gray-50 hover:text-green-600 hover:translate-x-1"}`
                    }
                  >
                    <Icon className="w-[18px] h-[18px]" />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}

        <div className="pt-4 mt-4 border-t border-gray-100">
          <button
            onClick={() => handleLogout()}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
          >
            <LogOut className="w-[18px] h-[18px] group-hover:rotate-180 transition-transform duration-300" />
            Logout
          </button>
        </div>
      </nav>
    </aside>
  );
}
