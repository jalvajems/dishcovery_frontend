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
  setOtpData: (email: string, type: "signup" | "forgotPassword") => void;
  clearOtpData: () => void;
}

export const useOtpStore = create<OtpState>()(
  persist(
    (set) => ({
      email: null,
      type: null,

      setOtpData: (email, type) => set({ email, type }),
      clearOtpData: () => set({ email: null, type: null }),
    }),
    { name: "otp-store" }
  )
);
