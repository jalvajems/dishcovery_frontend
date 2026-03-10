import API from "./apiInstance"

export const userDashboardApi=()=>{
    return API.get('/foodie/foodie-dashboard')
}