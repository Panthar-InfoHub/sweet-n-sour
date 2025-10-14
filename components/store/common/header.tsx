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
import { SearchDialog } from "./search-dialog";
import { AdminPanelLink } from "@/components/shared/admin-panel-link";

export function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const { items } = useCart();
  const { items: wishlistItems } = useWishlist();
  const cartCount = items.length;
  const wishlistCount = wishlistItems.length;

  return (
    <>
      <nav className="bg-brand-primary sticky top-0 z-50 ">
        <div className=" custom-container">
          <div className="flex items-center justify-between gap-2 sm:gap-4 py-4">
            {/* Logo - Left */}
            <Link href="/" className="text-xl font-bold text-white flex-shrink-0">
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

            {/* Actions - Right */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Desktop Admin Link */}
              <div className="hidden lg:block">
                <AdminPanelLink />
              </div>

              {/* Search - Desktop and Mobile */}
              <SearchDialog />

              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-white hover:bg-white/10"
                  onClick={() => setCartOpen(true)}
                >
                  <ShoppingCart className="h-5 w-5 text-white hover:text-white" />
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
                    <Heart className="h-5 w-5 text-white hover:text-white " />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-white text-brand-primary text-xs flex items-center justify-center font-semibold">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/account">
                    <User className="h-5 w-5 text-white hover:text-white" />
                  </Link>
                </Button>
              </div>

              {/* Mobile Menu - Right */}
              <Sheet>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col gap-6 mt-8">
                    {/* User Actions */}
                    <div className="flex flex-col gap-3 pb-6 border-b">
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase">
                        Account
                      </h3>
                      <Button variant="ghost" className="justify-start gap-3 h-12" asChild>
                        <Link href="/account">
                          <User className="h-5 w-5" />
                          <span>My Account</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start gap-3 h-12 relative"
                        onClick={() => setCartOpen(true)}
                      >
                        <ShoppingCart className="h-5 w-5" />
                        <span>Cart</span>
                        {cartCount > 0 && (
                          <span className="ml-auto h-6 w-6 rounded-full bg-brand-primary text-white text-xs flex items-center justify-center font-semibold">
                            {cartCount}
                          </span>
                        )}
                      </Button>
                      <Button variant="ghost" className="justify-start gap-3 h-12 relative" asChild>
                        <Link href="/account/wishlist">
                          <Heart className="h-5 w-5" />
                          <span>Wishlist</span>
                          {wishlistCount > 0 && (
                            <span className="ml-auto h-6 w-6 rounded-full bg-brand-primary text-white text-xs flex items-center justify-center font-semibold">
                              {wishlistCount}
                            </span>
                          )}
                        </Link>
                      </Button>
                      <AdminPanelLink variant="full" />
                    </div>

                    {/* Navigation Links */}
                    <div className="flex flex-col gap-3">
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase">
                        Shop
                      </h3>
                      <Link
                        href="/products"
                        className="text-base font-medium hover:text-brand-primary transition-colors py-2"
                      >
                        Pickles
                      </Link>
                      <Link
                        href="/products?category=gift-combos"
                        className="text-base font-medium hover:text-brand-primary transition-colors py-2"
                      >
                        Gift & Combos
                      </Link>
                      <Link
                        href="/products?filter=special-offer"
                        className="text-base font-medium hover:text-brand-primary transition-colors py-2"
                      >
                        Special Offer
                      </Link>
                      <Link
                        href="/reviews"
                        className="text-base font-medium hover:text-brand-primary transition-colors py-2"
                      >
                        Customer Reviews
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
