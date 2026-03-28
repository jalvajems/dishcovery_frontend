
import { NotificationBell } from "../NotificationBell";
import Chatbot from "@/components/chat/Chatbot";
import logo from "../../../assets/logo.png"
import { getChefProfileApi } from "@/api/chefApi";
import { getErrorMessage } from "@/utils/errorHandler";
import { showError } from "@/utils/toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import profile from "../../../assets/profile.jpg";

interface Chef {
  firstName: string;
  lastName: string;
  image: string;
}

interface ChefNavbarProps {
  onMenuClick?: () => void;
}

export default function ChefNavbar({ onMenuClick }: ChefNavbarProps) {
  const [chef, setChef] = useState<Chef | null>(null);
  const navigate = useNavigate()
  
  useEffect(() => {
    async function fetchData() {
      try {
        const chefRes = await getChefProfileApi()
        setChef(chefRes.data.datas);
      } catch (error: unknown) {
        showError(getErrorMessage(error, "Something went wrong"));
      }
    }
    fetchData();
  }, []);

  return (
    <header className="bg-white/90 backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-gray-100/80 transition-all duration-300">
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
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/chef/dashboard')}>
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

          {/* Profile Image */}
          <div
            onClick={() => navigate("/chef/profile")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-gray-700 group-hover:text-green-600 transition-colors">{chef?.firstName} {chef?.lastName}</p>
              <p className="text-xs text-gray-500 text-right">Chef</p>
            </div>

            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden ring-2 ring-gray-100 group-hover:ring-green-400 transition-all duration-300 shadow-sm hover:shadow-md">
              <img
                src={chef?.image || profile}
                className="w-full h-full object-cover"
                alt="Chef Profile"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
