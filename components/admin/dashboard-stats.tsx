import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import { MOCK_DASHBOARD_STATS } from "@/lib/constants";
import { formatPrice } from "@/utils/format";
import { Card, CardContent } from "@/components/ui/card";

export function DashboardStats() {
  const stats = MOCK_DASHBOARD_STATS;

  const cards = [
    {
      title: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      change: stats.revenueChange,
      icon: DollarSign,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      change: stats.ordersChange,
      icon: ShoppingCart,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers.toLocaleString(),
      change: stats.customersChange,
      icon: Users,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      change: stats.productsChange,
      icon: Package,
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isPositive = card.change >= 0;

        return (
          <Card key={card.title} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div
                  className={`h-12 w-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                    isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {Math.abs(card.change)}%
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-bold tracking-tight">{card.value}</h3>
                <p className="text-sm text-muted-foreground mt-1">{card.title}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
