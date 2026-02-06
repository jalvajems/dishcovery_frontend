
import { NotificationBell } from "../NotificationBell";
import Chatbot from "@/components/chat/Chatbot";
import logo from "../../../assets/logo.png"
import { getChefProfileApi } from "@/api/chefApi";
import { showError } from "@/utils/toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ChefNavbar() {
  const [chef, setChef] = useState<any>(null);
  const navigate = useNavigate()
  useEffect(() => {
    async function fetchData() {
      try {
        const chefRes = await getChefProfileApi()

        setChef(chefRes.data.datas);

      } catch (error: any) {
        showError(error?.response?.data?.message || "Something went wrong");
      }
    }

    fetchData();
  }, []);


  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100/80 transition-all duration-300">
      <div className="w-full px-4 md:px-8 h-20 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/chef/dashboard')}>
          <img
            src={logo}
            alt="Dishcovery"
            className="h-10 w-auto object-contain"
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-6">

          {/* Notification */}
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
              <p className="text-xs text-gray-500">Chef</p>
            </div>

            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-100 group-hover:ring-green-400 transition-all duration-300 shadow-sm hover:shadow-md">
              <img
                src={chef?.image || "/default-avatar.png"}
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
