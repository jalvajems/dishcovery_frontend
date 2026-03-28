import logo from "../../../assets/logo.png"
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { NotificationBell } from "../NotificationBell";
import Chatbot from "@/components/chat/Chatbot";
import { Menu } from "lucide-react";
import profile from "../../../assets/profile.jpg";

interface FoodieNavbarProps {
  onMenuClick?: () => void;
}

export default function FoodieNavbar({ onMenuClick }: FoodieNavbarProps) {

  const navigate = useNavigate()
  const { image } = useUserStore()

  return (
    <nav className="bg-white/90 backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-gray-100/80 transition-all duration-300">
      <div className="w-full px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
        
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={onMenuClick}
            className="p-2 -ml-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-600 transition-all md:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo Section */}
          <div
            onClick={() => navigate('/foodie/dashboard')}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <img
              src={logo}
              alt="Dishcovery"
              className="h-8 md:h-10 w-auto object-contain"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 md:gap-6">
          <Chatbot />
          <NotificationBell />

          <div className="h-8 w-[1px] bg-gray-200 hidden md:block"></div>

          <div className="flex items-center gap-3">
            <div
              onClick={() => navigate("/foodie/profile")}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden ring-2 ring-gray-100 hover:ring-green-400 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <img
                src={image || profile}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
