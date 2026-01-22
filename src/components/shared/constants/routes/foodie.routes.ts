export const FOODIE_ROUTES = {
  // Dashboard
  DASHBOARD: "/foodie/dashboard",

  // Recipes
  RECIPE_LIST: "/foodie/recipe-listing",
  RECIPE_DETAIL: (id: string) => `/foodie/recipe-detail/${id}`,
  RELATED_RECIPES: (cuisine: string) =>
    `/foodie/related-recipes/${cuisine}`,
  SAVED_RECIPES: "/foodie/saved-recipes",

  // Blogs
  BLOG_LIST: "/foodie/blog-listing",
  BLOG_DETAIL: (id: string) => `/foodie/blog-detail/${id}`,
  RELATED_BLOGS: (tag: string) =>
    `/foodie/blog-relate-blogs/${tag}`,

  // Profile
  PROFILE_CREATE: "/foodie/profile",
  PROFILE_UPDATE: "/foodie/profile",
  PROFILE_GET: "/foodie/profile",

  // Food Spots
  FOODSPOT_CREATE: "/foodie/foodspot",
  FOODSPOT_EDIT: "/foodie/foodspot",
  FOODSPOT_LIST: "/foodie/foodspots",
  MY_FOODSPOTS: "/foodie/myfoodspots",
  FOODSPOT_DETAIL: (id: string) => `/foodie/foodspot/${id}`,

  // Wallet
  WALLET: "/foodie/wallet",

  // Chefs
  CHEF_LIST: "/foodie/chefs",
  CHEF_DETAIL: (id: string) => `/foodie/chef/${id}`,
  CHEF_RECIPES: (chefId: string) =>
    `/foodie/chef/${chefId}/recipes`,
  CHEF_BLOGS: (chefId: string) =>
    `/foodie/chef/${chefId}/blogs`,
  CHEF_WORKSHOPS: (chefId: string) =>
    `/foodie/chef/${chefId}/workshops`,
} as const;
