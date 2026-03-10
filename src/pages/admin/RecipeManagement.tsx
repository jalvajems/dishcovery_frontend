import { useState } from "react";
import { useAdminTable } from "@/components/shared/hooks/useAdminTable";

import SearchFilterBar from "@/components/shared/admin/SearchFilterBar";
import ReusableTable, { type ITableColumn } from "@/components/shared/DataTable";
import Pagination from "@/components/shared/Pagination";
import ConfirmModal from "@/components/shared/ConfirmModal";

import {
  adminRecipeListingApi,
  adminBlockRecipeApi,
  adminUnblockRecipeApi,
} from "@/api/adminApi";
import { showError } from "@/utils/toast";
import { getErrorMessage } from "@/utils/errorHandler";

type Recipe = {
  _id: string;
  title: string;
  chefId: {
    id: string;
    name: string;
  };
  cuisine: string;
  createdAt: string;
  isBlock: boolean;
};

export default function RecipeManagement() {
  const {
    data: recipes,
    totalPages,
    currentPage,
    setCurrentPage,

    searchInput,
    setSearchInput,

    filters,
    updateFilter,
    refetch
  } = useAdminTable<Recipe>({
    fetchApi: async (page, limit, search, filters) => {
      return adminRecipeListingApi(
        page,
        limit,
        search,
        filters.status as string
      );
    },

    filters: [
      { key: "status", defaultValue: "all" },
    ],
  });


  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [actionType, setActionType] = useState<"BLOCK" | "UNBLOCK" | null>(null);

  const openConfirm = (recipe: Recipe, type: "BLOCK" | "UNBLOCK") => {
    setSelectedRecipe(recipe);
    setActionType(type);
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedRecipe || !actionType) return;

    try {
      if (actionType === "BLOCK") await adminBlockRecipeApi(selectedRecipe._id);
      if (actionType === "UNBLOCK") await adminUnblockRecipeApi(selectedRecipe._id);

      setModalOpen(false);
      refetch();
    } catch (error: unknown) {
      showError(getErrorMessage(error, "Failed to update recipe status"));
    }
  };

  const columns: ITableColumn<Recipe>[] = [
    { key: "title", label: "Recipe Name" },

    {
      key: "chefId",
      label: "Chef Name",
      render: (r) => <span>{r.chefId?.name}</span>,
    },

    {
      key: "cuisine",
      label: "Cuisine",
    },

    {
      key: "createdAt",
      label: "Created",
      render: (r) =>
        r.createdAt
          ? new Date(r.createdAt).toLocaleDateString("en-IN")
          : "N/A",
    },

    {
      key: "isBlock",
      label: "Status",
      render: (r) => (
        <button
          className={`px-3 py-1 rounded ${r.isBlock ? "bg-red-200" : "bg-green-200"
            }`}
          onClick={() => openConfirm(r, r.isBlock ? "UNBLOCK" : "BLOCK")}
        >
          {r.isBlock ? "Unblock" : "Block"}
        </button>
      ),
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6">Recipes</h1>

      <SearchFilterBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        filters={filters as Record<string, string>}
        updateFilter={updateFilter}
        filterOptions={{
          status: [
            { label: "All", value: "all" },
            { label: "Active", value: "active" },
            { label: "Blocked", value: "blocked" },
          ],
        }}
      />

      <ReusableTable data={recipes} columns={columns} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={setCurrentPage}
      />

      <ConfirmModal
        isOpen={modalOpen}
        title={actionType || ""}
        message="Are you sure?"
        onConfirm={handleConfirm}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}
