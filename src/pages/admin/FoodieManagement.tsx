import { useEffect, useState } from "react";
import ReusableTable, { type ITableColumn } from "@/components/reusable/admin/DataTable";
import Pagination from "@/components/reusable/admin/Pagination";
import { Search } from "lucide-react";
import {
  adminFoodieListingApi,
  AdminBlockApi,
  AdminUnBlockApi,
} from "@/api/adminApin";
import ConfirmModal from "@/components/reusable/ConfirmModal";

type User = {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  isBlocked: boolean;
};

export default function FoodieManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [foodies, setFoodies] = useState<User[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [totalPages, setTotalPages] = useState(1);

  const [limit] = useState(5);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<"BLOCK" | "UNBLOCK" | null>(null);

  const handleGetData = async () => {
    const res = await adminFoodieListingApi(
      currentPage,
      limit,
      searchQuery,
      filterStatus

    );
    setFoodies(res.data.data);
    setTotalPages(res.data.totalPages);

  };

  useEffect(() => {
    handleGetData();
  }, [currentPage, searchQuery, filterStatus]);

  const formatDate = (dt: string) => {
    return new Date(dt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const askConfirmation = (user: User, type: "BLOCK" | "UNBLOCK") => {
    setSelectedUser(user);
    setActionType(type);
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedUser || !actionType) return;

    if (actionType === "BLOCK") {
      await AdminBlockApi(selectedUser._id);
    } else {
      await AdminUnBlockApi(selectedUser._id);
    }

    setModalOpen(false);
    setSelectedUser(null);
    handleGetData(); 
  };

  const columns: ITableColumn<User>[] = [
    { key: "name", label: "Name" },
    {
      key: "email",
      label: "Email",
      render: (u) => <span className="text-green-600 font-medium">{u.email}</span>,
    },
    {
      key: "createdAt",
      label: "Join Date",
      render: (u) => <span className="text-green-600 font-medium">{formatDate(u.createdAt)}</span>,
    },
    {
      key: "isBlocked",
      label: "Status",
      render: (u) => (
        <button
          onClick={() =>
            askConfirmation(u, u.isBlocked ? "UNBLOCK" : "BLOCK")
          }
          className={`px-4 py-1 rounded-lg font-semibold ${
            u.isBlocked
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {u.isBlocked ? "Blocked" : "Active"}
        </button>
      ),
    },
    {
      key: "view",
      label: "View",
      render: (u) => (
        <button className="text-green-600 font-medium"
          onClick={() => console.log("View details of user", u)}
        >
          Details
        </button>
      ),
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
        Foodies
      </h1>
      <div className="flex items-center gap-4 mb-4">
  {/* Search */}
  <div className="relative">
    <Search className="absolute left-2 top-2 text-gray-400" size={18} />
    <input
      className="border pl-8 pr-3 py-2 rounded-lg"
      placeholder="Search..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>

  {/* Filter Dropdown */}
  <select
    className="border px-3 py-2 rounded-lg"
    value={filterStatus}
    onChange={(e) => setFilterStatus(e.target.value)}
  >
    <option value="all">All</option>
    <option value="false">Active</option>
    <option value="true">Blocked</option>
  </select>
</div>


      <ReusableTable columns={columns} data={foodies} actions={[]} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={setCurrentPage}
      />

      {/* Reusable Confirmation Modal */}
      <ConfirmModal
        isOpen={modalOpen}
        title={
          actionType === "BLOCK"
            ? "Block this user?"
            : "Unblock this user?"
        }
        message={
          actionType === "BLOCK"
            ? "The user will not be able to log in."
            : "The user will regain full access."
        }
        onConfirm={handleConfirm}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}
