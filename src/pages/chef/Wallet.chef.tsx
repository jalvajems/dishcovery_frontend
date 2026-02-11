import { useEffect, useState } from "react";
import { Wallet, IndianRupee, Calendar, ArrowDownToLine, DollarSign } from "lucide-react";
import { getChefWalletApi } from "@/api/chefApi";
import { getErrorMessage, logError } from "@/utils/errorHandler";
import Pagination from "@/components/shared/Pagination";
import { showError } from "@/utils/toast";
import ChefNavbar from "@/components/shared/chef/NavBar.chef";
import Footer from "@/components/shared/chef/Footer";
import ReusableTable, { type ITableColumn } from "@/components/shared/DataTable";

// ---------------- TYPES ----------------
interface ChefWalletTransaction {
  _id: string;
  amount: number;
  createdAt: string;
  workshopId: {
    title: string;
  };
  bookingId?: {
    foodieId?: {
      name: string;
      email: string;
    }
  };
  type?: string;
  status: string;
}

interface ChefWalletResponse {
  balance: number;
  pendingBalance: number;
  transactions: ChefWalletTransaction[];
  stats?: {
    totalCredit: number;
    totalDebit: number;
    totalRefund: number;
  };
  totalPages?: number;
  currentPage?: number;
}

export default function ChefWalletPage() {
  const [wallet, setWallet] = useState<ChefWalletResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 8;

  const handleGetChefWallet = async (page: number) => {
    try {
      const res = await getChefWalletApi(page, itemsPerPage)
      setWallet(res.data.data)
      setTotalPages(res.data.totalPages || 1);
      setCurrentPage(page);
    } catch (error: unknown) {
      logError(error);
      showError(getErrorMessage(error, "Failed to fetch wallet"));
    }
  }

  useEffect(() => {
    handleGetChefWallet(currentPage)
  }, [currentPage]);

  const columns: ITableColumn<ChefWalletTransaction>[] = [
    {
      key: "workshopId",
      label: "Workshop",
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${row.type === 'REFUND' || row.type === 'DEBIT' ? 'bg-indigo-100' : 'bg-emerald-100'}`}>
            <DollarSign className={`w-5 h-5 ${row.type === 'REFUND' || row.type === 'DEBIT' ? 'text-indigo-600' : 'text-emerald-600'}`} />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{row.workshopId?.title || 'Unknown Workshop'}</div>
            <div className="text-xs text-gray-500">ID: {row._id.slice(0, 8)}...</div>
          </div>
        </div>
      ),
    },
    {
      key: "userId",
      label: "User",
      render: (row: any) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">
            {row.bookingId?.foodieId?.name || 'Unknown User'}
          </span>
          <span className="text-xs text-gray-500">
            {row.bookingId?.foodieId?.email}
          </span>
        </div>
      )
    },
    {
      key: "amount",
      label: "Amount",
      render: (row) => (
        <span className={`text-lg font-bold ${row.type === 'REFUND' || row.type === 'DEBIT' ? 'text-red-600' : 'text-emerald-600'}`}>
          ₹{row.amount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (row: any) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${row.type === 'CREDIT' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
          {row.type}
        </span>
      )
    },
    {
      key: "createdAt",
      label: "Date",
      render: (row) => (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          {new Date(row.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
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
      <ChefNavbar />
      <div className="p-4 md:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Wallet</h1>
          <p className="text-gray-600">Manage your earnings and withdrawals</p>
        </div>

        {/* Wallet Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Available Balance - Large Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-emerald-100 font-medium">Available Balance</p>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <IndianRupee className="w-8 h-8 mb-1" />
                <h1 className="text-5xl font-bold">{wallet?.balance?.toLocaleString()}</h1>
              </div>
              <p className="text-emerald-100 text-sm mt-4">Ready to withdraw</p>
            </div>
          </div>



          {/* Refunds Given Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-indigo-50 rounded-xl">
                <ArrowDownToLine className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-sm text-gray-600 font-semibold">Refunds Given</p>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-gray-600">₹</span>
              <h2 className="text-3xl font-bold text-gray-900">
                {wallet?.stats?.totalRefund?.toLocaleString() || 0}
              </h2>
            </div>
            <p className="text-xs text-gray-500">Deducted from earnings</p>
          </div>
        </div>

        {/* Withdraw Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Ready to withdraw?</h3>
              <p className="text-sm text-gray-600">
                Transfer your available balance to your bank account
              </p>
            </div>
            <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 py-3 font-semibold transition-colors shadow-lg shadow-emerald-600/20">
              <ArrowDownToLine className="w-5 h-5" />
              Withdraw Funds
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Earnings History</h2>
            <p className="text-sm text-gray-600 mt-1">View all your workshop earnings</p>
          </div>

          <ReusableTable columns={columns} data={wallet.transactions} />

          {/* Empty State */}
          {wallet?.transactions?.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h3>
              <p className="text-gray-600">Your earnings will appear here once you complete workshops</p>
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
        <Footer />
      </div>
    </div>
  );
}