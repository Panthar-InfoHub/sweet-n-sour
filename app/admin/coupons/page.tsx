import { getCoupons } from "@/actions/admin/coupon.actions";
import { CouponsTable } from "@/components/admin/coupons";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function AdminCouponsPage() {
  const result = await getCoupons();
  const coupons = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Coupons</h1>
          <p className="text-muted-foreground mt-1">
            Manage discount coupons and promotional codes
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/coupons/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Coupon
          </Link>
        </Button>
      </div>

      <CouponsTable coupons={coupons || []} />
    </div>
  );
}
