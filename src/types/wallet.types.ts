export interface ChefWalletTransaction {
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

export interface ChefWalletResponse {
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
