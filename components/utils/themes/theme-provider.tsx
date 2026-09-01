import { cookies, headers } from "next/headers";
import { ThemeProviderClient } from "@/components/utils/themes/theme-provider-client";

export async function ThemeProvider(props: { children: React.ReactNode }) {
  /* ---------------------------------- Utils --------------------------------- */
  const theme = (await cookies()).get("theme")?.value || "system";

  /**
   * next-themes writes one inline <script> into the document — the anti-flash
   * snippet that sets light/dark on <html> before first paint. Next.js nonces
   * the scripts IT renders, but not that one, so under the nonce-based CSP in
   * middleware.ts it is the single script on the page that would be blocked.
   *
   * Blocked, the page still works but flashes the wrong theme on every load,
   * which is the exact problem the snippet exists to prevent. `nonce` is
   * threaded through to next-themes, which stamps it onto that script.
   *
   * The value comes from the `x-nonce` request header set in middleware.
   */
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  // Passing the default theme as a prop to the client-side theme provider
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <ThemeProviderClient defaultTheme={theme} nonce={nonce}>
      {props.children}
    </ThemeProviderClient>
  );
}
