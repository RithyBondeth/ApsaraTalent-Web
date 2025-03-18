import { TTheme } from "@/utils/types/theme.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  theme: TTheme;
  setTheme: (theme: TTheme) => void;
  toggleTheme: () => void;
  systemTheme: "light" | "dark"; // Track system preference
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => {
      // Function to detect system dark mode (only on client-side)
      const getSystemTheme = () => {
        if (typeof window !== "undefined") {
          return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }
        return "light"; // Default to light theme server-side
      };

      return {
        theme: "system", // Default theme
        systemTheme: getSystemTheme(), 
        
        setTheme: (theme) => set({ theme }),

        toggleTheme: () => {
          const currentTheme = get().theme;
          let newTheme: TTheme;

          if (currentTheme === "light") newTheme = "dark";
          else if (currentTheme === "dark") newTheme = "light";
          else newTheme = getSystemTheme(); // If "system", switch to detected theme

          set({ theme: newTheme });
        },
      };
    },
    {
      name: "theme-storage",
    }
  )
);

// Listen for system theme changes (only in client-side)
if (typeof window !== "undefined") {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const updateSystemTheme = () => {
    useThemeStore.setState({ systemTheme: mediaQuery.matches ? "dark" : "light" });
  };
  mediaQuery.addEventListener("change", updateSystemTheme);
}