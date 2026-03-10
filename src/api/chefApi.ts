import API from "./apiInstance"

export const chefDashboardApi=()=>{
    return API.get('/chef/dashboard')
}
export const getAllRecipeApi=(id:string,page:number,limit:number,search?:string)=>{
    return API.get(`/chef/recipes-list?chefId=${id}`,{params:{page,limit,search}})
}
export const getRecipeDetailApi=(id:string)=>{
    return API.get(`/chef/recipe-detail/${id}`)
}
export const addRecipePageApi=(recipeData:object)=>{
    return API.post(`/chef/recipe-add`,recipeData)
}
export const editRecipePageApi=(data:{recipeId:string,recipeData:object})=>{
    return API.put(`/chef/recipe-edit`,data)
}
export const deleteRecipeApi=(id:string)=>{
    return API.delete(`/chef/recipe-delete/${id}`)
}