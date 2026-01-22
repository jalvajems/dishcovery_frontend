export const ADMIN_ROUTES = {

    DASHBOARD: "/admin/admin-dashboard",

  FOODIE_LIST: "/admin/foodie-management",
  BLOCK: (id: string) => `/admin/toggle-block/${id}`,
  UNBLOCK: (id: string) => `/admin/toggle-unblock/${id}`,

  CHEF_LIST: "/admin/chef-management",
  CHEF_VERIFY: (id: string) => `/admin/toggle-verify/${id}`,
  CHEF_UNVERIFY: (id: string) => `/admin/toggle-unVerify/${id}`,

  RECIPE_LIST: "/admin/recipe-management",
  RECIPE_BLOCK: (id: string) => `/admin/recipe-block/${id}`,
  RECIPE_UNBLOCK: (id: string) => `/admin/recipe-unblock/${id}`,

  BLOG_LIST: "/admin/blog-management",
  BLOG_BLOCK: (id: string) => `/admin/blog-block/${id}`,
  BLOG_UNBLOCK: (id: string) => `/admin/blog-unblock/${id}`,

  FOODSPOT_LIST: "/admin/foodspot-management",
  FOODSPOT_APPROVE: (id: string) => `/admin/foodspot-approve/${id}`,
  FOODSPOT_UNAPPROVE: (id: string) => `/admin/foodspot-unapprove/${id}`,
  FOODSPOT_BLOCK: (id: string) => `/admin/foodspot-block/${id}`,
  FOODSPOT_UNBLOCK: (id: string) => `/admin/foodspot-unblock/${id}`,
  FOODSPOT_REJECT: (id: string) => `/admin/foodspot-reject/${id}`,
} as const;
