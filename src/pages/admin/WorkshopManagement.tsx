import { useNavigate } from "react-router-dom";
import ReusableTable, { type ITableColumn } from "@/components/shared/DataTable";
import SearchFilterBar from "@/components/shared/admin/SearchFilterBar";
import Pagination from "@/components/shared/Pagination";
import { useAdminTable } from "@/components/shared/hooks/useAdminTable";
import { getAllWorkshopsAdminApi } from "@/api/workshopApi";
import { Eye } from "lucide-react";

type Workshop = {
    _id: string;
    title: string;
    chefId: {
        _id: string;
        name: string;
    };
    mode: "ONLINE" | "OFFLINE";
    price: number;
    isFree: boolean;
    date: string;
    status: string;
};

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
    } = useAdminTable<Workshop>({
        fetchApi: async (page, limit, search, filters) => {
            // Backend getAllWorkshops for admin currently doesn't support pagination in the implemented service
            // but I added it to the repository and service to return all. 
            // I'll adjust the API call to match the backend implementation.
            const response = await getAllWorkshopsAdminApi();
            const allData = response.data.data;

            // Client-side filtering/pagination for now if backend doesn't support yet
            let filtered = allData;
            if (search) {
                filtered = filtered.filter((w: any) =>
                    w.title.toLowerCase().includes(search.toLowerCase()) ||
                    w.chefId?.name.toLowerCase().includes(search.toLowerCase())
                );
            }
            if (filters.status && filters.status !== 'all') {
                filtered = filtered.filter((w: any) => w.status === filters.status);
            }
            if (filters.mode && filters.mode !== 'all') {
                filtered = filtered.filter((w: any) => w.mode === filters.mode);
            }

            const startIndex = (page - 1) * limit;
            const paginated = filtered.slice(startIndex, startIndex + limit);

            return {
                data: {
                    data: paginated,
                    total: filtered.length,
                    totalPages: Math.ceil(filtered.length / limit)
                }
            };
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

    const columns: ITableColumn<Workshop>[] = [
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
                        filters={filters}
                        updateFilter={updateFilter}
                        filterOptions={{
                            status: [
                                { label: "All Status", value: "all" },
                                { label: "Pending", value: "PENDING_APPROVAL" },
                                { label: "Approved", value: "APPROVED" },
                                { label: "Rejected", value: "REJECTED" },
                                { label: "Live", value: "LIVE" },
                                { label: "Completed", value: "COMPLETED" },
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
