export const REVIEW_ROUTES = {
  CREATE: "/foodie/review",

  LIST: "/foodie/review",

  LIKE: (id: string) => `/foodie/review/like/${id}`,
  DISLIKE: (id: string) => `/foodie/review/dislike/${id}`,
} as const;
