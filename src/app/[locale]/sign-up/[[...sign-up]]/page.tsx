import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Sign Up",
  robots: {
    index: false,
    follow: false
  }
};

export default function SignUpPage() {
  if (!siteConfig.authEnabled) {
    return (
      <section className="container flex min-h-[calc(100vh-16rem)] items-center justify-center py-12">
        <div className="max-w-xl rounded-[1.6rem] border border-border/70 bg-card/85 p-10 text-center shadow-luxury">
          <p className="editorial-kicker mb-3">Join Quỳnh Trâm Bridal</p>
          <h1 className="text-3xl font-display text-brand-cocoa">Create Account</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Registration is currently in <span className="font-semibold text-foreground">configuration mode</span>.
            <br />
            To enable new member registration, please configure your secure Clerk keys.
          </p>
          <div className="mt-8 p-4 rounded-xl bg-secondary/30 border border-border/50 text-xs text-muted-foreground font-mono">
            NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY<br />
            CLERK_SECRET_KEY
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container flex min-h-[calc(100vh-16rem)] items-center justify-center py-12">
      <SignUp signInUrl="/sign-in" />
    </section>
  );
}
