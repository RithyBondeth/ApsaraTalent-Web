import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/utils/themes/theme-provider";
import { Toaster } from "@/components/ui/toaster"

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Apsara Talent",
  description: "Professional Community",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={`${ubuntu.className} antialiased`}>
        <ThemeProvider>
        {children}
        </ThemeProvider>
        <Toaster/>
      </body>
    </html>
  );
}
