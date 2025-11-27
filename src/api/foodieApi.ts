import API from "./apiInstance"

export const userDashboardApi=()=>{
    return API.get('/foodie/dashboard')
}
export const getAllRecipesFoodieApi=(page:number,limit:number,search?:string)=>{    
    return API.get('/foodie/recipe-listing',{params:{page,limit,search}})
}
export const getRecipeDetailFoodieApi=(id:string)=>{
    return API.get(`/foodie/recipe-detail/${id}`)
}
export const getRelatedRecipesApi=(cuisine:string)=>{
    return API.get(`/foodie/related-recipes/${cuisine}`)
}