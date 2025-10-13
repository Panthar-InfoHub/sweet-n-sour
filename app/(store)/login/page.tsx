"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const handleSignIn = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: redirect,
      });
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <main className="min-h-screen py-16">
      <div className="container-custom max-w-md">
        <div className="bg-white rounded-lg border border-border p-8">
          <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
          <p className="text-center text-foreground-muted mb-8">Sign in to your account</p>

          <Button variant="outline" className="w-full" onClick={handleSignIn}>
            Sign in with Google
          </Button>
        </div>
      </div>
    </main>
  );
}
