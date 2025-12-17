import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IUserStore {
  name: string | null;
  email: string | null;
  image: string | null;
  isVerifiedUser: boolean | null;

  setUserStore: (name: string|null, email: string|null, image: string|null) => void;
  setIsVerifiedUser:(isVerifiedUser:boolean|null)=>void;
  delUserStore: () => void;
}

export const useUserStore = create<IUserStore>()(
  persist(
    (set) => ({
      name: null,
      email: null,
      image: null,
      isVerifiedUser:null,

      setUserStore: (name, email, image) =>
        set({ name, email, image }),
      setIsVerifiedUser:(isVerifiedUser:boolean|null)=>
        set({isVerifiedUser}) ,
      delUserStore: () =>
        set({ name: null, email: null, image: null ,isVerifiedUser:null}),
    }),
    {
      name: "auth-storage",
    }
  )
);
