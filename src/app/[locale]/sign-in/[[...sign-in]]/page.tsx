import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

import { siteConfig } from "@/config/site";
import { getLocalizedPath, resolveLocale } from "@/lib/localized-paths";

export const metadata: Metadata = {
  title: "Sign In",
  robots: {
    index: false,
    follow: false
  }
};

export default async function SignInPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await props.params;
  const locale = resolveLocale(localeParam);
  const signUpUrl = getLocalizedPath(locale, "/sign-up");

  if (!siteConfig.authEnabled) {
    return (
      <section className="container flex min-h-[calc(100vh-16rem)] items-center justify-center py-12">
        <div className="max-w-xl rounded-[1.6rem] border border-border/70 bg-card/85 p-10 text-center shadow-luxury">
          <p className="editorial-kicker mb-3">Membership Access</p>
          <h1 className="font-display text-3xl text-brand-cocoa">
            Private Client Portal
          </h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Authentication is currently in{" "}
            <span className="font-semibold text-foreground">
              configuration mode
            </span>
            .
            <br />
            To enable member access, please configure your secure Clerk keys.
          </p>
          <div className="mt-8 rounded-xl border border-border/50 bg-secondary/30 p-4 font-mono text-xs text-muted-foreground">
            NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
            <br />
            CLERK_SECRET_KEY
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container flex min-h-[calc(100vh-16rem)] items-center justify-center py-12">
      <SignIn signUpUrl={signUpUrl} />
    </section>
  );
}
