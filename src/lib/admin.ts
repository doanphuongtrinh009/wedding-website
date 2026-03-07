import {
  BookingStatus,
  PaymentStatus,
  Prisma,
  ProductStatus,
  UserRole
} from "@/generated/prisma/client";

import { siteConfig } from "@/config/site";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";

const acceptedPaymentStatuses: PaymentStatus[] = [
  PaymentStatus.PAID,
  PaymentStatus.PARTIALLY_PAID
];
const maxAdminListSize = 200;
const defaultAdminListSize = 100;

function getTake(take?: number) {
  if (!take) {
    return defaultAdminListSize;
  }

  return Math.min(Math.max(take, 1), maxAdminListSize);
}

const adminDressSelect = {
  id: true,
  slug: true,
  name: true,
  currency: true,
  priceInCents: true,
  status: true,
  isFeatured: true,
  updatedAt: true,
  _count: {
    select: {
      bookings: true,
      wishlistItems: true
    }
  }
} satisfies Prisma.ProductSelect;

const adminBookingSelect = {
  id: true,
  bookingNumber: true,
  status: true,
  appointmentAt: true,
  appointmentEndAt: true,
  appointmentTimeZone: true,
  durationInMinutes: true,
  eventDate: true,
  notes: true,
  internalNotes: true,
  customer: {
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true
    }
  },
  product: {
    select: {
      id: true,
      name: true,
      slug: true
    }
  }
} satisfies Prisma.BookingSelect;

const adminOrderSelect = {
  id: true,
  orderNumber: true,
  status: true,
  paymentStatus: true,
  totalInCents: true,
  currency: true,
  notes: true,
  createdAt: true,
  customer: {
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true
    }
  },
  _count: {
    select: {
      items: true
    }
  }
} satisfies Prisma.OrderSelect;

const adminCustomerSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  createdAt: true,
  _count: {
    select: {
      bookings: true,
      orders: true,
      wishlistItems: true
    }
  }
} satisfies Prisma.UserProfileSelect;

export type AdminDress = Prisma.ProductGetPayload<{
  select: typeof adminDressSelect;
}>;

export type AdminBooking = Prisma.BookingGetPayload<{
  select: typeof adminBookingSelect;
}>;

export type AdminOrder = Prisma.OrderGetPayload<{
  select: typeof adminOrderSelect;
}>;

export type AdminCustomer = Prisma.UserProfileGetPayload<{
  select: typeof adminCustomerSelect;
}>;

export async function getAdminSummaryStats() {
  if (!isDatabaseConfigured) {
    return {
      totalDresses: 0,
      activeDresses: 0,
      totalBookings: 0,
      pendingBookings: 0,
      totalOrders: 0,
      paidOrders: 0,
      totalCustomers: 0,
      totalRevenueInCents: 0,
      monthlyRevenueInCents: 0,
      averageOrderValueInCents: 0,
      currency: siteConfig.defaultCurrency
    };
  }

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalDresses,
    activeDresses,
    totalBookings,
    pendingBookings,
    totalOrders,
    paidOrders,
    totalCustomers,
    revenueAll,
    revenueMonth
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({
      where: {
        status: ProductStatus.ACTIVE
      }
    }),
    prisma.booking.count(),
    prisma.booking.count({
      where: {
        status: {
          in: [BookingStatus.PENDING, BookingStatus.CONFIRMED]
        }
      }
    }),
    prisma.order.count(),
    prisma.order.count({
      where: {
        paymentStatus: {
          in: acceptedPaymentStatuses
        }
      }
    }),
    prisma.userProfile.count({
      where: {
        role: UserRole.CUSTOMER
      }
    }),
    prisma.order.aggregate({
      where: {
        paymentStatus: {
          in: acceptedPaymentStatuses
        }
      },
      _sum: {
        totalInCents: true
      }
    }),
    prisma.order.aggregate({
      where: {
        paymentStatus: {
          in: acceptedPaymentStatuses
        },
        createdAt: {
          gte: monthStart
        }
      },
      _sum: {
        totalInCents: true
      }
    })
  ]);

  const totalRevenueInCents = revenueAll._sum.totalInCents ?? 0;
  const monthlyRevenueInCents = revenueMonth._sum.totalInCents ?? 0;
  const averageOrderValueInCents =
    paidOrders > 0 ? Math.round(totalRevenueInCents / paidOrders) : 0;

  return {
    totalDresses,
    activeDresses,
    totalBookings,
    pendingBookings,
    totalOrders,
    paidOrders,
    totalCustomers,
    totalRevenueInCents,
    monthlyRevenueInCents,
    averageOrderValueInCents,
    currency: siteConfig.defaultCurrency
  };
}

export async function getAdminDresses(options?: { take?: number }) {
  if (!isDatabaseConfigured) {
    return [];
  }

  return prisma.product.findMany({
    orderBy: [{ updatedAt: "desc" }],
    take: getTake(options?.take),
    select: adminDressSelect
  });
}

export async function getAdminBookings(options?: { take?: number }) {
  if (!isDatabaseConfigured) {
    return [];
  }

  return prisma.booking.findMany({
    orderBy: [{ appointmentAt: "desc" }],
    take: getTake(options?.take),
    select: adminBookingSelect
  });
}

export async function getAdminOrders(options?: { take?: number }) {
  if (!isDatabaseConfigured) {
    return [];
  }

  return prisma.order.findMany({
    orderBy: [{ createdAt: "desc" }],
    take: getTake(options?.take),
    select: adminOrderSelect
  });
}

export async function getAdminCustomers(options?: { take?: number }) {
  if (!isDatabaseConfigured) {
    return [];
  }

  return prisma.userProfile.findMany({
    orderBy: [{ createdAt: "desc" }],
    take: getTake(options?.take),
    select: adminCustomerSelect
  });
}
