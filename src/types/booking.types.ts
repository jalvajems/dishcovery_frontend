export interface IBooking {
    _id: string;
    workshopId: string;
    foodieId: {
        _id: string;
        name: string;
        email: string;
        avatar?: string;
    };
    bookingDate: Date | string;
    bookedAt: Date | string;
    status: 'CONFIRMED' | 'CANCELLED' | 'PENDING' | 'CANCELLED_BY_FOODIE' | 'CANCELLED_BY_CHEF' | 'REFUNDED' | 'COMPLETED';
    attendanceStatus: 'PRESENT' | 'ABSENT' | 'PENDING';
    bookingType: 'PAID' | 'FREE';
    amount: number;
    paymentId?: string;
}

export interface IBookingPopulated extends Omit<IBooking, 'workshopId'> {
    workshopId: {
        _id: string;
        id:string
        title: string;
        date: Date | string;
        startTime: string;
        banner?: string;
        images?: string[];
        mode: 'ONLINE' | 'OFFLINE';
        status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'REJECTED' | 'CANCELLED' | 'EXPIRED';
        location?: {
            city: string;
        };
    };
}
