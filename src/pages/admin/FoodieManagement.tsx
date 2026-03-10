import SearchFilterBar from "@/components/shared/admin/SearchFilterBar";
import { useAdminTable } from "@/components/shared/hooks/useAdminTable";
import {
  adminFoodieListingApi,
  AdminBlockApi,
  AdminUnBlockApi,
} from "@/api/adminApi";
import { showError } from "@/utils/toast";
import { getErrorMessage } from "@/utils/errorHandler";
import ConfirmModal from "@/components/shared/ConfirmModal";
import ReusableTable from "@/components/shared/DataTable";
import Pagination from "@/components/shared/Pagination";
import { useState } from "react";

type Foodie = {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
};

export default function FoodieManagement() {
  const {
    data: foodies,
    totalPages,
    currentPage,
    setCurrentPage,

    searchInput,
    setSearchInput,

    filters,
    updateFilter,
    refetch
  } = useAdminTable<Foodie>({

    fetchApi: async (page, limit, search, filters) => {
      return adminFoodieListingApi(page, limit, search, filters.status as string);
    },
    filters: [{ key: "status", defaultValue: "all" }],
  });


  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Foodie | null>(null);
  const [actionType, setActionType] = useState<"BLOCK" | "UNBLOCK" | null>(null);

  const askConfirm = (user: Foodie, type: "BLOCK" | "UNBLOCK") => {
    setSelected(user);
    setActionType(type);
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!selected || !actionType) return;

    try {
      if (actionType === "BLOCK") await AdminBlockApi(selected._id);
      else await AdminUnBlockApi(selected._id);

      setModalOpen(false);
      refetch();
    } catch (error: unknown) {
      showError(getErrorMessage(error, "Failed to update foodie status"));
    }
  };

  const columns = [
    { key: "name", label: "Name" },

    {
      key: "email",
      label: "Email",
      render: (u: Foodie) => (
        <span className="text-green-600 font-medium">{u.email}</span>
      ),
    },

    {
      key: "status",
      label: "Status",
      render: (u: Foodie) => (
        <button
          className={`px-4 py-1 rounded-lg font-semibold ${u.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          onClick={() => askConfirm(u, u.isBlocked ? "UNBLOCK" : "BLOCK")}
        >
          {u.isBlocked ? "Blocked" : "Active"}
        </button>
      ),
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Foodies</h1>

      <SearchFilterBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        filters={filters as Record<string, string>}
        updateFilter={updateFilter}
        filterOptions={{
          status: [
            { value: "all", label: "All" },
            { value: "false", label: "Active" },
            { value: "true", label: "Blocked" },
          ],
        }}
      />

      <ReusableTable columns={columns} data={foodies} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={setCurrentPage}
      />

      <ConfirmModal
        isOpen={modalOpen}
        title={actionType === "BLOCK" ? "Block user?" : "Unblock user?"}
        message="Are you sure?"
        onConfirm={handleConfirm}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}
