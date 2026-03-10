import { Search } from "lucide-react";

export default function SearchFilterBar({
  searchInput,
  setSearchInput,
  filters,
  updateFilter,
  filterOptions = {}
}) {
  return (
    <div className="flex items-center gap-4 mb-4">
      
      <div className="relative">
        <Search className="absolute left-2 top-2.5 text-gray-400" size={18} />
        <input
          className="border pl-8 pr-4 py-2 rounded-lg w-64"
          placeholder="Search..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {/* Filters */}
      {Object.entries(filterOptions).map(([key, options]) => (
        <select
          key={key}
          className="border px-3 py-2 rounded-lg"
          value={filters[key]}
          onChange={(e) => updateFilter(key, e.target.value)}
        >
          {options.map((op: any) => (
            <option key={op.value} value={op.value}>{op.label}</option>
          ))}
        </select>
      ))}
    </div>
  );
}
