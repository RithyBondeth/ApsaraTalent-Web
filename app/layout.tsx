import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/components/utils/languages/language-provider";
import { ThemeProvider } from "@/components/utils/themes/theme-provider";
import { TitleSync } from "@/components/utils/seo/title-sync";
import type { Metadata } from "next";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /*---------------------------------- Main Layout ----------------------------------*/
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body
        className="antialiased"
        style={{
          fontFamily: "var(--font-ubuntu), var(--font-kantumruy), sans-serif",
        }}
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
