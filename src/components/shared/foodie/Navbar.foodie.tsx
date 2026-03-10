export default function FoodieNavbar() {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-green-600">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
            Dishcovery
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search recipes, chefs, spots..."
              className="pl-10 pr-4 py-2 w-80 bg-gray-50 border border-gray-200 rounded-full
              focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
            />
          </div>
          <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
            J
          </div>
        </div>
      </div>
    </nav>
  );
}
