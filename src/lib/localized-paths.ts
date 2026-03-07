import {
  getPathname,
  isValidLocale,
  routing,
  type AppLocale
} from "@/i18n/routing";

export type LocalizedHref = Parameters<typeof getPathname>[0]["href"];

export function resolveLocale(locale: string | null | undefined): AppLocale {
  if (locale && isValidLocale(locale)) {
    return locale;
  }

  return routing.defaultLocale;
}

export function getLocalizedPath(
  locale: string | null | undefined,
  href: LocalizedHref
) {
  return getPathname({
    href,
    locale: resolveLocale(locale)
  });
}

export function getAllLocalizedPaths(href: LocalizedHref) {
  return routing.locales.map((locale) =>
    getPathname({
      href,
      locale
    })
  );
}

export function normalizeInternalPath(path: string | undefined) {
  const trimmedPath = path?.trim();

  if (!trimmedPath) {
    return undefined;
  }

  if (!trimmedPath.startsWith("/") || trimmedPath.startsWith("//")) {
    return undefined;
  }

  const [pathname, query = ""] = trimmedPath.split("?");

  for (const locale of routing.locales) {
    const localePrefix = `/${locale}`;

    if (pathname === localePrefix) {
      return query ? `/?${query}` : "/";
    }

    if (pathname.startsWith(`${localePrefix}/`)) {
      const unprefixedPath = pathname.slice(localePrefix.length);

      return query ? `${unprefixedPath}?${query}` : unprefixedPath;
    }
  }

  return trimmedPath;
}
