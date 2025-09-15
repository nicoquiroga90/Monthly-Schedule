import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clean Schedule Generator",
  description: "Generate fair cleaning schedules and export to PDF",
  authors: [{ name: "Nico Q", url: "https://nico-quiroga.vercel.app/" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <header className="w-full p-4 bg-white shadow">
          <h1 className="text-xl font-bold">Clean Schedule Generator</h1>
        </header>

        <main className="max-w-5xl mx-auto p-6">{children}</main>

        <footer className="w-full p-4 text-center text-sm text-gray-500 border-t mt-8">
          Made with ❤️ using Next.js
        </footer>
      </body>
    </html>
  );
}
