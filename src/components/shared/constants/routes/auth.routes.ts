export const AUTH_ROUTES = {
  SIGNUP: "/auth/signup",
  LOGIN: "/auth/login",
  ADMIN_LOGIN: "/auth/admin-login",
  GOOGLE_AUTH: "/auth/google-auth",

  FORGOT_PASSWORD: "/auth/forgetPassword",
  RESET_PASSWORD: "/auth/resetPassword",

  RESEND_OTP: "/auth/resend-otp",

  VERIFY_SIGNUP_OTP: "/auth/signup-otp-verify",
  VERIFY_FORGOT_OTP: "/auth/forget-otp-verify",

  LOGOUT: "/auth/logout",
  CHANGE_PASSWORD: "/auth/change-password",
} as const;
