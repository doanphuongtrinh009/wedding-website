import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${siteConfig.url}/collections`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9
    },
    {
      url: `${siteConfig.url}/book`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8
    },
    {
      url: `${siteConfig.url}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8
    },
    {
      url: `${siteConfig.url}/services/makeup`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8
    },
    {
      url: `${siteConfig.url}/services/photo`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8
    }
  ];

  const databaseUrl = process.env.DATABASE_URL;
  const enableDatabaseSitemap = process.env.ENABLE_DATABASE_SITEMAP !== "false";

  if (!enableDatabaseSitemap || !databaseUrl || databaseUrl === "undefined") {
    return baseRoutes;
  }

  let products: Array<{ slug: string; updatedAt: Date }> = [];

  try {
    const [{ prisma }, { ProductStatus }] = await Promise.all([
      import("@/lib/prisma"),
      import("@/generated/prisma/client")
    ]);

    products = await prisma.product.findMany({
      where: {
        status: ProductStatus.ACTIVE
      },
      select: {
        slug: true,
        updatedAt: true
      }
    });
  } catch {
    // Allow build to complete in environments without a configured database URL.
    products = [];
  }

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteConfig.url}/collections/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8
  }));

  return [...baseRoutes, ...productRoutes];
}
