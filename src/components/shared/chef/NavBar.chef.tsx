import { Bell, Search } from "lucide-react";
import logo from "../../../assets/logo.png"
import { getChefProfileApi } from "@/api/chefApi";
import { showError } from "@/utils/toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ChefNavbar() {
  const [chef, setChef] = useState<any>(null);
  const navigate=useNavigate()
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
    <header className="bg-white shadow-md flex items-center justify-between">
      
      {/* Left: Logo */}
      <div className="flex items-center gap-3 ">
        <img
          src={logo}
          alt="Dishcovery"
          className="w-70 h-19  object-contain"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-5 px-5">
        
        {/* Notification */}
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Bell className="w-6 h-6 text-gray-600" />
        </button>

        {/* Profile Image */}
        
          <div className="w-12 h-12 rounded-full overflow-hidden shadow-xl ring-4 ring-green-100 ">
              <img 
              onClick={() => navigate("/chef/profile")}

              src={chef?.image || "/default-avatar.png"} className="w-full h-full object-cover" />
            </div>
      </div>
    </header>
  );
}
