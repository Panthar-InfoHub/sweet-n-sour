"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
// import { useSearchParams } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  // const searchParams = useSearchParams();
  // const redirect = searchParams.get("redirect") || "/";

  const handleSignIn = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <main className=" py-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm border border-border shadow-xl rounded-2xl p-8 md:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image src="/logo.svg" alt="Brand Logo" width={48} height={48} className="rounded-lg" />
          </div>

          {/* Headings */}
          <h1 className="text-3xl font-bold text-center text-foreground mb-2 tracking-tight">
            Welcome Back 👋
          </h1>
          <p className="text-center text-muted-foreground mb-8 text-sm">
            Sign in to Sweet and Sour
          </p>

          {/* Sign-in Button */}
          <Button
            variant="outline"
            className="w-full py-5 text-[15px] font-medium flex items-center justify-center gap-2 hover:bg-neutral-50 transition-colors"
            onClick={handleSignIn}
          >
            <Image src="/images/google.svg" alt="Google" width={20} height={20} className="mr-1" />
            Continue with Google
          </Button>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            By continuing, you agree to our{" "}
            <a href="/terms" className="underline hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline hover:text-primary">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
