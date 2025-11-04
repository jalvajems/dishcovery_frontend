import API from '@/api/apiInstance';    

export const signupApi=(data:{name:string; email:string; password:string})=>{
    return API.post('/auth/signup',data)
};