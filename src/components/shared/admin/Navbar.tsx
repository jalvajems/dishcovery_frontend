import { Bell, Settings } from "lucide-react";

export default function Navbar() {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
      <div className="text-2xl font-semibold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
        Dishcovery Admin
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
