import API from '@/api/apiInstance';    

export const signupApi=(signupData:{name:string; email:string; password:string})=>{
    return API.post('/auth/signup',signupData)
};
export const loginApi=(LoginData:{email:string;password:string})=>{
    return API.post('/auth/login',LoginData)
}

export const forgetPassApi=(email:{email:string})=>{
    return API.post('/auth/forgetPassword',email)
}


export const verifyOtpApi=(OtpData:{otp:string,email:string|null})=>{
    return API.post('/auth/otp-verify',OtpData)
}

export const resetPassApi=(ResetPassData:{email:string,newPass:string,confirmPass:string})=>{
    return API.post('/auth/resetPassword',ResetPassData);
}