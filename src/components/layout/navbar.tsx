"use client";


import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { navigationLinks } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-background/82 sticky top-0 z-40 w-full border-b border-border/70 backdrop-blur-xl">
      <div className="container py-2">
        <div className="flex h-[3.75rem] items-center justify-between">
          <div className="md:hidden">
            <MobileNav />
          </div>

          <Link
            href="/"
            className="font-display text-[1.7rem] font-semibold leading-none tracking-[-0.02em] text-brand-cocoa sm:text-[1.9rem]"
          >
            {siteConfig.name}
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.14em] transition-colors",
                  pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="hidden md:inline-flex">
              <Link href="/book">Reserve fitting</Link>
            </Button>

            {siteConfig.authEnabled ? (
              <>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button variant="secondary" size="sm">
                      Sign in
                    </Button>
                  </SignInButton>
                </SignedOut>

                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </>
            ) : (
              <Button asChild variant="secondary" size="sm">
                <Link href="/contact">Contact</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
