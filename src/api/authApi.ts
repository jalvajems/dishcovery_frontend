import API from '@/api/apiInstance';

export const signupApi = (signupData: { name: string; email: string; password: string, confirmPass: string, role: string }) => {
    return API.post('/auth/signup', signupData)
};
export const loginApi = (LoginData: { email: string; password: string }) => {
    return API.post('/auth/login', LoginData)
}

export const forgetPassApi = (email: { email: string }) => {
    return API.post('/auth/forgetPassword', email)
}

export const resendOtpApi = (email: { email: string | null }) => {
    return API.post('/auth/resend-otp', email);
}

export const verifySignupOtpApi = (OtpData: { otp: string, email: string | null }) => {
    return API.post('/auth/signup-otp-verify', OtpData)
}
export const verifyForgetOtpApi = (OtpData: { otp: string, email: string | null }) => {
    return API.post('/auth/forget-otp-verify', OtpData)
}

export const resetPassApi = (ResetPassData: { email: string | null, newPass: string, confirmPass: string }) => {
    return API.post('/auth/resetPassword', ResetPassData);
}
export const logoutApi = () => {
    return API.post('/auth/logout')
}

