import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AccountLayout } from "@/components/account/account-layout";
import { OrdersList } from "@/components/account/orders-list";

export default function OrdersPage() {
  return (
    <main className="min-h-screen py-8">
      <AccountLayout>
        <OrdersList />
      </AccountLayout>
    </main>
  );
}
