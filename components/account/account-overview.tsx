import { Package, MapPin, Heart } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function AccountOverview() {
  const stats = [
    { label: "Total Orders", value: "12", icon: Package, href: "/account/orders" },
    { label: "Saved Addresses", value: "3", icon: MapPin, href: "/account/addresses" },
    { label: "Wishlist Items", value: "8", icon: Heart, href: "/wishlist" },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-border p-6">
        <h2 className="text-2xl font-bold mb-2">Welcome back, John!</h2>
        <p className="text-foreground-muted">Manage your orders, addresses, and account settings</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-foreground-muted">{stat.label}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Recent Orders</h3>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/account/orders">View All</Link>
          </Button>
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-surface rounded-lg">
              <div>
                <p className="font-medium">Order #ORD-{12345 + i}</p>
                <p className="text-sm text-foreground-muted">Placed on Jan {10 + i}, 2025</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-primary">₹{449 * i}</p>
                <p className="text-sm text-success">Delivered</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
