import API from "./apiInstance";

export const bookWorkshopApi = (workshopId: string) => {
    return API.post(`/bookings/${workshopId}/book`);
};

export const getMyBookingsApi = () => {
    return API.get("/bookings/my-bookings");
};

export const cancelBookingApi = (bookingId: string) => {
    return API.patch(`/bookings/${bookingId}/cancel`);
};

export const getWorkshopParticipantsApi = (workshopId: string) => {
    return API.get(`/bookings/workshop/${workshopId}/participants`);
};
