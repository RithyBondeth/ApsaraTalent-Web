import { TTheme } from "@/utils/types/theme.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  theme: TTheme;
  setTheme: (theme: TTheme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === "light" ? "dark" : "light";
        set({ theme: newTheme });
      },
    }),
    {
      name: "theme-storage", // Persist theme in localStorage
    }
  )
);