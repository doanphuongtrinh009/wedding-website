import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import {
  Facebook,
  Instagram,
  MessageCircle,
  Music2,
  Phone,
  Youtube
} from "lucide-react";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { FloatingConversionCta } from "@/components/layout/floating-conversion-cta";

import { Navbar } from "@/components/layout/navbar";
import { siteConfig } from "@/config/site";
import { isValidLocale, Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import "../globals.css";

const clientMessageNamespaces = [
  "Nav",
  "FloatingCta",
  "Booking",
  "ProductDetail",
  "Wishlist"
] as const;

function pickClientMessages<T extends Record<string, unknown>>(
  allMessages: T
) {
  return clientMessageNamespaces.reduce<Partial<T>>((accumulator, namespace) => {
    if (namespace in allMessages) {
      accumulator[namespace as keyof T] = allMessages[namespace as keyof T];
    }

    return accumulator;
  }, {});
}

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap"
});

const displayFont = Cormorant_Garamond({
  subsets: ["latin", "vietnamese"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700"]
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage]
  }
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!isValidLocale(locale)) {
    notFound();
  }

  const [allMessages, layoutT, navT] = await Promise.all([
    getMessages(),
    getTranslations({ locale, namespace: "Layout" }),
    getTranslations({ locale, namespace: "Nav" })
  ]);
  const messages = pickClientMessages(allMessages as Record<string, unknown>);
  const phoneHref = `tel:${siteConfig.support.phone.replace(/[^\d+]/g, "")}`;
  const currentYear = new Date().getFullYear();
  const quickLinks = [
    { href: "/", label: layoutT("footerHome") },
    { href: "/collections", label: navT("collections") },
    { href: "/book", label: navT("bookTryOn") },
    { href: "/contact", label: navT("contact") }
  ] as const;
  const serviceLinks = [
    { href: "/services", label: navT("servicesOverview") },
    { href: "/services/makeup", label: navT("makeupService") },
    { href: "/services/photo", label: navT("photoService") }
  ] as const;
  const socialLinks = [
    { href: siteConfig.social.facebookUrl, label: "Facebook", icon: Facebook },
    { href: siteConfig.social.instagramUrl, label: "Instagram", icon: Instagram },
    { href: siteConfig.social.tiktokUrl, label: "TikTok", icon: Music2 },
    { href: siteConfig.social.youtubeUrl, label: "YouTube", icon: Youtube }
  ] as const;

  return (
    <ClerkProvider>
      <html lang={locale} suppressHydrationWarning>
        <body className={cn(sansFont.variable, displayFont.variable)}>
          <NextIntlClientProvider messages={messages}>
            <a
              href="#main-content"
              className="sr-only z-[80] rounded-md bg-background px-3 py-2 text-sm text-foreground focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {layoutT("skipToContent")}
            </a>

            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main id="main-content" className="flex-1 pb-24 md:pb-0">
                {children}
              </main>
              <FloatingConversionCta />

              <footer className="border-t border-border/70 bg-[linear-gradient(180deg,hsl(var(--background))_0%,hsl(var(--secondary)/0.38)_100%)]">
                <div className="container py-10 md:py-12">
                  <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-12">
                    <div className="space-y-4 xl:col-span-4">
                      <p className="font-display text-[1.8rem] leading-none text-foreground md:text-[2.1rem]">
                        {siteConfig.name}
                      </p>
                      <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                        {layoutT("footerDescription")}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span className="rounded-full border border-border/70 bg-card/70 px-3 py-1.5">
                          {layoutT("footerAtelierLabel")}
                        </span>
                        <span className="rounded-full border border-border/70 bg-card/70 px-3 py-1.5">
                          {layoutT("footerByAppointment")}
                        </span>
                      </div>
                    </div>

                    <div className="xl:col-span-2">
                      <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-brand-taupe">
                        {layoutT("footerQuickLinks")}
                      </p>
                      <ul className="space-y-2">
                        {quickLinks.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className="text-sm text-muted-foreground transition hover:text-foreground"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="xl:col-span-3">
                      <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-brand-taupe">
                        {layoutT("footerServiceLinks")}
                      </p>
                      <ul className="space-y-2">
                        {serviceLinks.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className="text-sm text-muted-foreground transition hover:text-foreground"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/book?services=makeup,photo"
                        className="mt-4 inline-flex rounded-full border border-border/80 bg-background/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-foreground transition hover:border-brand-taupe/45 hover:bg-card/95"
                      >
                        {layoutT("footerBundleCta")}
                      </Link>
                    </div>

                    <div className="xl:col-span-3">
                      <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-brand-taupe">
                        {layoutT("footerContact")}
                      </p>
                      <div className="space-y-2">
                        <a
                          href={phoneHref}
                          className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                        >
                          <Phone className="size-4 text-primary" aria-hidden="true" />
                          <span>{siteConfig.support.phone}</span>
                        </a>
                        <a
                          href={siteConfig.support.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                        >
                          <MessageCircle className="size-4 text-primary" aria-hidden="true" />
                          <span>{layoutT("footerWhatsapp")}</span>
                        </a>
                        <a
                          href={siteConfig.support.zaloUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                        >
                          <MessageCircle className="size-4 text-primary" aria-hidden="true" />
                          <span>{layoutT("footerZalo")}</span>
                        </a>
                        <a
                          href={`mailto:${siteConfig.support.email}`}
                          className="text-sm text-muted-foreground transition hover:text-foreground"
                        >
                          {siteConfig.support.email}
                        </a>
                        <p className="text-sm text-muted-foreground">
                          {layoutT("footerHours")}
                        </p>
                      </div>

                      <div className="mt-4">
                        <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-brand-taupe">
                          {layoutT("footerFollowUs")}
                        </p>
                        <div className="flex items-center gap-2">
                          {socialLinks.map((item) => (
                            <a
                              key={item.label}
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={item.label}
                              className="inline-flex size-9 items-center justify-center rounded-full border border-border/75 bg-background/75 text-muted-foreground transition hover:border-brand-taupe/45 hover:text-foreground"
                            >
                              <item.icon className="size-4" aria-hidden="true" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-2 border-t border-border/70 pt-4 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
                    <p>{layoutT("footerCopyright", { year: currentYear })}</p>
                    <p>{layoutT("footerTagline")}</p>
                  </div>
                </div>
              </footer>
            </div>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
