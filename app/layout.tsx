import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/components/utils/languages/language-provider";
import { ThemeProvider } from "@/components/utils/themes/theme-provider";
import { TitleSync } from "@/components/utils/seo/title-sync";
import type { Metadata } from "next";
import { Koh_Santepheap, Roboto_Slab } from "next/font/google";
import "./globals.css";

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-roboto-slab",
});

const kohSantepheap = Koh_Santepheap({
  subsets: ["khmer"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-koh-santepheap",
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
        className={`${robotoSlab.variable} ${kohSantepheap.variable} antialiased`}
        style={{
          fontFamily: "var(--font-roboto-slab), var(--font-koh-santepheap), sans-serif",
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
