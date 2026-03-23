import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TCheckAuthState = {
  isAuth: boolean;
  setIsAuth: (_isAuth: boolean) => void;
};

export const useCheckAuthStore = create<TCheckAuthState>()(
  persist(
    (set) => ({
      isAuth: false,
      setIsAuth: (_isAuth: boolean) => {
        set({ isAuth: _isAuth });
      },
    }),
    {
      name: "AuthCheckStore",
      partialize: (state) => ({ isAuth: state.isAuth }),
    },
  ),
);
