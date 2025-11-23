import API from "./apiInstance"

export const chefDashboardApi=()=>{
    return API.get('/chef/dashboard')
}
export const getAllRecipeApi=(id:string)=>{
    return API.get(`/chef/recipes-list?chefId=${id}`)
}
export const getRecipeDetailApi=(id:string)=>{
    return API.get(`/chef/recipe-detail/${id}`)
}