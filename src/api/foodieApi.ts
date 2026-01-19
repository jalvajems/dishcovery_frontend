import API from "./apiInstance"

export const userDashboardApi = () => {
    return API.get('/foodie/dashboard')
}


export const getAllRecipesFoodieApi = (page: number, limit: number, search?: string) => {
    return API.get('/foodie/recipe-listing', { params: { page, limit, search } })
}
export const getRecipeDetailFoodieApi = (id: string) => {
    return API.get(`/foodie/recipe-detail/${id}`)
}
export const getRelatedRecipesApi = (cuisine: string) => {
    return API.get(`/foodie/related-recipes/${cuisine}`)
}

export const getSavedRecipeApi = () => {
    return API.get(`/foodie/saved-recipes`)
}


export const getBlogsFoodieApi = (page: number, limit: number, search: string) => {
    return API.get(`/foodie/blog-listing`, { params: { page, limit, search } })
}
export const getFoodieBlogDetailApi = (blogId: string) => {
    return API.get(`/foodie/blog-detail/${blogId}`)
}
export const getRelatedBlogsApi = (tag: string) => {
    return API.get(`/foodie/blog-relate-blogs/${tag}`)
}


export const createFoodieProfileApi = (data: object) => {
    return API.post('/foodie/profile', data)
}
export const updateFoodieProfileApi = (data: object) => {
    return API.put('/foodie/profile', data)
}
export const getFoodieProfileApi = () => {
    return API.get('/foodie/profile')
}


export const addFoodSpotApi = (payload: object) => {
    return API.post('/foodie/foodspot', payload)
}
export const editFoodSpotApi = (id: string, payload: object) => {
    return API.put('/foodie/foodspot', { id, payload })
}
export const getAllFoodSpotApi = (page: number, limit: number, search?: string) => {
    return API.get('/foodie/foodspots', { params: { page, limit, search } })
}
export const getAllMyFoodSpotApi = (page: number, limit: number, search?: string) => {
    return API.get('/foodie/myfoodspots', { params: { page, limit, search } })
}
export const getFoodSpotDetailApi = (spotId: string) => {
    return API.get(`/foodie/foodspot/${spotId}`)
}
