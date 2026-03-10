import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onChange,
}: PaginationProps) {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-t border-gray-200">
      <div className="flex items-center justify-center gap-2">

        <button
          onClick={() => onChange(Math.max(1, currentPage - 1))}
          className="p-2 rounded-lg hover:bg-white transition-all hover:shadow-md disabled:opacity-50"
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        {[...Array(totalPages)].map((_, index) => {
          const page = index + 1;

          return (
            <button
              key={page}
              onClick={() => onChange(page)}
              className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                currentPage === page
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-110"
                  : "bg-white text-gray-700 hover:bg-gray-100 hover:scale-105 hover:shadow-md"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
          className="p-2 rounded-lg hover:bg-white transition-all hover:shadow-md disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
