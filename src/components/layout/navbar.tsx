"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const navKeys = ["collections", "bookTryOn", "wishlist", "account"] as const;
const navHrefs = ["/collections", "/book", "/wishlist", "/account"] as const;

export function Navbar() {
  const pathname = usePathname();
  const t = useTranslations("Nav");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="container py-2">
        <div className="flex h-[3.75rem] items-center justify-between">
          <div className="md:hidden">
            <MobileNav />
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 font-display text-[1.7rem] font-semibold leading-none tracking-[-0.02em] text-brand-cocoa sm:text-[1.9rem]"
          >
            <span className="font-display text-2xl font-bold uppercase tracking-widest text-foreground sm:text-3xl">
              Quỳnh Trâm <span className="font-light text-muted-foreground">Bridal</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {navKeys.map((key, index) => {
              const href = navHrefs[index];
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={pathname === href ? "page" : undefined}
                  className={cn(
                    "text-xs font-semibold uppercase tracking-[0.14em] transition-colors",
                    pathname === href
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t(key)}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            <Button asChild size="sm" className="hidden md:inline-flex">
              <Link href="/book">{t("reserveFitting")}</Link>
            </Button>

            {siteConfig.authEnabled ? (
              <>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button variant="secondary" size="sm">
                      {t("signIn")}
                    </Button>
                  </SignInButton>
                </SignedOut>

                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </>
            ) : (
              <Button asChild variant="secondary" size="sm">
                <Link href="/contact">{t("contact")}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
