export const SESSION_ROUTES = {
  START: (workshopId: string) => `/sessions/${workshopId}/start`,
  END: (workshopId: string) => `/sessions/${workshopId}/end`,

  JOIN: (workshopId: string) => `/sessions/${workshopId}/join`,
  LEAVE: (workshopId: string) => `/sessions/${workshopId}/leave`,

  INFO: (workshopId: string) => `/sessions/${workshopId}/info`,
} as const;
