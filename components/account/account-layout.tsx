"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Package, MapPin, Heart, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccountLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: "Overview", href: "/account", icon: User },
  { name: "Orders", href: "/account/orders", icon: Package },
  { name: "Addresses", href: "/account/addresses", icon: MapPin },
  { name: "Wishlist", href: "/wishlist", icon: Heart },
  { name: "Profile Settings", href: "/account/profile", icon: User },
]

export function AccountLayout({ children }: AccountLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="container-custom">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar Navigation */}
        <aside className="space-y-2">
          <nav className="bg-white rounded-lg border border-border p-4">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive ? "bg-primary text-white" : "text-foreground hover:bg-surface",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}

            <button
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-destructive hover:bg-destructive/10 w-full mt-4"
              onClick={() => {
                // Handle logout
                console.log("Logout")
              }}
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <div>{children}</div>
      </div>
    </div>
  )
}
