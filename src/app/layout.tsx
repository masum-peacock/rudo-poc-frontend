import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const geistNoto = localFont({
  src: "./fonts/NotoSansBengali-Regular.ttf",
  variable: "--font-geist-noto",
  weight: "100 900",
});


export const metadata: Metadata = {
  title: "Rudo AI",
  description: "A Health AI Platform by Peacock",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${geistNoto.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
