import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/db";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.site_name || "Stars777 - Play Teen Patti & Rummy",
    description: "Play skill-based Teen Patti and Rummy on Stars777 with secure payments, instant withdrawals, and 24/7 expert support.",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-primary text-white min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
