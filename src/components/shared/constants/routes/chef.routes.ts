export const CHEF_ROUTES = {
  // Dashboard
  DASHBOARD: "/chef/dashboard",

  // Recipes
  RECIPE_LIST: "/chef/recipes-list",
  RECIPE_DETAIL: (id: string) => `/chef/recipe-detail/${id}`,
  RECIPE_ADD: "/chef/recipe-add",
  RECIPE_EDIT: "/chef/recipe-edit",
  RECIPE_DELETE: (id: string) => `/chef/recipe-delete/${id}`,

  // Blogs
  BLOG_ADD: "/chef/blog-add",
  BLOG_EDIT: (id: string) => `/chef/blog-edit/${id}`,
  BLOG_DETAIL: (id: string) => `/chef/blog-details/${id}`,
  BLOG_DELETE: (id: string) => `/chef/blog-delete/${id}`,
  BLOG_LIST: "/chef/blog-listing",

  // Profile
  PROFILE_GET: "/chef/profile",
  PROFILE_CREATE: "/chef/profile",
  PROFILE_UPDATE: "/chef/profile-edit",

  // Wallet
  WALLET: "/chef/wallet",
} as const;
