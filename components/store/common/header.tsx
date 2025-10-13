"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, Heart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartDrawer } from "@/components/store/cart/cart-drawer";
import { useCart } from "@/hooks/use-cart-db";
import { useWishlist } from "@/hooks/use-wishlist";

export function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const { items } = useCart();
  const { items: wishlistItems } = useWishlist();
  const cartCount = items.length;
  const wishlistCount = wishlistItems.length;

  return (
    <>
      <nav className="bg-brand-primary sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex items-center justify-between gap-4 py-4">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col gap-4 mt-8">
                  <Link
                    href="/products"
                    className="text-lg font-medium hover:text-brand-primary transition-colors"
                  >
                    Pickles
                  </Link>
                  <Link
                    href="/products?category=gift-combos"
                    className="text-lg font-medium hover:text-brand-primary transition-colors"
                  >
                    Gift & Combos
                  </Link>
                  <Link
                    href="/products?filter=special-offer"
                    className="text-lg font-medium hover:text-brand-primary transition-colors"
                  >
                    Special Offer
                  </Link>
                  <Link
                    href="/reviews"
                    className="text-lg font-medium hover:text-brand-primary transition-colors"
                  >
                    Customer Reviews
                  </Link>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="text-xl font-bold text-white">
              Logo
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
              <Link
                href="/products"
                className="text-sm font-medium text-white hover:text-white/80 transition-colors"
              >
                Pickles
              </Link>
              <Link
                href="/products?category=gift-combos"
                className="text-sm font-medium text-white hover:text-white/80 transition-colors"
              >
                Gift & Combos
              </Link>
              <Link
                href="/products?filter=special-offer"
                className="text-sm font-medium text-white hover:text-white/80 transition-colors"
              >
                Special Offer
              </Link>
              <Link
                href="/reviews"
                className="text-sm font-medium text-white hover:text-white/80 transition-colors"
              >
                Customer Reviews
              </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-white hover:bg-white/10"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-white text-brand-primary text-xs flex items-center justify-center font-semibold">
                    {cartCount}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-white hover:bg-white/10"
                asChild
              >
                <Link href="/account/wishlist">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-white text-brand-primary text-xs flex items-center justify-center font-semibold">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" asChild>
                <Link href="/account">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
