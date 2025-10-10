import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AccountLayout } from "@/components/account/account-layout";
import { AccountOverview } from "@/components/account/account-overview";

export default function AccountPage() {
  return (
    <main className="min-h-screen py-8">
      <AccountLayout>
        <AccountOverview />
      </AccountLayout>
    </main>
  );
}
