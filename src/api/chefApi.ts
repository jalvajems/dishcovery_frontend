import API from "./apiInstance"

export const chefDashboardApi=()=>{
    return API.get('/chef/chef-dashboard')
}