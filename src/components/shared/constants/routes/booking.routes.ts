export const BOOKING_ROUTES = {
  BOOK: (workshopId: string) => `/bookings/${workshopId}/book`,
  MY_BOOKINGS: "/bookings/my-bookings",
  CANCEL: (bookingId: string) => `/bookings/${bookingId}/cancel`,
  WORKSHOP_PARTICIPANTS: (workshopId: string) =>
    `/bookings/workshop/${workshopId}/participants`,
} as const;
