import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductGallery } from "@/components/shop/product-gallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WishlistToggleButton } from "@/components/shop/wishlist-toggle-button";
import { siteConfig } from "@/config/site";
import { getCurrentUserProfile } from "@/lib/auth";
import { formatCurrency, truncate } from "@/lib/format";
import { getProductBySlug, getWishlistProductIds } from "@/lib/shop";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};


export async function generateMetadata(
  props: ProductDetailPageProps
): Promise<Metadata> {
  const params = await props.params;
  const { slug } = params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found"
    };
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


export default async function ProductDetailPage(
  props: ProductDetailPageProps
) {
  const params = await props.params;
  const { slug } = params;
  const profile = await getCurrentUserProfile();
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const wishlistIds = profile
    ? await getWishlistProductIds(profile.id)
    : new Set<string>();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: truncate(product.description, 600),
    image: product.images.map((image) => image.secureUrl),
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: (product.priceInCents / 100).toFixed(2),
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

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="space-y-6">
          <div className="space-y-4">
            <p className="editorial-kicker">Product Detail</p>
            <h1 className="text-5xl md:text-6xl">{product.name}</h1>
            <p className="font-display text-4xl leading-none text-brand-cocoa">
              {formatCurrency(product.priceInCents, product.currency)}
            </p>
            {product.isFeatured ? (
              <Badge variant="secondary">Featured edit</Badge>
            ) : null}
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button asChild className="w-full">
              <Link href={`/book?productId=${product.id}`}>Book try-on</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/collections">Back to catalog</Link>
            </Button>
          </div>

          <div className="grid gap-2 rounded-xl border border-border/70 bg-card/80 p-4 text-sm text-muted-foreground sm:grid-cols-2">
            <p>Secure appointment confirmation within one business day.</p>
            <p>Alteration timeline and fitting milestones included.</p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <a
              href={siteConfig.support.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-border/80 bg-card/85 px-4 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.13em] text-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-safe:hover:-translate-y-0.5"
            >
              Chat on WhatsApp
            </a>
            <a
              href={siteConfig.support.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-border/80 bg-card/85 px-4 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.13em] text-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-safe:hover:-translate-y-0.5"
            >
              Chat on Zalo
            </a>
          </div>

          {profile ? (
            <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/80 p-4">
              <WishlistToggleButton
                productId={product.id}
                initialWishlisted={wishlistIds.has(product.id)}
                className="shrink-0"
              />
              <p className="text-sm text-muted-foreground">
                Save this gown to your wishlist for account follow-up.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-border/70 bg-card/80 p-4 text-sm text-muted-foreground">
              <Link
                href="/sign-in"
                className="font-semibold text-foreground underline-offset-4 hover:underline"
              >
                Sign in
              </Link>{" "}
              to save this product to your wishlist.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
