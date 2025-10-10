
import { AccountLayout } from "@/components/account/account-layout";
import { AddressesList } from "@/components/account/addresses-list";

export default function AddressesPage() {
  return (
    <main className="min-h-screen py-8">
      <AccountLayout>
        <AddressesList />
      </AccountLayout>
    </main>
  );
}
