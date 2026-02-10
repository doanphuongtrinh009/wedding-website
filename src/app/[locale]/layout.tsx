import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { FloatingConversionCta } from "@/components/layout/floating-conversion-cta";

import { AppClientProviders } from "@/components/providers/app-client-providers";
import { Navbar } from "@/components/layout/navbar";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { routing } from "@/i18n/routing";

import "../globals.css";

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "Layout" });

  return (
    <ClerkProvider>
      <html lang={locale} suppressHydrationWarning>
        <body className={cn(sansFont.variable, displayFont.variable)}>
          <NextIntlClientProvider messages={messages}>
            <AppClientProviders>
              <a
                href="#main-content"
                className="sr-only z-[80] rounded-md bg-background px-3 py-2 text-sm text-foreground focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {t("skipToContent")}
              </a>

              <div className="relative flex min-h-screen flex-col">
                <Navbar />
                <main id="main-content" className="flex-1 pb-24 md:pb-0">
                  {children}
                </main>
                <FloatingConversionCta />
                <footer className="border-t border-border/70 bg-background/70 py-6">
                  <div className="container flex flex-col items-center justify-between gap-2 text-sm text-muted-foreground md:flex-row">
                    <p>{siteConfig.name}</p>
                    <p>{t("footerTagline")}</p>
                  </div>
                </footer>
              </div>
            </AppClientProviders>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
