import React, { useEffect, useState } from "react";
import { Wallet, IndianRupee, Calendar, ArrowDownToLine, TrendingUp, DollarSign, Clock } from "lucide-react";
import { getChefWalletApi } from "@/api/chefApi";
import Pagination from "@/components/shared/Pagination";
import ChefNavbar from "@/components/shared/chef/NavBar.chef";
import Footer from "@/components/shared/chef/Footer";
import { getFoodieWalletApi } from "@/api/foodieApi";

// ---------------- TYPES ----------------
interface ChefWalletTransaction {
  _id: string;
  amount: number;
  createdAt: string;
  workshopId: {
    title: string;
  };
}

interface ChefWalletResponse {
  balance: number;
  pendingBalance: number;
  transactions: ChefWalletTransaction[];
}

export default function FoodieWalletPage() {
  const [wallet, setWallet] = useState<ChefWalletResponse | null>(null);

  const handleGetChefWallet=async()=>{
   const res= await getFoodieWalletApi()
    setWallet(res.data.data)
    
  }

  useEffect(() => {
    handleGetChefWallet()
}, []);

  const totalPayments = wallet?.transactions?.reduce((sum, t) => sum + t.amount, 0) || 0;

  if (!wallet) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-emerald-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
      <ChefNavbar/>
      <div className="p-4 md:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Wallet</h1>
          <p className="text-gray-600">Manage your Payments</p>
        </div>

        {/* Wallet Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Available Balance - Large Card */}
          {/* <div className="lg:col-span-2 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden"> */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
            {/* <div className="relative z-10">
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
            </div> */}
          {/* </div> */}

          {/* Pending Balance Card */}
          {/* <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-50 rounded-xl">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-sm text-gray-600 font-semibold">Pending Balance</p>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-gray-600">₹</span>
              <h2 className="text-3xl font-bold text-gray-900">
                {wallet?.pendingBalance?.toLocaleString()}
              </h2>
            </div>
            <p className="text-xs text-gray-500">Processing payments</p>
          </div> */}

          {/* Total Payments Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-50 rounded-xl">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-sm text-white-600 font-semibold">Total Payments</p>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-600">₹</span>
              <h2 className="text-3xl font-bold text-gray-900">
                {totalPayments?.toLocaleString()}
              </h2>
            </div>
            <p className="text-xs text-500">All time</p>
          </div>
        </div>

        {/* Withdraw Section */}
        {/* <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
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
        </div> */}

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Payments History</h2>
            <p className="text-sm text-gray-600 mt-1">View all your workshop payments</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Workshop
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Payments
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {wallet?.transactions?.map((transaction) => (
                  <tr 
                    key={transaction._id} 
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {transaction?.workshopId?.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {transaction?._id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-bold text-emerald-600">
                          ₹{transaction?.amount?.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(transaction.createdAt)?.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                    {transaction?.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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

          {/* Pagination (if needed) */}
         <Pagination
         
         />
         <Footer/>
        </div>
      </div>
    </div>
  );
}