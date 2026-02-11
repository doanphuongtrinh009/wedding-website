import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["vi", "en"],
  defaultLocale: "vi"
});

export type AppLocale = (typeof routing.locales)[number];

export function isValidLocale(locale: string): locale is AppLocale {
  return routing.locales.some((supportedLocale) => supportedLocale === locale);
}

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, usePathname, useRouter } =
  createNavigation(routing);
