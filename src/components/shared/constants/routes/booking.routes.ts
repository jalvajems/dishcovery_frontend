export const BOOKING_ROUTES = {
  BOOK: (workshopId: string) => `/bookings/${workshopId}/book`,
  MY_BOOKINGS: "/bookings/my-bookings",
  CANCEL: (id: string) => `/bookings/${id}/cancel`,
  WORKSHOP_PARTICIPANTS: (id: string) => `/bookings/workshop/${id}/participants`,
  MARK_ATTENDANCE: (id: string) => `/bookings/${id}/attendance`,
} as const;
