import { TTheme } from "@/utils/types/app";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORE_PERSIST_KEYS } from "../_shared/persist-keys";

interface ThemeState {
  theme: TTheme;
  setTheme: (theme: TTheme) => void;
  toggleTheme: () => void;
  systemTheme: "light" | "dark"; // Track system preference
  isHydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => {
      // Function to detect system dark mode (only on client-side)
      const getSystemTheme = () => {
        if (typeof window !== "undefined") {
          return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
        }
        return "light"; // Default to light theme server-side
      };

      return {
        theme: "system", // Default theme
        systemTheme: getSystemTheme(),
        isHydrated: false,
        setHydrated: (hydrated: boolean) => set({ isHydrated: hydrated }),

        setTheme: (theme) => set({ theme }),

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

// Listen for system theme changes (only in client-side)
if (typeof window !== "undefined") {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const updateSystemTheme = () => {
    useThemeStore.setState({
      systemTheme: mediaQuery.matches ? "dark" : "light",
    });
  };
  mediaQuery.addEventListener("change", updateSystemTheme);
}
