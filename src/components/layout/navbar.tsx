"use client";

import { Show, SignInButton, UserButton, useClerk } from "@clerk/nextjs";
import {
  ChevronDown,
  Sparkles,
  Camera,
  LayoutGrid,
  LogOut
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { useState } from "react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { siteConfig } from "@/config/site";
import { getLocalizedPath } from "@/lib/localized-paths";
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
  const clerk = useClerk();
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Nav");
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const isServicesRoute =
    pathname === "/services" || pathname.startsWith("/services/");
  const signOutRedirectUrl = getLocalizedPath(locale, "/");

  return (
    <header className="bg-background/88 sticky top-0 isolate z-70 w-full overflow-visible border-b border-border/70 backdrop-blur-xl">
      <div className="container relative overflow-visible py-2">
        <div className="flex h-15 items-center overflow-visible">
          <div className="md:hidden">
            <MobileNav />
          </div>

          <Link
            href="/"
            className="shrink-0 font-display text-[1.32rem] font-semibold leading-none tracking-[-0.02em] text-brand-cocoa sm:text-[1.48rem] xl:text-[1.55rem]"
          >
            <span className="inline-flex whitespace-nowrap font-display font-bold uppercase tracking-[0.22em] text-foreground">
              Quỳnh Trâm{" "}
              <span className="ml-2 font-light text-muted-foreground">
                Bridal
              </span>
            </span>
          </Link>

          <nav className="relative z-80 mx-4 hidden flex-1 items-center justify-center gap-4 lg:mx-5 lg:gap-5 xl:mx-6 xl:gap-7 md:flex">
            <Link
              href="/collections"
              aria-current={pathname === "/collections" ? "page" : undefined}
              className={cn(
                "inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap text-[11px] font-semibold uppercase leading-none tracking-[0.14em] transition-colors lg:text-xs",
                pathname === "/collections"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t("collections")}
            </Link>

            <div
              className="relative after:absolute after:left-1/2 after:top-full after:h-4 after:w-80 after:-translate-x-1/2 after:content-['']"
              onMouseEnter={() => setIsServicesMenuOpen(true)}
              onMouseLeave={() => setIsServicesMenuOpen(false)}
              onFocus={() => setIsServicesMenuOpen(true)}
              onBlur={(event) => {
                if (
                  !event.currentTarget.contains(
                    event.relatedTarget as Node | null
                  )
                ) {
                  setIsServicesMenuOpen(false);
                }
              }}
            >
              <Link
                href="/services"
                aria-current={isServicesRoute ? "page" : undefined}
                aria-haspopup="menu"
                aria-expanded={isServicesMenuOpen}
                onClick={() => setIsServicesMenuOpen(false)}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center justify-center gap-1 whitespace-nowrap text-[11px] font-semibold uppercase leading-none tracking-[0.14em] transition-colors lg:text-xs",
                  isServicesRoute
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span>{t("services")}</span>
                <ChevronDown
                  className={cn(
                    "size-3.5 transition",
                    isServicesMenuOpen ? "rotate-180" : "rotate-0"
                  )}
                />
              </Link>

              <div
                className={cn(
                  "absolute left-1/2 top-[calc(100%+0.25rem)] z-90 w-72 -translate-x-1/2 rounded-2xl border border-border/75 bg-background p-2 shadow-[0_20px_46px_-22px_rgba(56,33,22,0.42)] backdrop-blur-sm transition duration-200",
                  isServicesMenuOpen
                    ? "pointer-events-auto visible translate-y-0 opacity-100"
                    : "pointer-events-none invisible translate-y-1 opacity-0"
                )}
              >
                {serviceChildren.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsServicesMenuOpen(false)}
                    className={cn(
                      "flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm transition",
                      pathname === item.href
                        ? "bg-secondary/55 text-foreground"
                        : "text-muted-foreground hover:bg-secondary/45 hover:text-foreground"
                    )}
                  >
                    <item.icon
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">
                        {t(item.key)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t(item.hintKey)}
                      </p>
                    </div>
                  </Link>
                ))}
                <div className="mt-1 rounded-xl border border-border/70 bg-card/70 px-3 py-2">
                  <p className="text-xs text-muted-foreground">
                    {t("serviceMenuHint")}
                  </p>
                </div>
              </div>
            </div>

            {navItems.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap text-[11px] font-semibold uppercase leading-none tracking-[0.14em] transition-colors lg:text-xs",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Button
              asChild
              size="sm"
              className="hidden shrink-0 whitespace-nowrap md:inline-flex"
            >
              <Link href="/book">{t("reserveFitting")}</Link>
            </Button>

            {siteConfig.authEnabled ? (
              <>
                <Show when="signed-out">
                  <SignInButton mode="modal">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="shrink-0 whitespace-nowrap"
                    >
                      {t("signIn")}
                    </Button>
                  </SignInButton>
                </Show>

                <Show when="signed-in">
                  <UserButton
                    userProfileProps={{
                      appearance: {
                        elements: {
                          navbar: "hidden"
                        }
                      }
                    }}
                  >
                    <UserButton.MenuItems>
                      <UserButton.Action
                        label="manageAccount"
                      />
                      <UserButton.Action
                        label={t("signOut")}
                        labelIcon={<LogOut className="size-4" />}
                        onClick={() =>
                          void clerk.signOut({
                            redirectUrl: signOutRedirectUrl
                          })
                        }
                      />
                    </UserButton.MenuItems>
                  </UserButton>
                </Show>
              </>
            ) : (
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="shrink-0 whitespace-nowrap"
              >
                <Link href="/contact">{t("contact")}</Link>
              </Button>
            )}

            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
