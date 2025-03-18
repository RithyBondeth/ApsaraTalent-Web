import { ThemeProviderClient } from "./theme-provider-client";
import { cookies } from "next/headers";

export async function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = (await cookies()).get("theme")?.value || "system";

  // Passing the default theme as a prop to the client-side theme provider
  return <ThemeProviderClient defaultTheme={theme}>{children}</ThemeProviderClient>;
}