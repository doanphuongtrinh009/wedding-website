import { cache } from "react";

import { BookingStatus, Prisma, ProductStatus } from "@/generated/prisma/client";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";

const productCardSelect = {
  id: true,
  slug: true,
  name: true,
  description: true,
  priceInCents: true,
  currency: true,
  isFeatured: true,
  images: {
    take: 1,
    orderBy: {
      position: "asc"
    },
    select: {
      secureUrl: true,
      altText: true
    }
  }
} satisfies Prisma.ProductSelect;

export type ProductCard = Prisma.ProductGetPayload<{
  select: typeof productCardSelect;
}>;

export type CatalogSort = "featured" | "newest" | "price_asc" | "price_desc";

export const catalogSortOptions: ReadonlyArray<CatalogSort> = [
  "featured",
  "newest",
  "price_asc",
  "price_desc"
] as const;

function getCatalogOrderBy(
  sort: CatalogSort
): Prisma.ProductOrderByWithRelationInput[] {
  if (sort === "price_asc") {
    return [{ priceInCents: "asc" }, { createdAt: "desc" }];
  }

  if (sort === "price_desc") {
    return [{ priceInCents: "desc" }, { createdAt: "desc" }];
  }

  if (sort === "newest") {
    return [{ createdAt: "desc" }];
  }

  return [{ isFeatured: "desc" }, { createdAt: "desc" }];
}

export async function getCatalogProducts({
  query,
  sort,
  page,
  pageSize = 12
}: {
  query?: string;
  sort: CatalogSort;
  page: number;
  pageSize?: number;
}) {
  if (!isDatabaseConfigured) {
    return {
      items: [],
      total: 0,
      page: 1,
      totalPages: 1
    };
  }

  const searchQuery = query?.trim();
  const where: Prisma.ProductWhereInput = {
    status: ProductStatus.ACTIVE,
    ...(searchQuery
      ? {
        OR: [
          {
            name: {
              contains: searchQuery,
              mode: 'insensitive'
            }
          },
          {
            description: {
              contains: searchQuery,
              mode: 'insensitive'
            }
          },
          {
            slug: {
              contains: searchQuery,
              mode: 'insensitive'
            }
          }
        ]
      }
      : {})
  };

  const safePage = Math.max(page, 1);
  const total = await prisma.product.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const boundedPage = Math.min(safePage, totalPages);
  const skip = (boundedPage - 1) * pageSize;

  const items = await prisma.product.findMany({
    where,
    orderBy: getCatalogOrderBy(sort),
    skip,
    take: pageSize,
    select: productCardSelect
  });

  return {
    items,
    total,
    page: boundedPage,
    totalPages
  };
}

export const getFeaturedProducts = cache(async (limit: number) => {
  if (!isDatabaseConfigured) {
    return [];
  }

  return prisma.product.findMany({
    where: {
      status: ProductStatus.ACTIVE,
      isFeatured: true
    },
    orderBy: [{ createdAt: "desc" }],
    take: limit,
    select: productCardSelect
  });
});

export const getBookableProducts = cache(async () => {
  if (!isDatabaseConfigured) {
    return [];
  }

  return prisma.product.findMany({
    where: {
      status: ProductStatus.ACTIVE
    },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    select: {
      id: true,
      slug: true,
      name: true
    }
  });
});

export const getProductBySlug = cache(async (slug: string) => {
  if (!isDatabaseConfigured) {
    return null;
  }

  return prisma.product.findFirst({
    where: {
      slug,
      status: ProductStatus.ACTIVE
    },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      priceInCents: true,
      currency: true,
      createdAt: true,
      updatedAt: true,
      isFeatured: true,
      images: {
        orderBy: {
          position: "asc"
        },
        select: {
          id: true,
          secureUrl: true,
          altText: true,
          position: true
        }
      }
    }
  });
});

export async function getWishlistProductIds(profileId: string) {
  if (!isDatabaseConfigured) {
    return new Set<string>();
  }

  const wishlistItems = await prisma.wishlistItem.findMany({
    where: {
      userId: profileId
    },
    select: {
      productId: true
    }
  });

  return new Set(wishlistItems.map((item) => item.productId));
}

export async function getWishlistProducts(profileId: string) {
  if (!isDatabaseConfigured) {
    return [];
  }

  return prisma.wishlistItem.findMany({
    where: {
      userId: profileId
    },
    orderBy: {
      createdAt: "desc"
    },
    select: {
      product: {
        select: productCardSelect
      }
    }
  });
}

export async function getAccountOverview(profileId: string) {
  if (!isDatabaseConfigured) {
    return {
      bookings: [],
      upcomingBookings: 0,
      wishlistCount: 0
    };
  }

  const [bookings, wishlistCount] = await Promise.all([
    prisma.booking.findMany({
      where: {
        customerId: profileId
      },
      orderBy: {
        appointmentAt: "desc"
      },
      take: 12,
      select: {
        id: true,
        bookingNumber: true,
        status: true,
        appointmentAt: true,
        eventDate: true,
        createdAt: true,
        product: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    }),
    prisma.wishlistItem.count({
      where: {
        userId: profileId
      }
    })
  ]);

  const upcomingBookings = bookings.filter(
    (booking) =>
      booking.status === BookingStatus.PENDING ||
      booking.status === BookingStatus.CONFIRMED
  ).length;

  return {
    bookings,
    upcomingBookings,
    wishlistCount
  };
}
