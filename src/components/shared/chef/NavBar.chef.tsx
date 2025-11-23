import { Bell, Search } from "lucide-react";

export default function ChefNavbar() {
  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-green-600">Dishcovery - Chef Panel</h1>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-gray-100 rounded-full border border-gray-200"
          />
        </div>

        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Bell className="w-6 h-6 text-gray-600" />
        </button>

        <img
          src="https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=80"
          className="w-10 h-10 rounded-full border border-green-400"
        />
      </div>
    </header>
  );
}
