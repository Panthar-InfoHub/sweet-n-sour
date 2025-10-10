import { AnnouncementBar } from "@/components/layout/announcement-bar"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AccountLayout } from "@/components/account/account-layout"
import { AddressesList } from "@/components/account/addresses-list"

export default function AddressesPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="min-h-screen py-8">
        <AccountLayout>
          <AddressesList />
        </AccountLayout>
      </main>
      <Footer />
    </>
  )
}
