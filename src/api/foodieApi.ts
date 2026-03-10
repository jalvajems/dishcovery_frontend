import { FOODIE_ROUTES } from "@/components/shared/constants/routes/foodie.routes";
import API from "./apiInstance";

export const userDashboardApi = () => {
    return API.get(FOODIE_ROUTES.DASHBOARD);
};
//==========
export const getAllRecipesFoodieApi = (
    page: number,
    limit: number,
    search?: string,
    filter?: string
) => {
    return API.get(FOODIE_ROUTES.RECIPE_LIST, {
        params: { page, limit, search, filter },
    });
};

export const getRecentRecipesApi = (limit: number) => {
    return API.get(FOODIE_ROUTES.RECIPE_RECENT, {
        params: { limit },
    });
};

export const getRecipeDetailFoodieApi = (id: string) => {
    return API.get(FOODIE_ROUTES.RECIPE_DETAIL(id));
};

export const getRelatedRecipesApi = (cuisine: string) => {
    return API.get(FOODIE_ROUTES.RELATED_RECIPES(cuisine));
};

export const getSavedRecipeApi = (page: number, limit: number) => {
    return API.get(FOODIE_ROUTES.SAVED_RECIPES, {
        params: { page, limit }
    });
};

//==========
export const getBlogsFoodieApi = (
    page: number,
    limit: number,
    search?: string,
    filter?: string
) => {
    return API.get(FOODIE_ROUTES.BLOG_LIST, {
        params: { page, limit, search, filter },
    });
};

export const getRecentBlogsApi = (limit: number) => {
    return API.get(FOODIE_ROUTES.BLOG_RECENT, {
        params: { limit },
    });
};

export const getFoodieBlogDetailApi = (blogId: string) => {
    return API.get(FOODIE_ROUTES.BLOG_DETAIL(blogId));
};

export const getRelatedBlogsApi = (tag: string) => {
    return API.get(FOODIE_ROUTES.RELATED_BLOGS(tag));
};

export const getSavedBlogsApi = (page: number, limit: number) => {
    return API.get(FOODIE_ROUTES.SAVED_BLOGS, {
        params: { page, limit }
    });
};

export const toggleSaveBlogApi = (blogId: string) => {
    return API.post(FOODIE_ROUTES.TOGGLE_SAVE_BLOG, { blogId });
};

//==========
export const createFoodieProfileApi = (data: object) => {
    return API.post(FOODIE_ROUTES.PROFILE_CREATE, data);
};

export const updateFoodieProfileApi = (data: object) => {
    return API.put(FOODIE_ROUTES.PROFILE_UPDATE, data);
};

export const getFoodieProfileApi = () => {
    return API.get(FOODIE_ROUTES.PROFILE_GET);
};

//==========
export const addFoodSpotApi = (payload: object) => {
    return API.post(FOODIE_ROUTES.FOODSPOT_CREATE, payload);
};

export const editFoodSpotApi = (id: string, payload: object) => {
    return API.put(FOODIE_ROUTES.FOODSPOT_EDIT, {
        id,
        payload,
    });
};

export const getAllFoodSpotApi = (
    page: number,
    limit: number,
    search?: string,
    filter?: string
) => {
    return API.get(FOODIE_ROUTES.FOODSPOT_LIST, {
        params: { page, limit, search, filter },
    });
};

export const getRecentFoodSpotsApi = (limit: number) => {
    return API.get(FOODIE_ROUTES.FOODSPOT_RECENT, {
        params: { limit },
    });
};

export const getAllMyFoodSpotApi = (
    page: number,
    limit: number,
    search?: string
) => {
    return API.get(FOODIE_ROUTES.MY_FOODSPOTS, {
        params: { page, limit, search },
    });
};

export const getFoodSpotDetailApi = (spotId: string) => {
    return API.get(FOODIE_ROUTES.FOODSPOT_DETAIL(spotId));
};

export const getSavedFoodSpotsApi = (page: number, limit: number) => {
    return API.get(FOODIE_ROUTES.SAVED_FOODSPOTS, {
        params: { page, limit }
    });
};

export const toggleSaveFoodSpotApi = (foodSpotId: string) => {
    return API.post(FOODIE_ROUTES.TOGGLE_SAVE_FOODSPOT, { foodSpotId });
};

//==========
export const getFoodieWalletApi = (page = 1, limit = 10) => {
    return API.get(FOODIE_ROUTES.WALLET, { params: { page, limit } });
};

//==========
export const getChefsApi = (
    page: number,
    limit: number,
    search?: string,
    filter?: string
) => {
    return API.get(FOODIE_ROUTES.CHEF_LIST, {
        params: { page, limit, search, filter },
    });
};

export const getChefDetailApi = (id: string) => {
    return API.get(FOODIE_ROUTES.CHEF_DETAIL(id));
};

export const getChefRecipesApi = (
    chefId: string,
    page: number,
    limit: number,
    search: string
) => {
    return API.get(FOODIE_ROUTES.CHEF_RECIPES(chefId), {
        params: { page, limit, search },
    });
};

export const getChefBlogsApi = (
    chefId: string,
    page: number,
    limit: number,
    search: string
) => {
    return API.get(FOODIE_ROUTES.CHEF_BLOGS(chefId), {
        params: { page, limit, search },
    });
};

export const getChefWorkshopsApi = (
    chefId: string,
    page: number,
    limit: number,
    search: string,
    status: string
) => {
    return API.get(FOODIE_ROUTES.CHEF_WORKSHOPS(chefId), {
        params: { page, limit, search, status }
    });
};

//==========
