"use client";

import { useThemeStore } from "@/stores/themes/theme-store";
import { TTheme } from "@/utils/types/app";
import { setCookie } from "cookies-next/client";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useEffect } from "react";

/* --------------------------------- Helpers -------------------------------- */
function normalizeTheme(theme: string): TTheme {
  if (theme === "light" || theme === "dark" || theme === "system") {
    return theme;
  }
  return "system";
}

function ThemeSync({ theme }: { theme: TTheme }) {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(theme);
    setCookie("theme", theme);
  }, [theme, setTheme]);

  return null;
}

export function ThemeProviderClient(props: {
  children: React.ReactNode;
  defaultTheme: string;
}) {
  /* ----------------------------- API Integration ---------------------------- */
  const theme = useThemeStore((state) => state.theme);
  const isHydrated = useThemeStore((state) => state.isHydrated);

  /* ---------------------------------- Utils --------------------------------- */
  const fallbackTheme = normalizeTheme(props.defaultTheme);
  const activeTheme = isHydrated ? theme : fallbackTheme;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={fallbackTheme}
      enableSystem
      disableTransitionOnChange
    >
      <ThemeSync theme={activeTheme} />
      {props.children}
    </NextThemesProvider>
  );
}
