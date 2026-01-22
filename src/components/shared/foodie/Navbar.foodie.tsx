import logo from "../../../assets/logo.png"
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";

export default function FoodieNavbar() {

  const navigate = useNavigate()
  const { image } = useUserStore()

  return (
    <nav className="bg-white shadow-sm sticky top-0  z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Dishcovery"
            className="w-70 h-19  object-contain"
          />
        </div>


      

        <div className="flex items-center gap-4 px-5 py-3">
          <div className="w-12 h-12 rounded-full overflow-hidden shadow-xl ring-4 ring-green-100 cursor-pointer hover:scale-105 transition-transform">
            <img
              onClick={() => navigate("/foodie/profile")}
              src={image || "/default-avatar.png"}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
