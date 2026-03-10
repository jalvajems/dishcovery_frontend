import { useState } from "react";
import { useAdminTable } from "@/components/shared/hooks/useAdminTable";

import SearchFilterBar from "@/components/shared/admin/SearchFilterBar";
import ReusableTable, { type ITableColumn } from "@/components/shared/DataTable";
import Pagination from "@/components/shared/Pagination";
import ConfirmModal from "@/components/shared/ConfirmModal";

import {
  adminBlogListingApi,
  adminBlockBlogApi,
  adminUnblockBlogApi,
} from "@/api/adminApi";
import { showError } from "@/utils/toast";
import { getErrorMessage } from "@/utils/errorHandler";

type Blog = {
  _id: string;
  title: string;
  chefId: {
    _id: string;
    name: string;
  };
  shortDescription: string;
  status: "active" | "blocked";
  isBlocked: boolean;
  isDraft: boolean;
  coverImage: string;
  createdAt: string;
};

export default function BlogManagement() {
  const {
    data: blogs,
    totalPages,
    currentPage,
    setCurrentPage,
    searchInput,
    setSearchInput,
    filters,
    updateFilter,
    refetch
  } = useAdminTable<Blog>({
    fetchApi: async (page, limit, search, filters) => {
      return adminBlogListingApi(page, limit, search, filters.status);
    },
    filters: [{ key: "status", defaultValue: "all" }],
  });


  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [actionType, setActionType] = useState<"BLOCK" | "UNBLOCK" | null>(null);

  const openConfirm = (blog: Blog, type: "BLOCK" | "UNBLOCK") => {
    setSelectedBlog(blog);
    setActionType(type);
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedBlog || !actionType) return;

    try {
      if (actionType === "BLOCK") await adminBlockBlogApi(selectedBlog._id);
      if (actionType === "UNBLOCK") await adminUnblockBlogApi(selectedBlog._id);

      setModalOpen(false);
      refetch();
    } catch (error: unknown) {
      showError(getErrorMessage(error, "Failed to update blog status"));
    }
  };

  const columns: ITableColumn<Blog>[] = [
    {
      key: "coverImage",
      label: "Image",
      render: (b) => (
        <img
          src={b.coverImage}
          alt="cover"
          className="w-14 h-14 rounded object-cover border"
        />
      ),
    },

    { key: "title", label: "Title" },

    {
      key: "chefId",
      label: "Chef",
      render: (b) => b.chefId?.name,
    },

    { key: "shortDescription", label: "Short Description" },

    {
      key: "createdAt",
      label: "Created",
      render: (b) =>
        new Date(b.createdAt).toLocaleDateString("en-IN"),
    },

    {
      key: "isBlocked",
      label: "Status",
      render: (b) => (
        <button
          className={`px-3 py-1 rounded ${b.isBlocked ? "bg-red-200" : "bg-green-200"
            }`}
          onClick={() =>
            openConfirm(b, b.isBlocked ? "UNBLOCK" : "BLOCK")
          }
        >
          {b.isBlocked ? "Unblock" : "Block"}
        </button>
      ),
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6">Blogs</h1>

      <SearchFilterBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        filters={filters}
        updateFilter={updateFilter}
        filterOptions={{
          status: [
            { label: "All", value: "all" },
            { label: "Active", value: "active" },
            { label: "Blocked", value: "blocked" },
          ],
        }}
      />

      <ReusableTable data={blogs} columns={columns} />

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
