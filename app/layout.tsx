import type React from "react";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/components/providers/cart-provider";
import { WishlistSync } from "@/components/providers/wishlist-sync";
import { ThemeProvider } from "@/components/providers/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Pickle Paradise - Premium Artisan Pickles",
  description: "Discover our handcrafted selection of premium pickles, chutneys, and preserves",
  generator: "v0.app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground" suppressHydrationWarning>
        <ThemeProvider>
          <CartProvider>
            <WishlistSync />
            {children}
          </CartProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
