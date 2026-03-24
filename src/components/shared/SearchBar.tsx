import { Search } from "lucide-react";
import { useState, useEffect } from "react";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  initialValue?: string;
}

export default function SearchBar({
  placeholder = "Search...",
  onSearch,
  initialValue = "",
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    const delay = setTimeout(() => {
      onSearch(query);
    }, 400);

    return () => clearTimeout(delay);
  }, [query, onSearch]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl 
        text-gray-900 placeholder-gray-500 shadow-md 
        focus:outline-none focus:ring-4 focus:ring-green-300 transition-all"
      />
    </div>
  );
}
