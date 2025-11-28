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


export const createBlogApi=(data:object)=>{
    return API.post("/chef/blog-add",data)
}
export const editBlogApi=(data:object,blogId:string)=>{
    return API.patch(`/chef/blog-edit/${blogId}`,data)
}
export const getBlogDetailChefApi = (id: string) => {
    return API.get(`/chef/blog-details/${id}`);
};
export const deleteBlogApi=(blogId:string)=>{
    console.log('sdl');
    return API.delete(`/chef/blog-delete/${blogId}`)
}
export const getMyBlogsChefApi = ( page = 1, limit = 10) => {
    return API.get(`/chef/blog-listing`, {
        params: {  page, limit }
    });
};
