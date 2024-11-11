import type { Metadata } from "next";
import localFont from "next/font/local";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

import "./globals.css";
import { Button } from "@/components/ui/button";

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
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${geistNoto.variable} antialiased`}
        >
          <main className="flex h-screen w-screen flex-col items-center justify-center">
            <SignedOut>
              <div className="text-center flex flex-col gap-5">
                <div>
                  <h4 className="font-light text-xl">Welcome To</h4>
                  <h1 className="font-semibold text-4xl shadow-sm px-6 py-3">Rudo AI</h1>
                </div>
                <SignInButton children={<Button className="font-semibold text-xl"> Click To Start </Button>} />
              </div>
            </SignedOut>
            <SignedIn>
              <section className="flex items-start w-full px-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center border rounded p-4 fixed top-0 left-4 bg-white">
                    <div className="flex gap-2 pt-2 w-60 items-center justify-start">
                      <UserButton />
                      <h1>Masum Billah</h1>
                    </div>
                    <div>
                      ...
                    </div>
                  </div>
                  <div className="border rounded p-4 flex flex-col gap-2 max-h-screen overflow-y-auto mt-52 w-72">
                    {/* {
                      [...Array.from({ length: 100 })].map((_, index) => (
                        <div key={index + ""} className="border px-2 py-1 bg-gray-200 rounded">

                          <h4 className="font-light">Chat Name</h4>
                        </div>
                      ))
                    } */}
                  </div>
                </div>
                <div className="w-full">
                  {children}
                </div>
              </section>
            </SignedIn>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
