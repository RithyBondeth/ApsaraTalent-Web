import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORE_PERSIST_KEYS } from "../_shared/persist-keys";

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
      name: STORE_PERSIST_KEYS.checkAuth,
      partialize: (state) => ({ isAuth: state.isAuth }),
    },
  ),
);
