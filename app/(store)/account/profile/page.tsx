import { AnnouncementBar } from "@/components/layout/announcement-bar"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AccountLayout } from "@/components/account/account-layout"
import { ProfileSettings } from "@/components/account/profile-settings"

export default function ProfilePage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="min-h-screen py-8">
        <AccountLayout>
          <ProfileSettings />
        </AccountLayout>
      </main>
      <Footer />
    </>
  )
}
