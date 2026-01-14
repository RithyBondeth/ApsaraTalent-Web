"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useThemeStore } from "@/stores/themes/theme-store";
import { useEffect, useState } from "react";

export function ThemeProviderClient({
  children,
  defaultTheme,
}: {
  children: React.ReactNode;
  defaultTheme: string;
}) {
  const { theme, setTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // Run this only after the component has mounted
  useEffect(() => {
    setMounted(true);
    if (theme === "system") {
      setTheme(defaultTheme as "light" | "dark" | "system"); // Initialize theme with defaultTheme
    }
  }, [theme, defaultTheme, setTheme]);

  // If not mounted yet, render nothing to avoid hydration mismatch
  if (!mounted) return <>{children}</>;

  return (
    <NextThemesProvider attribute="class" defaultTheme={theme} enableSystem>
      {children}
    </NextThemesProvider>
  );
}
