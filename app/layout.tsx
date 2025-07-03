import "./globals.css";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionWrapper from "@/components/SessionWrapper"; 

export const metadata = {
  title: "Blog Platform",
  description: "A modern blog with rich text editing and MongoDB integration",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 text-gray-900">
        <SessionWrapper>
          <header className="sticky top-0 z-40 bg-white/90 backdrop-blur shadow-sm border-b">
            <Navbar />
          </header>
          <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
            {children}
          </main>
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}
