import { ADMIN_ROUTES } from "@/components/shared/constants/routes/admin.routes"
import API from "./apiInstance"

export const adminDashboardApi = () => {
    return API.get(ADMIN_ROUTES.DASHBOARD)
}
export const adminFoodieListingApi = (page: number, limit: number, search: string, isBlocked?: string) => {
    return API.get(ADMIN_ROUTES.FOODIE_LIST, { params: { page, limit, search, isBlocked } })
}
export const adminChefListingApi = (page: number, limit: number, search: string, isBlocked?: string, isVerified?: string) => {
    return API.get(ADMIN_ROUTES.CHEF_LIST, { params: { page, limit, search, isBlocked, isVerified } })
}
export const AdminBlockApi = (id: string) => {
    return API.patch(ADMIN_ROUTES.BLOCK(id))
}
export const AdminUnBlockApi = (id: string) => {
    return API.patch(ADMIN_ROUTES.UNBLOCK(id))
}

export const adminVerifyChefApi = (id: string) => {
    return API.patch(ADMIN_ROUTES.CHEF_VERIFY(id))
}
export const adminUnverifyChefApi = (id: string) => {
    return API.patch(ADMIN_ROUTES.CHEF_UNVERIFY(id))
}

export const adminRecipeListingApi = (page: number, limit: number, search: string, isBlocked: string) => {
    return API.get(ADMIN_ROUTES.RECIPE_LIST, { params: { page, limit, search, isBlocked } })
}
export const adminBlockRecipeApi = (id: string) => {
    return API.patch(ADMIN_ROUTES.RECIPE_BLOCK(id));
};

export const adminUnblockRecipeApi = (id: string) => {
    return API.patch(ADMIN_ROUTES.RECIPE_UNBLOCK(id));
};


export const adminBlogListingApi = (page: number, limit: number, search: string, isBlocked: string) => {
    return API.get(ADMIN_ROUTES.BLOG_LIST, { params: { page, limit, search, isBlocked } })
}
export const adminBlockBlogApi = (id: string) => {
    return API.patch(ADMIN_ROUTES.BLOG_BLOCK(id))
}
export const adminUnblockBlogApi = (id: string) => {
    return API.patch(ADMIN_ROUTES.BLOG_UNBLOCK(id))
}

export const adminFoodSpotListingApi = (page: number, limit: number, search: string, isBlocked: string, isApproved: string) => {
    return API.get(ADMIN_ROUTES.FOODIE_LIST, { params: { page, limit, search, isBlocked, isApproved } });
};

export const rejectFoodSpotApi = (id: string, reason: string) => {
    return API.patch(ADMIN_ROUTES.FOODSPOT_REJECT(id), { reason })
}

export const adminBlockFoodSpotApi = (id: string) => {
    return API.patch(ADMIN_ROUTES.FOODSPOT_BLOCK(id));
};

export const adminUnblockFoodSpotApi = (id: string) => {
    return API.patch(ADMIN_ROUTES.FOODSPOT_UNBLOCK(id));
};

export const adminApproveFoodSpotApi = (id: string) => {
    return API.patch(ADMIN_ROUTES.FOODSPOT_APPROVE(id));
};

export const adminUnapproveFoodSpotApi = (id: string) => {
    return API.patch(ADMIN_ROUTES.FOODSPOT_UNAPPROVE(id));
};

export const adminGetDashboardStatsApi = () => {
    return API.get(ADMIN_ROUTES.DASHBOARD_STATS);
};

export const adminGetGrowthDataApi = () => {
    return API.get(ADMIN_ROUTES.GROWTH_DATA);
};
