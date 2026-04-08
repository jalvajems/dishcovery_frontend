import { create } from 'zustand';
import { persist } from 'zustand/middleware'
import type { AuthState } from './IAuthStore';

export const useAuthStore = create<AuthState>()(persist((set) => ({
  token: null,
  user: null,
  role: null,

  login: (token, user) => set({ token, user, role: user.role }),
  logout: () => set({ token: null, user: null, role: null }),



}),
  {
    name: 'auth-storage',
  }
));

interface OtpState {
  email: string | null;
  type: "signup" | "forgotPassword" | null;
  otpExpiry: number | null;
  setOtpData: (email: string, type: "signup" | "forgotPassword") => void;
  clearOtpData: () => void;
  setOtpExpiry: (expiry: number | null) => void;
}

export const useOtpStore = create<OtpState>()(
  persist(
    (set) => ({
      email: null,
      type: null,
      otpExpiry: null,

      setOtpData: (email, type) => {
        const otpExpiry = Date.now() + 60 * 1000;
        set({ email, type, otpExpiry });
      },
      clearOtpData: () => set({ email: null, type: null, otpExpiry: null }),
      setOtpExpiry: (otpExpiry) => set({ otpExpiry }),
    }),
    { name: "otp-store" }
  )
);
