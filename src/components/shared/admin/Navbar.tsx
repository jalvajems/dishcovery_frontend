import { Bell, Settings } from "lucide-react";
import logo from "../../../assets/logo.png"


export default function Navbar() {
  
  return (
    <header className="bg-white shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="Dishcovery"
          className="w-60 h-15  object-contain"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Bell className="w-5 h-5 text-gray-700" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Settings className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </header>
  );
}
