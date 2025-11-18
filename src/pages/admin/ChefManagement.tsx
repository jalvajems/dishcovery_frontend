import { useEffect, useState } from "react";
import ReusableTable, { type ITableColumn } from "@/components/reusable/admin/DataTable";
import Pagination from "@/components/reusable/admin/Pagination";
import { Search, ChevronDown } from "lucide-react";
import {
  AdminBlockApi,
  AdminUnBlockApi,
  adminChefListingApi,
  adminVerifyChefApi,
  adminUnverifyChefApi
} from "@/api/adminApin";
import ConfirmModal from "@/components/reusable/ConfirmModal";

type Chef = {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  isBlocked: boolean;
  isVerified: boolean;
};

export default function ChefManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedChef, setSelectedChef] = useState<Chef | null>(null);
  const [actionType, setActionType] = useState<"BLOCK" | "UNBLOCK" | "VERIFY" | "UNVERIFY" | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [verifyFilter, setVerifyFilter] = useState("all");

  const limit = 5;

  const openConfirmModal = (
    chef: Chef,
    type: "BLOCK" | "UNBLOCK" | "VERIFY" | "UNVERIFY"
  ) => {
    setSelectedChef(chef);
    setActionType(type);
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedChef || !actionType) return;

    try {
      if (actionType === "BLOCK") {
        await AdminBlockApi(selectedChef._id);
      } else if (actionType === "UNBLOCK") {
        await AdminUnBlockApi(selectedChef._id);
      } else if (actionType === "VERIFY") {
        await adminVerifyChefApi(selectedChef._id);
      } else if (actionType === "UNVERIFY") {
        await adminUnverifyChefApi(selectedChef._id);
      }

      setModalOpen(false);
      setSelectedChef(null);
      await handleGetChefs(); 
    } catch (err) {
      console.error(err);
    }
  };

  const modalText = {
    BLOCK: { title: "Block this Chef?", message: "The chef will be prevented from accessing the platform." },
    UNBLOCK: { title: "Unblock this Chef?", message: "This restores platform access for the chef." },
    VERIFY: { title: "Verify this Chef?", message: "This chef will be marked as verified." },
    UNVERIFY: { title: "Remove Verification?", message: "The chef will no longer be verified." }
  };

  const formatDate = (dt: string) => {
    return new Date(dt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleGetChefs = async () => {
    const isBlocked =
    filterStatus === "all" ? "" : filterStatus === "blocked" ? "true" : "false";

  const isVerified =
    verifyFilter === "all"
      ? ""
      : verifyFilter === "verified"
      ? "true"
      : "false";

  const res = await adminChefListingApi(
    currentPage,
    limit,
    searchQuery,
    isBlocked,
    isVerified
  );


    setChefs(res.data.data);
    setTotalPages(res.data.totalPages);
  };

  useEffect(() => {
    handleGetChefs();
  }, [currentPage, searchQuery, filterStatus, verifyFilter]);

  const columns: ITableColumn<Chef>[] = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },

    {
      key: "createdAt",
      label: "Joined",
      render: (chef) => <span>{formatDate(chef.createdAt)}</span>,
    },

    {
      key: "status",
      label: "Status",
      render: (chef) => (
        <button
          onClick={() =>
            openConfirmModal(chef, chef.isBlocked ? "UNBLOCK" : "BLOCK")
          }
          className={`px-3 py-1 rounded text-sm font-medium 
            ${chef.isBlocked ? "bg-red-200 text-red-700" : "bg-green-200 text-green-700"}
          `}
        >
          {chef.isBlocked ? "Unblock" : "Block"}
        </button>
      ),
    },

    {
      key: "isVerified",
      label: "Verified",
      render: (chef) => (
        <button
          onClick={() =>
            openConfirmModal(chef, chef.isVerified ? "UNVERIFY" : "VERIFY")
          }
          className={`px-3 py-1 rounded text-sm font-medium 
            ${chef.isVerified ? "bg-blue-200 text-blue-700" :"bg-red-200 text-red-700" }
          `}
        >
          {chef.isVerified ? "Unverify" : "Verify"}
        </button>
      ),
    },
  ];

  return (
    <div className="p-8 space-y-6">

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 text-gray-400" size={18} />
          <input
            className="border pl-8 pr-4 py-2 rounded-lg w-72"
            placeholder="Search chefs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="border px-3 py-2 rounded-lg"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="blocked">Blocked</option>
          <option value="active">Active</option>
        </select>

        <select
          className="border px-3 py-2 rounded-lg"
          value={verifyFilter}
          onChange={(e) => setVerifyFilter(e.target.value)}
        >
          <option value="all">All Verified</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>

      <ReusableTable columns={columns} data={chefs} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={setCurrentPage}
      />

      <ConfirmModal
        isOpen={modalOpen}
        title={actionType ? modalText[actionType].title : ""}
        message={actionType ? modalText[actionType].message : ""}
        onCancel={() => setModalOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
