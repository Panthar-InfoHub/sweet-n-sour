import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { SearchDialog } from "./search-dialog";
import { AdminPanelLink } from "@/components/shared/admin-panel-link";
import { HeaderCartButton } from "./header-cart-button";
import { HeaderWishlistButton } from "./header-wishlist-button";
import { MobileMenu } from "./mobile-menu";
import { siteConfig } from "@/site.config";
import { Skeleton } from "@/components/ui/skeleton";

// Loading fallback for interactive buttons
function HeaderButtonsSkeleton() {
  return (
    <>
      <Skeleton className="h-10 w-10 rounded-md bg-white/20" />
      <Skeleton className="h-10 w-10 rounded-md bg-white/20 lg:hidden" />
      <Skeleton className="h-10 w-10 rounded-md bg-white/20 lg:hidden" />
    </>
  );
}

const navigationLinks = [
  {
    label: "Pickles",
    href: "/products",
  },
  {
    label: "Gift & Combos",
    href: "/categories/gift-combos",
  },
  {
    label: "Special Offer",
    href: "/categories/special-offer",
  },
  {
    label: "Contact Us",
    href: "/contact",
  },
];

export function Header() {
  return (
    <nav className="bg-brand-primary sticky top-0 z-50">
      <div className="custom-container">
        <div className="flex items-center justify-between gap-2 sm:gap-4 py-4">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="rounded-lg relative w-32 h-10">
              <Image
                src={siteConfig.logo.path}
                alt={siteConfig.logo.alt}
                fill
                className="rounded-lg object-contain"
              />
            </div>
            {/* <span className="text-xl font-bold text-white hidden sm:inline">{siteConfig.name}</span> */}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white hover:text-white/80 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions - Right */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Desktop Admin Link */}
            <div className="hidden lg:block">
              <AdminPanelLink />
            </div>

            {/* Search - Desktop and Mobile */}
            <SearchDialog />

            {/* Interactive Buttons with Suspense */}
            <Suspense fallback={<HeaderButtonsSkeleton />}>
              {/* Mobile Visible Icons - Cart & Account */}
              <HeaderCartButton isMobile />
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:bg-white/10"
                asChild
              >
                <Link href="/account">
                  <User className="h-5 w-5 text-white" />
                </Link>
              </Button>

              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center gap-2">
                <HeaderCartButton />
                <HeaderWishlistButton />
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
              <MobileMenu navigationLinks={navigationLinks} />
            </Suspense>
          </div>
        </div>
      </div>
    </nav>
  );
}
