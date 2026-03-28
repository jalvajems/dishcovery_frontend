import API from '@/api/apiInstance';
import { AUTH_ROUTES } from '@/components/shared/constants/routes/auth.routes';

export const signupApi = (signupData: { name: string; email: string; password: string, confirmPass: string, role: string }) => {
    return API.post(AUTH_ROUTES.SIGNUP, signupData)
};
export const loginApi = (LoginData: { email: string; password: string }) => {
    return API.post(AUTH_ROUTES.LOGIN, LoginData)
}

export const googleAuthApi = (googleData: { credential: string; role?: string }) => {
    return API.post(AUTH_ROUTES.GOOGLE_AUTH, googleData);
}

export const adminLoginApi = (LoginData: { email: string; password: string }) => {
    return API.post(AUTH_ROUTES.ADMIN_LOGIN, LoginData)
}
export const forgetPassApi = (email: { email: string }) => {
    return API.post(AUTH_ROUTES.FORGOT_PASSWORD, email)
}

export const resendOtpApi = (email: { email: string | null }) => {
    return API.post(AUTH_ROUTES.RESEND_OTP, email);
}

export const verifySignupOtpApi = (OtpData: { otp: string, email: string | null }) => {
    return API.post(AUTH_ROUTES.VERIFY_SIGNUP_OTP, OtpData)
}
export const verifyForgetOtpApi = (OtpData: { otp: string, email: string | null }) => {
    return API.post(AUTH_ROUTES.VERIFY_FORGOT_OTP, OtpData)
}

export const resetPassApi = (ResetPassData: { email: string | null, newPass: string, confirmPass: string }) => {
    return API.post(AUTH_ROUTES.RESET_PASSWORD, ResetPassData);
}
export const logoutApi = () => {
    return API.post(AUTH_ROUTES.LOGOUT)
}

export const changePasswordApi = (data: { currentPassword: string, newPassword: string, confirmPassword: string }) => {
    return API.post(AUTH_ROUTES.CHANGE_PASSWORD, data);
}

