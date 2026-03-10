import logo from "../../../assets/logo.png"
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { NotificationBell } from "../NotificationBell";
import Chatbot from "@/components/chat/Chatbot";

export default function FoodieNavbar() {

  const navigate = useNavigate()
  const { image } = useUserStore()

  return (
    <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100/80 transition-all duration-300">
      <div className="w-full px-4 md:px-8 h-20 flex items-center justify-between">
        {/* Logo Section */}
        <div
          onClick={() => navigate('/foodie/dashboard')}
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <img
            src={logo}
            alt="Dishcovery"
            className="h-10 w-auto object-contain"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <Chatbot />
          <NotificationBell />

          <div className="h-8 w-[1px] bg-gray-200 hidden md:block"></div>

          <div className="flex items-center gap-3">
            <div
              onClick={() => navigate("/foodie/profile")}
              className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-100 hover:ring-green-400 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <img
                src={image || "/default-avatar.png"}
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
