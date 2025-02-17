"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useThemeStore } from "@/stores/theme-store";
import { useEffect, useState } from "react";

export function ThemeProviderClient({ children, defaultTheme }: { children: React.ReactNode; defaultTheme: string }) {
  const { theme, setTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (theme === "system") {
      setTheme(defaultTheme as "light" | "dark" | "system");
    }
  }, [theme, defaultTheme, setTheme]);

  if (!mounted) return <>{children}</>;

  return (
    <NextThemesProvider attribute="class" defaultTheme={theme} enableSystem>
      {children}
    </NextThemesProvider>
  );
}