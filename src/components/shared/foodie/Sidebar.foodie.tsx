import { NavLink } from "react-router-dom";
import { Home, BookOpen, FileText, MapPin, Heart, MessageCircle, Bot, LogOut, Pen, SpoolIcon, ToolCase, CookingPot, Store, Wallet, ChefHat, UserPlus } from 'lucide-react';
import { logoutApi } from "@/api/authApi";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";

export default function FoodieSidebar() {
  const navigate = useNavigate();
  const { delUserStore, name, email, image } = useUserStore()


  const menuItems = [
    { icon: Home, label: 'Home', path: '/foodie/dashboard' },
    { icon: ChefHat, label: 'Chefs', path: '/foodie/chefs' },
    { icon: UserPlus, label: 'Followings', path: '/foodie/followings' },

    { icon: BookOpen, label: 'Recipes', path: '/foodie/recipe-listing' },
    { icon: FileText, label: 'Blogs', path: '/foodie/blog-listing' },
    { icon: MapPin, label: 'Food Spots', path: '/foodie/spot-listing' },
    { icon: Store, label: 'My Food Spots', path: '/foodie/myspot-listing' },
    { icon: ToolCase , label: 'Workshops', path: "/foodie/workshop-discovery" },
    { icon: Pen, label: 'My Workshops', path: "/foodie/my-workshops" },
    { icon: Wallet, label: 'Wallet', path: "/foodie/wallet" },
    { icon: MessageCircle, label: 'Chat', path: '/foodie/chat' },
    { icon: Bot, label: 'AI Chef', path: '/foodie/aichef' },
    { icon: LogOut, label: 'Logout', path: '/logout' },
  ];

  const handleLogout = async () => {
    await logoutApi();
    useAuthStore.getState().logout();
    delUserStore()
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-white/80 p-6 sticky top-20 h-fit shadow-lg rounded-r-3xl">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200">
        <div className="w-12 h-12  rounded-full overflow-hidden shadow-xl ring-4 ring-green-100">
          <img
            onClick={() => navigate('/foodie/profile')}
            src={image || "/default-avatar.png"}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-xs text-gray-500">{email}</p>
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map(item => {
          const Icon = item.icon;

          if (item.label === "Logout") {
            return (
              <button
                key={item.label}
                onClick={() => handleLogout()}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50"
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          }

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${isActive ? "bg-green-500 text-white shadow-lg" : "text-gray-700 hover:bg-green-50"}`
              }
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
