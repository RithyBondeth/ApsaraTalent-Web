"use client";

import { useThemeStore } from "@/stores/themes/theme-store";
import { TTheme } from "@/utils/types/theme.type";
import { setCookie } from "cookies-next/client";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useEffect } from "react";

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

export function ThemeProviderClient({
  children,
  defaultTheme,
}: {
  children: React.ReactNode;
  defaultTheme: string;
}) {
  const theme = useThemeStore((state) => state.theme);
  const isHydrated = useThemeStore((state) => state.isHydrated);
  const fallbackTheme = normalizeTheme(defaultTheme);
  const activeTheme = isHydrated ? theme : fallbackTheme;

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={fallbackTheme}
      enableSystem
      disableTransitionOnChange
    >
      <ThemeSync theme={activeTheme} />
      {children}
    </NextThemesProvider>
  );
}
