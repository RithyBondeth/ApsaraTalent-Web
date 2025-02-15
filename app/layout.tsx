import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";

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
    <html lang="en" dir="ltr">
      <body
        className={`${ubuntu.className} antialiased`}
      >
        {/* <ThemeProvider 
           attribute="class"
           defaultTheme="system"
           enableSystem
           disableTransitionOnChange
        > */}
        {children}
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
