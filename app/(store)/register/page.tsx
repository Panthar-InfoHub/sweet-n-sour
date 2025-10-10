import { AnnouncementBar } from "@/components/layout/announcement-bar"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { RegisterForm } from "@/components/auth/register-form"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="min-h-screen py-16">
        <div className="container-custom max-w-md">
          <div className="bg-white rounded-lg border border-border p-8">
            <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>
            <p className="text-center text-foreground-muted mb-8">Join us and start shopping</p>

            <RegisterForm />

            <div className="mt-6 text-center text-sm">
              <span className="text-foreground-muted">Already have an account? </span>
              <Link href="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
