import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";

const sansFont = Source_Sans_3({
  weight: "500",
  subsets: ["latin"],
  display: 'swap',
  adjustFontFallback: false,
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sansFont.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
