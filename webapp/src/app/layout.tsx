import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

/**
 * Layout — SSG: statically generated at build time.
 * The layout shell (header, fonts, metadata) does not depend on
 * dynamic data and is reused across all pages.
 */

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Product Manager",
  description: "E-commerce product catalog management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
