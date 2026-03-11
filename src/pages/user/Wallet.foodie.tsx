import { useEffect, useState } from "react";
import { Wallet, Calendar, ArrowDownToLine, TrendingUp, DollarSign } from "lucide-react";



import Footer from "@/components/shared/chef/Footer";
import Pagination from "@/components/shared/Pagination";
import { getFoodieWalletApi } from "@/api/foodieApi";
import { logError } from "@/utils/errorHandler";
import ReusableTable, { type ITableColumn } from "@/components/shared/DataTable";
import FoodieNavbar from "@/components/shared/foodie/Navbar.foodie";

// ---------------- TYPES ----------------
interface FoodieWalletTransaction {
  _id: string;
  amount: number;
  createdAt: string;
  workshopId?: {
    title: string;
    chefId?: {
      name: string;
    }
  };
  type?: string;
  status: string;
}

interface FoodieWalletResponse {
  balance: number;
  pendingBalance: number;
  transactions: FoodieWalletTransaction[];
  stats?: {
    totalCredit: number;
    totalDebit: number;
    totalRefund: number;
  };
  totalPages?: number;
  currentPage?: number;
}

export default function FoodieWalletPage() {
  const [wallet, setWallet] = useState<FoodieWalletResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  const handleGetFoodieWallet = async (page: number) => {
    try {
      const res = await getFoodieWalletApi(page, itemsPerPage)
      setWallet(res.data.data)
      setTotalPages(res.data.data.totalPages || 1);
      setCurrentPage(page);
    } catch (error) {
      logError(error, "Failed to fetch wallet");
    }
  }

  useEffect(() => {
    handleGetFoodieWallet(currentPage)
  }, [currentPage]);

  const columns: ITableColumn<FoodieWalletTransaction>[] = [
    {
      key: "workshopId",
      label: "Workshop",
      render: (row: FoodieWalletTransaction) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${row.type === 'REFUND' ? 'bg-indigo-100' : 'bg-emerald-100'}`}>
            <DollarSign className={`w-5 h-5 ${row.type === 'REFUND' ? 'text-indigo-600' : 'text-emerald-600'}`} />
          </div>
          <div>
            {/* Show Workshop Title ALWAYS, not 'Refund Processed' */}
            <div className="font-semibold text-gray-900">{row.workshopId?.title || 'Unknown Workshop'}</div>
            <div className="text-xs text-gray-500">ID: {row._id.slice(0, 8)}...</div>
          </div>
        </div>
      ),
    },
    {
      key: 'host',
      label: 'Hosted By',
      render: (row: FoodieWalletTransaction) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">
            {row.workshopId?.chefId?.name || 'Unknown Chef'}
          </span>
        </div>
      )
    },
    {
      key: "amount",
      label: "Amount",
      render: (row: FoodieWalletTransaction) => (
        <span className={`text-lg font-bold ${row.type === 'REFUND' ? 'text-indigo-600' : 'text-emerald-600'}`}>
          ₹{row.amount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (row: FoodieWalletTransaction) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${row.type === 'REFUND' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'}`}>
          {row.type === 'REFUND' ? 'Refund' : 'Payment'}
        </span>
      )
    },
    {
      key: "createdAt",
      label: "Date",
      render: (row: FoodieWalletTransaction) => (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          {new Date(row.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: FoodieWalletTransaction) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.status === "SUCCESS" ? "bg-green-100 text-green-700" :
          row.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
          }`}>
          {row.status}
        </span>
      ),
    },
  ];

  if (!wallet) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-emerald-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
      <FoodieNavbar />
      <div className="p-4 md:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Wallet</h1>
          <p className="text-gray-600">Manage your Payments</p>
        </div>

        {/* Wallet Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          {/* Total Payments Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-50 rounded-xl">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-sm text-white-600 font-semibold">Total Payments (Success)</p>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-600">₹</span>
              <h2 className="text-3xl font-bold text-gray-900">
                {wallet?.stats?.totalDebit?.toLocaleString() || 0}
              </h2>
            </div>
            <p className="text-xs text-500">All time</p>
          </div>

          {/* Total Refunds Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-indigo-50 rounded-xl">
                <ArrowDownToLine className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-sm text-white-600 font-semibold">Refunds Received</p>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-600">₹</span>
              <h2 className="text-3xl font-bold text-white">
                {wallet?.stats?.totalRefund?.toLocaleString() || 0}
              </h2>
            </div>
            <p className="text-xs text-indigo-100">Processed Refunds</p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Payments History</h2>
            <p className="text-sm text-gray-600 mt-1">View all your workshop payments</p>
          </div>

          <ReusableTable columns={columns} data={wallet.transactions} />

          {/* Empty State */}
          {wallet?.transactions?.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h3>
              <p className="text-gray-600">Your payments will appear here once you complete workshops</p>
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={(page) => setCurrentPage(page)}
          />
          <Footer />
        </div>
      </div>
    </div>
  );
}