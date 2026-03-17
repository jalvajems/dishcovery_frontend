import { useNavigate } from "react-router-dom";
import ReusableTable, { type ITableColumn } from "@/components/shared/DataTable";
import SearchFilterBar from "@/components/shared/admin/SearchFilterBar";
import Pagination from "@/components/shared/Pagination";
import { useAdminTable } from "@/hooks/useAdminTable";
import { getAllWorkshopsAdminApi } from "@/api/workshopApi";
import { logError, getErrorMessage } from "@/utils/errorHandler";
import { showError } from "@/utils/toast";
import { Eye } from "lucide-react";

import type { IWorkshopPopulated } from "@/types/workshop.types";

export default function WorkshopManagement() {
    const navigate = useNavigate();

    const {
        data: workshops,
        totalPages,
        currentPage,
        setCurrentPage,
        searchInput,
        setSearchInput,
        filters,
        updateFilter,
    } = useAdminTable<IWorkshopPopulated>({
        fetchApi: async (page, limit, search, filters) => {
            try {
                const response = await getAllWorkshopsAdminApi();
                const allData = response.data.data;

                let filtered = [...allData].sort((a: IWorkshopPopulated, b: IWorkshopPopulated) => {
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateB - dateA;
                });

                if (search) {
                    filtered = filtered.filter((w: IWorkshopPopulated) =>
                        w.title?.toLowerCase().includes(search.toLowerCase()) ||
                        w.chefId?.name?.toLowerCase().includes(search.toLowerCase())
                    );
                }
                if (filters.status && filters.status !== 'all') {
                    filtered = filtered.filter((w: IWorkshopPopulated) => w.status === filters.status);
                }
                if (filters.mode && filters.mode !== 'all') {
                    filtered = filtered.filter((w: IWorkshopPopulated) => w.mode === filters.mode);
                }

                const startIndex = (page - 1) * limit;
                const paginated = filtered.slice(startIndex, startIndex + limit);

                console.log(allData)
                return {
                    data: {
                        data: paginated,
                        total: filtered.length,
                        totalPages: Math.ceil(filtered.length / limit)
                    }
                };
            } catch (error: unknown) {
                logError(error, "Failed to fetch workshops");
                showError(getErrorMessage(error, "Failed to load workshops"));
                return {
                    data: {
                        data: [],
                        total: 0,
                        totalPages: 0
                    }
                };
            }

        },
        filters: [
            { key: "status", defaultValue: "all" },
            { key: "mode", defaultValue: "all" },
        ],
    });
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
            case 'PENDING_APPROVAL': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
            case 'LIVE': return 'bg-purple-100 text-purple-700 border-purple-200 animate-pulse';
            case 'COMPLETED': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    const columns: ITableColumn<IWorkshopPopulated>[] = [
        { key: "title", label: "Title" },
        {
            key: "chefId",
            label: "Chef",
            render: (w) => <span className="font-medium text-gray-900">{w.chefId?.name || 'N/A'}</span>
        },
        {
            key: "mode",
            label: "Mode",
            render: (w) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${w.mode === 'ONLINE' ? 'bg-indigo-50 text-indigo-700' : 'bg-orange-50 text-orange-700'}`}>
                    {w.mode}
                </span>
            )
        },
        {
            key: "price",
            label: "Price",
            render: (w) => w.isFree ? <span className="text-green-600 font-bold">Free</span> : <span>₹{w.price}</span>
        },
        {
            key: "date",
            label: "Date",
            render: (w) => new Date(w.date).toLocaleDateString()
        },
        {
            key: "status",
            label: "Status",
            render: (w) => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(w.status)}`}>
                    {w.status.replace('_', ' ')}
                </span>
            )
        },
        {
            key: "_id",
            label: "Action",
            render: (w) => (
                <button
                    onClick={() => navigate(`/admin-dashboard/workshop-management/${w._id}`)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-green-600 transition-all text-sm font-medium shadow-sm"
                >
                    <Eye className="w-4 h-4" />
                    Details
                </button>
            )
        }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Workshop Management</h1>
                    <p className="text-gray-500 mt-1">Review and approve workshops submitted by chefs.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                    <SearchFilterBar
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                        filters={filters as Record<string, string>}
                        updateFilter={updateFilter}
                        filterOptions={{
                            status: [
                                { label: "All Status", value: "all" },
                                { label: "Pending", value: "PENDING_APPROVAL" },
                                { label: "Approved", value: "APPROVED" },
                                { label: "Rejected", value: "REJECTED" },
                                { label: "Live", value: "LIVE" },
                                { label: "Completed", value: "COMPLETED" },
                                { label: "Expired", value: "EXPIRED" },
                            ],
                            mode: [
                                { label: "All Modes", value: "all" },
                                { label: "Online", value: "ONLINE" },
                                { label: "Offline", value: "OFFLINE" },
                            ],
                        }}
                    />
                </div>

                <ReusableTable data={workshops} columns={columns} />

                <div className="p-6 border-t border-gray-50">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
}
