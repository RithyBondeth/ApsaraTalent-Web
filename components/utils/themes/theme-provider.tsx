import { ThemeProviderClient } from "./theme-provider-client";
import { cookies } from "next/headers";

export async function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = (await cookies()).get("theme")?.value || "system";

  return <ThemeProviderClient defaultTheme={theme}>{children}</ThemeProviderClient>;
}