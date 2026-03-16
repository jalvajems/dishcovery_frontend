import { useAdminTable } from "@/hooks/useAdminTable";
import SearchFilterBar from "@/components/shared/admin/SearchFilterBar";
import ReusableTable, { type ITableColumn } from "@/components/shared/DataTable";
import Pagination from "@/components/shared/Pagination";
import ConfirmModal from "@/components/shared/ConfirmModal";

import {
  adminChefListingApi,
  AdminBlockApi,
  AdminUnBlockApi,
  adminVerifyChefApi,
  adminUnverifyChefApi,
} from "@/api/adminApi";
import { showError } from "@/utils/toast";
import { getErrorMessage } from "@/utils/errorHandler";

import { useState } from "react";

type Chef = {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  isBlocked: boolean;
  isVerified: boolean;
};

export default function ChefManagement() {
  const {
    data: chefs,
    totalPages,
    currentPage,
    setCurrentPage,

    searchInput,
    setSearchInput,

    filters,
    updateFilter,
    refetch
  } = useAdminTable<Chef>({
    fetchApi: async (page, limit, search, filters) => {
      return adminChefListingApi(
        page,
        limit,
        search,
        filters.status as string,
        filters.verified as string
      );
    },
    filters: [
      { key: "status", defaultValue: "all" },
      { key: "verified", defaultValue: "all" },
    ],
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedChef, setSelectedChef] = useState<Chef | null>(null);
  const [actionType, setActionType] =
    useState<"BLOCK" | "UNBLOCK" | "VERIFY" | "UNVERIFY" | null>(null);

  type ActionType = "BLOCK" | "UNBLOCK" | "VERIFY" | "UNVERIFY";

  const openConfirm = (chef: Chef, type: ActionType) => {
    setSelectedChef(chef);
    setActionType(type);
    setModalOpen(true);
  };


  const handleConfirm = async () => {
    if (!selectedChef || !actionType) return;

    try {
      if (actionType === "BLOCK") await AdminBlockApi(selectedChef._id);
      if (actionType === "UNBLOCK") await AdminUnBlockApi(selectedChef._id);
      if (actionType === "VERIFY") await adminVerifyChefApi(selectedChef._id);
      if (actionType === "UNVERIFY") await adminUnverifyChefApi(selectedChef._id);

      setModalOpen(false);
      refetch();
    } catch (error: unknown) {
      showError(getErrorMessage(error, "Failed to update chef status"));
    }
  };

  const columns: ITableColumn<Chef>[] = [
    { key: "name", label: "Name" },
    {
      key: "email",
      label: "Email",
      render: (c) => <span className="text-green-600">{c.email}</span>,
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (c) => new Date(c.createdAt).toLocaleDateString("en-IN"),
    },
    {
      key: "isBlocked",
      label: "Status",
      render: (c) => (
        <button
          className={`px-3 py-1 rounded ${c.isBlocked ? "bg-red-200" : "bg-green-200"
            }`}
          onClick={() => openConfirm(c, c.isBlocked ? "UNBLOCK" : "BLOCK")}
        >
          {c.isBlocked ? "Unblock" : "Block"}
        </button>
      ),
    },
    {
      key: "isVerified",
      label: "Verified",
      render: (c) => (
        <button
          className={`px-3 py-1 rounded ${c.isVerified ? "bg-blue-200" : "bg-yellow-200"
            }`}
          onClick={() => openConfirm(c, c.isVerified ? "UNVERIFY" : "VERIFY")}
        >
          {c.isVerified ? "Unverify" : "Verify"}
        </button>
      ),
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6">Chefs</h1>

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
          verified: [
            { label: "All", value: "all" },
            { label: "Verified", value: "verified" },
            { label: "Unverified", value: "unverified" },
          ],
        }}
      />

      <ReusableTable data={chefs} columns={columns} />

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
