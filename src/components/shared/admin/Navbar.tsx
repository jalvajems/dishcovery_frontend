import { Bell, Settings } from "lucide-react";
import logo from "../../../assets/logo.png"


export default function Navbar() {

  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100/80 transition-all duration-300">
      <div className="w-full px-4 md:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Dishcovery"
            className="h-10 w-auto object-contain"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-green-600 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-green-600 transition-colors">
            <Settings className="w-5 h-5" />
          </button>

          <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>

          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
            AD
          </div>
        </div>
      </div>
    </header>
  );
}
