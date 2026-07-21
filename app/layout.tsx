import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/components/utils/languages/language-provider";
import { ThemeProvider } from "@/components/utils/themes/theme-provider";
import { TitleSync } from "@/components/utils/seo/title-sync";
import type { Metadata } from "next";
import { Source_Sans_3, Suwannaphum } from "next/font/google";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-source-sans",
});

const suwannaphum = Suwannaphum({
  subsets: ["khmer"],
  weight: ["300", "400", "700", "900", "100"],
  display: "swap",
  variable: "--font-khmer",
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
        className={`${sourceSans.variable} ${suwannaphum.variable} antialiased`}
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
