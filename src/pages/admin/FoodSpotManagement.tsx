import { useState } from "react";
import { useAdminTable } from "@/components/shared/hooks/useAdminTable";
import SearchFilterBar from "@/components/shared/admin/SearchFilterBar";
import ReusableTable, { type ITableColumn } from "@/components/shared/DataTable";
import Pagination from "@/components/shared/Pagination";
import ConfirmModal from "@/components/shared/ConfirmModal";
import {
    adminBlockFoodSpotApi,
    adminUnblockFoodSpotApi,
    adminApproveFoodSpotApi,
    adminUnapproveFoodSpotApi,
    adminFoodSpotListingApi,
} from "@/api/adminApi";

type FoodSpot = {
    _id: string;
    name: string;
    location: {
        coordinates: number[];
    };
    address: {
        fullAddress: string;
        city: string;
        placeName: string;
    };
    speciality: string[];
    createdAt: string;
    createdAt: string;
    isBlocked: boolean;
    isApproved: boolean;
};

export default function FoodSpotManagement() {
    const {
        data: foodSpots,
        totalPages,
        currentPage,
        setCurrentPage,
        searchInput,
        setSearchInput,
        filters,
        updateFilter,
        refetch,
    } = useAdminTable<FoodSpot>({
        fetchApi: async (page, limit, search, filters) => {
            return adminFoodSpotListingApi(page, limit, search, filters.status, filters.approved);
        },
        filters: [
            { key: "status", defaultValue: "all" },
            { key: "approved", defaultValue: "all" },
        ],
    });
console.log('dataaaaa',foodSpots[0]);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedSpot, setSelectedSpot] = useState<FoodSpot | null>(null);
    const [actionType, setActionType] = useState<"BLOCK" | "UNBLOCK" | "APPROVE" | "UNAPPROVE" | null>(null);

    const openConfirm = (spot: FoodSpot, type: "BLOCK" | "UNBLOCK" | "APPROVE" | "UNAPPROVE") => {
        setSelectedSpot(spot);
        setActionType(type);
        setModalOpen(true);
    };

    const handleConfirm = async () => {
        if (!selectedSpot || !actionType) return;

        try {
            if (actionType === "BLOCK") {
                await adminBlockFoodSpotApi(selectedSpot._id);
            } else if (actionType === "UNBLOCK") {
                await adminUnblockFoodSpotApi(selectedSpot._id);
            } else if (actionType === "APPROVE") {
                await adminApproveFoodSpotApi(selectedSpot._id);
            } else if (actionType === "UNAPPROVE") {
                await adminUnapproveFoodSpotApi(selectedSpot._id);
            }
            refetch();
        } catch (error) {
            console.error(error);
        } finally {
            setModalOpen(false);
        }
    };

    const columns: ITableColumn<FoodSpot>[] = [
        { key: "name", label: "Name" },
        {
            key: "address",
            label: "Location",
            render: (row) => <span>{row.address?.city || row.address?.placeName || "N/A"}</span>,
        },
        {
            key: "speciality",
            label: "Speciality",
            render: (row) => <span>{row.speciality?.join(", ") || "N/A"}</span>,
        },
        {
            key: "createdAt",
            label: "Created At",
            render: (row) =>
                row.createdAt
                    ? new Date(row.createdAt).toLocaleDateString("en-IN")
                    : "N/A",
        },
        {
            key: "isBlocked",
            label: "Status",
            render: (row) => (
                <button
                    className={`px-3 py-1 rounded text-sm font-medium ${row.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                        }`}
                    onClick={() => openConfirm(row, row.isBlocked ? "UNBLOCK" : "BLOCK")}
                >
                    {row.isBlocked ? "Blocked" : "Active"}
                </button>
            ),
        },
        {
            key: "isApproved",
            label: "Approval",
            render: (row) => (
                <button
                    className={`px-3 py-1 rounded text-sm font-medium ${row.isApproved ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"
                        }`}
                    onClick={() => openConfirm(row, row.isApproved ? "UNAPPROVE" : "APPROVE")}
                >
                    {row.isApproved ? "Approved" : "Pending"}
                </button>
            ),
        },
    ];
    

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Food Spot Management</h1>

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
                    approved: [
                        { label: "All", value: "all" },
                        { label: "Approved", value: "approved" },
                        { label: "Pending", value: "pending" },
                    ],
                }}
            />

            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <ReusableTable data={foodSpots} columns={columns} />
            </div>

            <div className="mt-6">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onChange={setCurrentPage}
                />
            </div>

            <ConfirmModal
                isOpen={modalOpen}
                title={
                    actionType === "BLOCK" ? "Block Food Spot" :
                        actionType === "UNBLOCK" ? "Unblock Food Spot" :
                            actionType === "APPROVE" ? "Approve Food Spot" : "Unapprove Food Spot"
                }
                message={`Are you sure you want to ${actionType === "BLOCK" ? "block" :
                        actionType === "UNBLOCK" ? "unblock" :
                            actionType === "APPROVE" ? "approve" : "unapprove"
                    } "${selectedSpot?.name}"?`}
                onConfirm={handleConfirm}
                onCancel={() => setModalOpen(false)}
            />
        </div>
    );
}
