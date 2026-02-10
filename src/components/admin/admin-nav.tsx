"use client";

import { Link, usePathname } from "@/i18n/routing";

import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/dresses", label: "Dresses" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" }
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="overflow-x-auto pb-1" aria-label="Admin sections">
      <ul className="flex min-w-max gap-2">
        {adminLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-flex rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/70 bg-card/70 text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
