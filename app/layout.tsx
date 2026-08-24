import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/components/utils/languages/language-provider";
import { ThemeProvider } from "@/components/utils/themes/theme-provider";
import { TitleSync } from "@/components/utils/seo/title-sync";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { FONT_STACK } from "@/utils/constants/ui.constant";
import "@fontsource/kantumruy-pro/khmer-400.css";
import "@fontsource/kantumruy-pro/khmer-700.css";
import "@fontsource/ubuntu/latin-400.css";
import "@fontsource/ubuntu/latin-700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s — Apsara Talent",
    default: "Apsara Talent",
  },
  description: "Professional community for employees and employers",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The document language was hardcoded "en", so a Khmer page was announced by
  // screen readers in an English voice and there was no selector to hang Khmer
  // typography on. LanguageProviderClient keeps it in step after hydration.
  const language =
    (await cookies()).get("language")?.value === "km" ? "km" : "en";

  return (
    /*---------------------------------- Main Layout ----------------------------------*/
    <html lang={language} dir="ltr" suppressHydrationWarning>
      <body
        className="antialiased"
        // Whichever script the page is in leads the stack, so the line box is
        // measured from the font actually drawing the glyphs. Inline because it
        // must be right on first paint; LanguageProviderClient updates it on an
        // in-page switch.
        style={{ fontFamily: FONT_STACK[language] }}
        suppressHydrationWarning
      >
        {/* Language Provider Section */}
        <LanguageProvider>
          {/* Theme Provider Section */}
          <ThemeProvider>
            {children}
            {/* Toast Container Section */}
            <Toaster />
          </ThemeProvider>
        </LanguageProvider>
        {/* Title Section */}
        <TitleSync />
      </body>
    </html>
  );
}
