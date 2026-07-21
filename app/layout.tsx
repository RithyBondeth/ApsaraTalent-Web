import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/components/utils/languages/language-provider";
import { ThemeProvider } from "@/components/utils/themes/theme-provider";
import { TitleSync } from "@/components/utils/seo/title-sync";
import type { Metadata } from "next";
import { Preahvihear, Ubuntu } from "next/font/google";
import "./globals.css";

const ubuntuFont = Ubuntu({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-ubuntu",
});

const preahvihearFont = Preahvihear({
  subsets: ["khmer"],
  weight: ["400"],
  display: "swap",
  variable: "--font-preahvihear",
});

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
        className={`${ubuntuFont.variable} ${preahvihearFont.variable} antialiased`}
        style={{
          fontFamily: "var(--font-ubuntu), var(--font-preahvihear), sans-serif",
        }}
        suppressHydrationWarning
      >
        {/* Language Provider Section */}
        <LanguageProvider>
          {/* Theme Provider Section */}
          <ThemeProvider>{children}</ThemeProvider>
        </LanguageProvider>
        {/* Title Section: Sync document.title on client-side language toggle */}
        <TitleSync />
        {/* Toast Container Section */}
        <Toaster />
      </body>
    </html>
  );
}
