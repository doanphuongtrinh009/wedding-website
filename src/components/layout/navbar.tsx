"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ChevronDown, Sparkles, Camera, LayoutGrid } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const navItems = [
  { key: "collections", href: "/collections" },
  { key: "bookTryOn", href: "/book" },
  { key: "wishlist", href: "/wishlist" },
  { key: "account", href: "/account" }
] as const;

const serviceChildren = [
  {
    key: "servicesOverview",
    hintKey: "servicesOverviewHint",
    href: "/services",
    icon: LayoutGrid
  },
  {
    key: "makeupService",
    hintKey: "makeupServiceHint",
    href: "/services/makeup",
    icon: Sparkles
  },
  {
    key: "photoService",
    hintKey: "photoServiceHint",
    href: "/services/photo",
    icon: Camera
  }
] as const;

export function Navbar() {
  const pathname = usePathname();
  const t = useTranslations("Nav");
  const isServicesRoute =
    pathname === "/services" || pathname.startsWith("/services/");

  return (
    <header className="sticky top-0 z-[70] isolate w-full overflow-visible border-b border-border/70 bg-background/88 backdrop-blur-xl">
      <div className="container relative overflow-visible py-2">
        <div className="flex h-[3.75rem] items-center justify-between overflow-visible">
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

          <nav className="relative z-[80] hidden items-center gap-7 md:flex">
            <Link
              href="/collections"
              aria-current={pathname === "/collections" ? "page" : undefined}
              className={cn(
                "text-xs font-semibold uppercase tracking-[0.14em] transition-colors",
                pathname === "/collections"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t("collections")}
            </Link>

            <div className="group relative after:absolute after:left-1/2 after:top-full after:h-4 after:w-80 after:-translate-x-1/2 after:content-['']">
              <Link
                href="/services"
                aria-current={isServicesRoute ? "page" : undefined}
                aria-haspopup="menu"
                className={cn(
                  "inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.14em] transition-colors",
                  isServicesRoute
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span>{t("services")}</span>
                <ChevronDown className="size-3.5 transition group-hover:rotate-180 group-focus-within:rotate-180" />
              </Link>

              <div className="pointer-events-none invisible absolute left-1/2 top-[calc(100%+0.25rem)] z-[90] w-72 -translate-x-1/2 translate-y-1 rounded-2xl border border-border/75 bg-background p-2 opacity-0 shadow-[0_20px_46px_-22px_rgba(56,33,22,0.42)] backdrop-blur transition duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                {serviceChildren.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm transition",
                      pathname === item.href
                        ? "bg-secondary/55 text-foreground"
                        : "text-muted-foreground hover:bg-secondary/45 hover:text-foreground"
                    )}
                  >
                    <item.icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{t(item.key)}</p>
                      <p className="text-xs text-muted-foreground">{t(item.hintKey)}</p>
                    </div>
                  </Link>
                ))}
                <div className="mt-1 rounded-xl border border-border/70 bg-card/70 px-3 py-2">
                  <p className="text-xs text-muted-foreground">{t("serviceMenuHint")}</p>
                </div>
              </div>
            </div>

            {navItems.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.14em] transition-colors",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t(item.key)}
              </Link>
            ))}
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
