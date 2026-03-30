import { TTheme } from "@/utils/types/app";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORE_PERSIST_KEYS } from "../shared/persist-keys";

/* ----------------------------- Store State ----------------------------- */
type TThemeState = {
  theme: TTheme;
  setTheme: (theme: TTheme) => void;
  toggleTheme: () => void;
  systemTheme: "light" | "dark";
  isHydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
};

/* -------------------------------- Store -------------------------------- */
export const useThemeStore = create<TThemeState>()(
  persist(
    (set, get) => {
      // Function to detect system dark mode (only on client-side)
      const getSystemTheme = () => {
        if (typeof window !== "undefined") {
          return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
        }
        return "light";
      };

      return {
        theme: "system",
        systemTheme: getSystemTheme(),
        isHydrated: false,
        setHydrated: (hydrated: boolean) => set({ isHydrated: hydrated }),

        setTheme: (theme: TTheme) => set({ theme }),

        toggleTheme: () => {
          const currentTheme = get().theme;
          const effectiveTheme =
            currentTheme === "system" ? get().systemTheme : currentTheme;
          const newTheme: TTheme = effectiveTheme === "dark" ? "light" : "dark";

          set({ theme: newTheme });
        },
      };
    },
    {
      name: STORE_PERSIST_KEYS.theme,
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

/* ----------------------------- System Theme Listener ----------------------------- */
if (typeof window !== "undefined") {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const updateSystemTheme = () => {
    useThemeStore.setState({
      systemTheme: mediaQuery.matches ? "dark" : "light",
    });
  };
  mediaQuery.addEventListener("change", updateSystemTheme);
}
