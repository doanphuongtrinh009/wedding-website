import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { isValidLocale, routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  "/:locale/admin(.*)",
  "/:locale/bookings(.*)",
  "/:locale/account(.*)",
  "/:locale/wishlist(.*)",
  "/admin(.*)",
  "/bookings(.*)",
  "/account(.*)",
  "/wishlist(.*)"
]);

function getLocaleFromPathname(pathname: string) {
  const firstSegment = pathname.split("/")[1];

  if (firstSegment && isValidLocale(firstSegment)) {
    return firstSegment;
  }

  return routing.defaultLocale;
}

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Keep API routes locale-agnostic so health checks and webhooks don't get
  // rewritten to /:locale/api/* by the intl middleware.
  if (
    req.nextUrl.pathname.startsWith("/api") ||
    req.nextUrl.pathname.startsWith("/trpc")
  ) {
    return NextResponse.next();
  }

  if (isProtectedRoute(req)) {
    const locale = getLocaleFromPathname(req.nextUrl.pathname);
    await auth.protect({
      unauthenticatedUrl: new URL(`/${locale}/sign-in`, req.url).toString(),
      unauthorizedUrl: new URL(`/${locale}`, req.url).toString()
    });
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)"
  ]
};
