import type { Metadata } from "next";
import {
  ArrowLeft,
  Camera,
  CalendarDays,
  Clock3,
  MessageCircle,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { ProductGallery } from "@/components/shop/product-gallery";
import { WishlistToastProvider } from "@/components/providers/wishlist-toast-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WishlistToggleButton } from "@/components/shop/wishlist-toggle-button";
import { siteConfig } from "@/config/site";
import { getCurrentUserProfile } from "@/lib/auth";
import {
  formatCurrency,
  formatCurrencyForStructuredData,
  truncate
} from "@/lib/format";
import { getProductBySlug, getWishlistProductIds } from "@/lib/shop";

type ProductDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

type ProductProfile = {
  silhouette: "aLine" | "mermaid" | "ballGown" | "column" | "classic";
  fabric: "chiffon" | "satin" | "crepe" | "lace" | "mikado" | "tulle" | "mixed";
  occasion: "beach" | "outdoor" | "ballroom" | "intimate" | "allRound";
};

function getProductProfile(name: string, description: string): ProductProfile {
  const text = `${name} ${description}`.toLowerCase();

  const silhouette = /a-line|a line|chữ a/.test(text)
    ? "aLine"
    : /mermaid|đuôi cá|fit|flare/.test(text)
      ? "mermaid"
      : /ballgown|công chúa|bồng|xòe/.test(text)
        ? "ballGown"
        : /column|suông/.test(text)
          ? "column"
          : "classic";

  const fabric = /chiffon/.test(text)
    ? "chiffon"
    : /satin/.test(text)
      ? "satin"
      : /crepe/.test(text)
        ? "crepe"
        : /lace|ren/.test(text)
          ? "lace"
          : /mikado/.test(text)
            ? "mikado"
            : /tulle|tuyn/.test(text)
              ? "tulle"
              : "mixed";

  const occasion = /beach|bãi biển/.test(text)
    ? "beach"
    : /ngoài trời|sân vườn|garden/.test(text)
      ? "outdoor"
      : /ballroom|hoàng gia|lộng lẫy|cathedral/.test(text)
        ? "ballroom"
        : /city|thành phố|reception/.test(text)
          ? "intimate"
          : "allRound";

  return { silhouette, fabric, occasion };
}

export async function generateMetadata(
  props: ProductDetailPageProps
): Promise<Metadata> {
  const params = await props.params;
  const { slug } = params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const primaryImage = product.images[0]?.secureUrl;

  return {
    title: product.name,
    description: truncate(product.description, 155),
    alternates: {
      canonical: `/collections/${product.slug}`
    },
    openGraph: {
      title: product.name,
      description: truncate(product.description, 155),
      type: "website",
      images: primaryImage
        ? [
            {
              url: primaryImage,
              alt: product.images[0]?.altText || product.name
            }
          ]
        : undefined
    }
  };
}

export default async function ProductDetailPage(props: ProductDetailPageProps) {
  const [t, params] = await Promise.all([
    getTranslations("ProductDetail"),
    props.params
  ]);
  const { slug, locale } = params;
  const [profile, product] = await Promise.all([
    getCurrentUserProfile(),
    getProductBySlug(slug)
  ]);

  if (!product) {
    notFound();
  }

  const wishlistIds = profile
    ? await getWishlistProductIds(profile.id)
    : new Set<string>();
  const productProfile = getProductProfile(product.name, product.description);
  const localizedUpdatedAt = new Intl.DateTimeFormat(
    locale === "vi" ? "vi-VN" : "en-US",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }
  ).format(product.updatedAt);
  const detailItems = [
    { label: t("info.productCode"), value: product.slug.toUpperCase() },
    {
      label: t("info.lookbook"),
      value: t("info.lookbookValue", { count: product.images.length })
    },
    { label: t("info.updatedOn"), value: localizedUpdatedAt },
    { label: t("info.responseTime"), value: t("info.responseTimeValue") }
  ] as const;
  const attributeItems = [
    {
      label: t("attributes.silhouette"),
      value: t(`attributes.silhouetteValues.${productProfile.silhouette}`)
    },
    {
      label: t("attributes.fabric"),
      value: t(`attributes.fabricValues.${productProfile.fabric}`)
    },
    {
      label: t("attributes.occasion"),
      value: t(`attributes.occasionValues.${productProfile.occasion}`)
    }
  ] as const;
  const journeyItems = [
    { key: "confirm", icon: Clock3 },
    { key: "fitting", icon: CalendarDays },
    { key: "aftercare", icon: ShieldCheck }
  ] as const;
  const addOnItems = [
    {
      key: "makeup",
      icon: Sparkles,
      href: `/book?productId=${product.id}&services=makeup`
    },
    {
      key: "photo",
      icon: Camera,
      href: `/book?productId=${product.id}&services=photo`
    }
  ] as const;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: truncate(product.description, 600),
    image: product.images.map((image) => image.secureUrl),
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: formatCurrencyForStructuredData(
        product.priceInCents,
        product.currency
      ),
      availability: "https://schema.org/InStock",
      url: `${siteConfig.url}/collections/${product.slug}`
    },
    brand: {
      "@type": "Brand",
      name: siteConfig.name
    }
  };

  return (
    <section className="section-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
        <div className="space-y-4">
          <ProductGallery images={product.images} productName={product.name} />

          <div className="grid gap-3 sm:grid-cols-3">
            {attributeItems.map((item) => (
              <div key={item.label} className="soft-frame p-4">
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-brand-taupe">
                  {item.label}
                </p>
                <p className="mt-2 font-display text-[1.5rem] leading-tight text-foreground">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <div className="soft-frame bg-card/88 p-5 md:p-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="editorial-kicker">{t("kicker")}</p>
                {product.isFeatured ? (
                  <Badge variant="secondary">{t("featured")}</Badge>
                ) : null}
              </div>

              <h1 className="text-balance text-[2.3rem] leading-[1.03] md:text-[3.1rem]">
                {product.name}
              </h1>
              <p className="text-sm text-muted-foreground">{t("subtitle")}</p>

              <div className="flex flex-wrap items-end gap-3">
                <p className="font-display text-[2.4rem] leading-none text-brand-cocoa md:text-[2.8rem]">
                  {formatCurrency(product.priceInCents, product.currency)}
                </p>
                <span className="pb-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-brand-taupe">
                  {t("priceLabel")}
                </span>
              </div>

              <p className="text-base leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Button
                asChild
                className="h-12 rounded-2xl border border-brand-cocoa/10 bg-[linear-gradient(135deg,hsl(var(--brand-cocoa))_12%,hsl(var(--primary))_100%)] text-[0.78rem] font-semibold normal-case tracking-[0.04em]"
              >
                <Link href={`/book?productId=${product.id}`}>
                  <CalendarDays className="size-4" aria-hidden="true" />
                  <span>{t("bookTryOn")}</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-2xl border-border/80 bg-background/75 text-[0.78rem] font-semibold normal-case tracking-[0.04em]"
              >
                <Link href="/collections">
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  <span>{t("backToCatalog")}</span>
                </Link>
              </Button>
            </div>

            <div className="mt-5 rounded-2xl border border-border/65 bg-background/70 p-4">
              <p className="text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-brand-taupe">
                {t("addOnKicker")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("addOnTitle")}
              </p>

              <div className="mt-3 grid gap-2">
                {addOnItems.map((item) => (
                  <div
                    key={item.key}
                    className="rounded-xl border border-border/65 bg-card/90 p-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border/70 bg-background">
                        <item.icon
                          className="size-4 text-primary"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground">
                          {t(`addOns.${item.key}.title`)}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {t(`addOns.${item.key}.detail`)}
                        </p>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="mt-3 h-9 rounded-xl border-border/80 bg-background/80 px-3 text-[0.72rem] font-semibold normal-case tracking-[0.03em]"
                        >
                          <Link href={item.href}>
                            {t(`addOns.${item.key}.cta`)}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  asChild
                  className="h-10 rounded-xl border border-brand-cocoa/10 bg-[linear-gradient(135deg,hsl(var(--brand-cocoa))_12%,hsl(var(--primary))_100%)] text-[0.74rem] font-semibold normal-case tracking-[0.03em]"
                >
                  <Link
                    href={`/book?productId=${product.id}&services=makeup,photo`}
                  >
                    {t("addOns.bundleCta")}
                  </Link>
                </Button>
              </div>
            </div>

            <dl className="mt-5 grid gap-2 sm:grid-cols-2">
              {detailItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-border/60 bg-background/65 px-3 py-3"
                >
                  <dt className="text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-brand-taupe">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-foreground">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="soft-frame p-5">
            <p className="editorial-kicker">{t("journeyKicker")}</p>
            <h2 className="mt-2 text-[1.9rem] leading-tight">
              {t("journeyTitle")}
            </h2>
            <div className="mt-4 space-y-3">
              {journeyItems.map((item) => (
                <div
                  key={item.key}
                  className="rounded-xl border border-border/65 bg-background/70 p-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border/70 bg-card">
                      <item.icon
                        className="size-4 text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {t(`journey.${item.key}.title`)}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {t(`journey.${item.key}.detail`)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="soft-frame p-4">
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-brand-taupe">
              {t("supportTitle")}
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <a
                href={siteConfig.support.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-border/80 bg-background/75 px-4 text-[0.76rem] font-semibold normal-case tracking-[0.04em] text-foreground transition hover:border-brand-taupe/45 hover:bg-card/95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                <span>{t("chatWhatsApp")}</span>
              </a>
              <a
                href={siteConfig.support.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-border/80 bg-background/75 px-4 text-[0.76rem] font-semibold normal-case tracking-[0.04em] text-foreground transition hover:border-brand-taupe/45 hover:bg-card/95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                <span>{t("chatZalo")}</span>
              </a>
            </div>
          </div>

          {profile ? (
            <WishlistToastProvider>
              <div className="soft-frame p-4">
                <p className="font-semibold text-foreground">
                  {t("wishlistTitle")}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("saveToWishlist")}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <WishlistToggleButton
                    productId={product.id}
                    initialWishlisted={wishlistIds.has(product.id)}
                    className="shrink-0"
                  />
                  <p className="text-sm text-muted-foreground">
                    {wishlistIds.has(product.id)
                      ? t("wishlistSaved")
                      : t("wishlistReady")}
                  </p>
                </div>
              </div>
            </WishlistToastProvider>
          ) : (
            <div className="soft-frame p-4 text-sm text-muted-foreground">
              <p className="mb-1 font-semibold text-foreground">
                {t("wishlistTitle")}
              </p>
              <Link
                href="/sign-in"
                className="font-semibold text-foreground underline-offset-4 hover:underline"
              >
                {t("signInToSave")}
              </Link>{" "}
              {t("signInToSaveNote")}
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
