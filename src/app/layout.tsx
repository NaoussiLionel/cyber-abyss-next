import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CYBER ABYSS",
  description: "Arena shooter — 28 missions, 5 enemy types, 4 game modes, 4-player PvP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${mono.variable} h-full`}>
      <body className="min-h-full bg-[#0a0a14] text-white font-mono overflow-hidden">
        {children}
      </body>
    </html>
  );
}
