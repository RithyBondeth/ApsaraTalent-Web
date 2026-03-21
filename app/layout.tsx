import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/components/utils/languages/language-provider";
import { ThemeProvider } from "@/components/utils/themes/theme-provider";
import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Apsara Talent",
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
        className={`${ubuntu.className} antialiased`}
        suppressHydrationWarning
      >
        {/* Language Provider */}
        <LanguageProvider>
          {/* Theme Provider */}
          <ThemeProvider>{children}</ThemeProvider>
        </LanguageProvider>
        {/* Toast Container */}
        <Toaster />
      </body>
    </html>
  );
}
