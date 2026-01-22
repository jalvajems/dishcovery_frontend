import { CHEF_ROUTES } from "@/components/shared/constants/routes/chef.routes"
import API from "./apiInstance"

export const chefDashboardApi = () => {
    return API.get(CHEF_ROUTES.DASHBOARD)
}


export const getAllRecipeApi = (page: number, limit: number, search = '') => {
    return API.get(CHEF_ROUTES.RECIPE_LIST, { params: { page, limit, search } })
}
export const getRecipeDetailApi = (id: string) => {
    return API.get(CHEF_ROUTES.RECIPE_DETAIL(id))
}
export const addRecipePageApi = (recipeData: object) => {
    return API.post(CHEF_ROUTES.RECIPE_ADD, recipeData)
}
export const editRecipePageApi = (data: { recipeId: string, recipeData: object }) => {
    return API.put(CHEF_ROUTES.RECIPE_EDIT, data)
}
export const deleteRecipeApi = (id: string) => {
    return API.delete(CHEF_ROUTES.RECIPE_DELETE(id))
}


export const createBlogApi = (data: object) => {
    return API.post(CHEF_ROUTES.BLOG_ADD, data)
}
export const editBlogApi = (data: object, blogId: string) => {
    return API.patch(CHEF_ROUTES.BLOG_EDIT(blogId), data)
}
export const getBlogDetailChefApi = (id: string) => {
    return API.get(CHEF_ROUTES.BLOG_DETAIL(id));
};
export const deleteBlogApi = (blogId: string) => {
    return API.delete(CHEF_ROUTES.BLOG_DELETE(blogId))
}
export const getMyBlogsChefApi = (page = 1, limit = 10, search = '') => {
    return API.get(CHEF_ROUTES.BLOG_LIST, {
        params: { page, limit, search }
    });
};


export const getChefProfileApi = () => {
    return API.get(CHEF_ROUTES.PROFILE_GET);
}
export const updateChefProfileApi = (payload: object) => {
    return API.put(CHEF_ROUTES.PROFILE_UPDATE, payload)
}
export const createChefProfileApi = (payload: object) => {
    return API.post(CHEF_ROUTES.PROFILE_CREATE, payload)
}

export const getChefWalletApi=()=>{
    return API.get(CHEF_ROUTES.WALLET)
}