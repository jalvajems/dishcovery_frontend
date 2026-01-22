import { BOOKING_ROUTES } from "@/components/shared/constants/routes/booking.routes";
import API from "./apiInstance";

export const bookWorkshopApi = (workshopId: string) => {
    return API.post(BOOKING_ROUTES.BOOK(workshopId));
};

export const getMyBookingsApi = () => {
    return API.get(BOOKING_ROUTES.MY_BOOKINGS);
};

export const cancelBookingApi = (bookingId: string) => {
    return API.patch(BOOKING_ROUTES.CANCEL(bookingId));
};

export const getWorkshopParticipantsApi = (workshopId: string) => {
    return API.get(BOOKING_ROUTES.WORKSHOP_PARTICIPANTS(workshopId));
};
