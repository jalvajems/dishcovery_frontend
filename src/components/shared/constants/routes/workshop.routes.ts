export const WORKSHOP_ROUTES = {

  CHEF_CREATE: "/workshop/chef",
  CHEF_LIST: "/workshop/chef",
  CHEF_UPDATE: (id: string) => `/workshop/chef/${id}`,
  CHEF_SUBMIT: (id: string) => `/workshop/chef/${id}/submit`,
  CHEF_START: (id: string) => `/workshop/chef/${id}/start`,
  CHEF_END: (id: string) => `/workshop/chef/${id}/end`,
  CHECK_CANCEL: (id: string) => `/workshop/${id}/cancel`,

  ADMIN_LIST: "/workshop/admin",
  ADMIN_APPROVE: (id: string) => `/workshop/admin/${id}/approve`,
  ADMIN_REJECT: (id: string) => `/workshop/admin/${id}/reject`,

  APPROVED_LIST: "/workshop/approved",
  GET_BY_ID: (id: string) => `/workshop/${id}`,
} as const;
