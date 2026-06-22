import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { SocketProvider } from "@/components/providers/SocketProvider";
import { auth } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "PES Buddy",
    template: "%s | PES Buddy",
  },
  description:
    "Your all-in-one campus companion for food ordering, scooter booking, and expense tracking at PES University",
  keywords: [
    "PES University",
    "campus app",
    "food ordering",
    "scooter booking",
    "expense tracker",
  ],
  authors: [{ name: "PES Buddy Team" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="pes-buddy-theme"
          >
            <CartProvider>
              <SocketProvider>
                <div className="min-h-screen flex flex-col">{children}</div>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: "#1a1a2e",
                      color: "#fff",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      borderRadius: "12px",
                    },
                    success: {
                      iconTheme: { primary: "#22c55e", secondary: "#fff" },
                    },
                    error: {
                      iconTheme: { primary: "#ef4444", secondary: "#fff" },
                    },
                  }}
                />
              </SocketProvider>
            </CartProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
