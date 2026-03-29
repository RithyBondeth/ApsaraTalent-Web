import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/components/utils/languages/language-provider";
import { ThemeProvider } from "@/components/utils/themes/theme-provider";
import { TitleSync } from "@/components/utils/seo/title-sync";
import type { Metadata } from "next";
import { Noto_Sans_Khmer, Ubuntu } from "next/font/google";
import "./globals.css";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  variable: "--font-ubuntu",
});

/* Noto Sans Khmer — same font used by Google Gemini for Khmer script */
const notoSansKhmer = Noto_Sans_Khmer({
  subsets: ["khmer"],
  weight: ["300", "400", "500", "700"],
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
        className={`${ubuntu.variable} ${notoSansKhmer.variable} antialiased`}
        style={{
          fontFamily: "var(--font-ubuntu), var(--font-khmer), sans-serif",
        }}
        suppressHydrationWarning
      >
        {/* Language Provider */}
        <LanguageProvider>
          {/* Theme Provider */}
          <ThemeProvider>{children}</ThemeProvider>
        </LanguageProvider>
        {/* Sync document.title on client-side language toggle */}
        <TitleSync />
        {/* Toast Container */}
        <Toaster />
      </body>
    </html>
  );
}
