"use client"

import Link from "next/link"
import { Search, ShoppingCart, User, Heart, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  const [cartCount] = useState(3)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium hover:text-primary transition-colors">
                  Home
                </Link>
                <Link href="/products" className="text-lg font-medium hover:text-primary transition-colors">
                  Pickles
                </Link>
                <Link
                  href="/products?category=gift-combos"
                  className="text-lg font-medium hover:text-primary transition-colors"
                >
                  Gift & Combos
                </Link>
                <Link
                  href="/products?filter=special-offer"
                  className="text-lg font-medium hover:text-primary transition-colors"
                >
                  Special Offer
                </Link>
                <Link href="/reviews" className="text-lg font-medium hover:text-primary transition-colors">
                  Customer Reviews
                </Link>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">
            Pickle Paradise
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
              Pickles
            </Link>
            <Link
              href="/products?category=gift-combos"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Gift & Combos
            </Link>
            <Link
              href="/products?filter=special-offer"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Special Offer
            </Link>
            <Link href="/reviews" className="text-sm font-medium hover:text-primary transition-colors">
              Customer Reviews
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
              <Input type="search" placeholder="Search products..." className="pl-10" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/account">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  )
}
