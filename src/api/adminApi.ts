import API from "./apiInstance"

export const adminDashboardApi = () => {
    return API.get('/admin/admin-dashboard')
}
export const adminFoodieListingApi = (page: number, limit: number, search: string, isBlocked?: string) => {
    return API.get('/admin/foodie-management', { params: { page, limit, search, isBlocked } })
}
export const adminChefListingApi = (page: number, limit: number, search: string, isBlocked?: string, isVerified?: string) => {
    return API.get('/admin/chef-management', { params: { page, limit, search, isBlocked, isVerified } })
}
export const AdminBlockApi = (id: string) => {
    return API.patch(`/admin/toggle-block/${id}`)
}
export const AdminUnBlockApi = (id: string) => {
    return API.patch(`/admin/toggle-unblock/${id}`)
}

export const adminVerifyChefApi = (id: string) => {
    return API.patch(`/admin/toggle-verify/${id}`)
}
export const adminUnverifyChefApi = (id: string) => {
    return API.patch(`/admin/toggle-unVerify/${id}`)
}

export const adminRecipeListingApi=(page: number, limit: number, search: string, isBlocked: string)=>{
    return API.get(`/admin/recipe-management`,{params:{page,limit,search,isBlocked}})
}
export const adminBlockRecipeApi = (id: string) => {
  return API.patch(`/admin/recipe-block/${id}`);
};

export const adminUnblockRecipeApi = (id: string) => {
  return API.patch(`/admin/recipe-unblock/${id}`);
};


export const adminBlogListingApi=(page:number,limit:number,search:string,isBlocked:string)=>{
    return API.get(`/admin/blog-management`,{params:{page,limit,search,isBlocked}})
}
export const adminBlockBlogApi=(id:string)=>{
    return API.patch(`/admin/blog-block/${id}`)
}
export const adminUnblockBlogApi=(id:string)=>{
    return API.patch(`/admin/blog-unblock/${id}`)
}