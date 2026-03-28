import { cookies } from "next/headers";
import { ThemeProviderClient } from "@/components/utils/themes/theme-provider-client";

export async function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = (await cookies()).get("theme")?.value || "system";

  // Passing the default theme as a prop to the client-side theme provider
  return (
    <ThemeProviderClient defaultTheme={theme}>{children}</ThemeProviderClient>
  );
}
