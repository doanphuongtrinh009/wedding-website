"use server";

import {
  BookingStatus,
  OrderStatus,
  PaymentStatus,
  Prisma,
  ProductStatus,
  UserRole
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const defaultProductCurrency = "VND";

function revalidatePaths(paths: string[]) {
  for (const path of new Set(paths)) {
    revalidatePath(path);
  }
}

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parsePriceInCents(priceValue: string, currency: string) {
  const normalized = priceValue.replace(/,/g, "").trim();
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  if (currency === "VND") {
    return Math.round(parsed);
  }

  return Math.round(parsed * 100);
}

async function createDressWithUniqueSlug(data: {
  name: string;
  slug: string;
  description: string;
  priceInCents: number;
  currency: string;
  status: ProductStatus;
  isFeatured: boolean;
}) {
  let candidateSlug = data.slug;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      await prisma.product.create({
        data: {
          name: data.name,
          slug: candidateSlug,
          description: data.description,
          priceInCents: data.priceInCents,
          status: data.status,
          isFeatured: data.isFeatured,
          currency: data.currency
        }
      });
      return;
    } catch (error) {
      const target =
        error instanceof Prisma.PrismaClientKnownRequestError
          ? error.meta?.target
          : undefined;
      const hasSlugTarget = Array.isArray(target)
        ? target.includes("slug")
        : typeof target === "string"
          ? target.includes("slug")
          : false;
      const isSlugConflict =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002" &&
        hasSlugTarget;

      if (!isSlugConflict) {
        throw error;
      }

      const suffix = Math.random().toString(36).slice(2, 6);
      candidateSlug = `${data.slug}-${suffix}`;
    }
  }

  throw new Error("Unable to create a unique slug for this dress.");
}

const createDressSchema = z.object({
  name: z.string().trim().min(2).max(140),
  slug: z.string().trim().max(160).optional(),
  description: z.string().trim().min(20).max(3000),
  price: z.string().min(1),
  status: z.nativeEnum(ProductStatus),
  isFeatured: z.boolean().default(false)
});

export async function createDressAction(formData: FormData) {
  await requireAdmin();

  const parsedInput = createDressSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    description: formData.get("description"),
    price: formData.get("price"),
    status: formData.get("status"),
    isFeatured: formData.get("isFeatured") === "on"
  });

  if (!parsedInput.success) {
    return;
  }

  const priceInCents = parsePriceInCents(
    parsedInput.data.price,
    defaultProductCurrency
  );

  if (!priceInCents) {
    return;
  }

  const candidateSlug = slugify(parsedInput.data.slug || parsedInput.data.name);

  if (!candidateSlug) {
    return;
  }

  await createDressWithUniqueSlug({
    name: parsedInput.data.name,
    slug: candidateSlug,
    description: parsedInput.data.description,
    priceInCents,
    currency: defaultProductCurrency,
    status: parsedInput.data.status,
    isFeatured: parsedInput.data.isFeatured
  });

  revalidatePaths(["/admin", "/admin/dresses", "/", "/collections"]);
}

const updateDressSchema = z.object({
  productId: z.string().cuid(),
  status: z.nativeEnum(ProductStatus),
  isFeatured: z.boolean().default(false),
  price: z.string().min(1)
});

export async function updateDressAction(formData: FormData) {
  await requireAdmin();

  const parsedInput = updateDressSchema.safeParse({
    productId: formData.get("productId"),
    status: formData.get("status"),
    isFeatured: formData.get("isFeatured") === "on",
    price: formData.get("price")
  });

  if (!parsedInput.success) {
    return;
  }

  const existingDress = await prisma.product.findUnique({
    where: {
      id: parsedInput.data.productId
    },
    select: {
      currency: true
    }
  });

  if (!existingDress) {
    return;
  }

  const priceInCents = parsePriceInCents(
    parsedInput.data.price,
    existingDress.currency
  );

  if (!priceInCents) {
    return;
  }

  const updatedDress = await prisma.product.update({
    where: {
      id: parsedInput.data.productId
    },
    data: {
      status: parsedInput.data.status,
      isFeatured: parsedInput.data.isFeatured,
      priceInCents
    },
    select: {
      slug: true
    }
  });

  revalidatePaths([
    "/admin",
    "/admin/dresses",
    "/",
    "/collections",
    `/collections/${updatedDress.slug}`
  ]);
}

const updateBookingSchema = z.object({
  bookingId: z.string().cuid(),
  status: z.nativeEnum(BookingStatus),
  internalNotes: z.string().trim().max(2000).optional()
});

export async function updateBookingAction(formData: FormData) {
  await requireAdmin();

  const parsedInput = updateBookingSchema.safeParse({
    bookingId: formData.get("bookingId"),
    status: formData.get("status"),
    internalNotes: formData.get("internalNotes") || undefined
  });

  if (!parsedInput.success) {
    return;
  }

  await prisma.booking.update({
    where: {
      id: parsedInput.data.bookingId
    },
    data: {
      status: parsedInput.data.status,
      internalNotes: parsedInput.data.internalNotes
    }
  });

  revalidatePaths(["/admin", "/admin/bookings", "/account"]);
}

const updateOrderSchema = z.object({
  orderId: z.string().cuid(),
  status: z.nativeEnum(OrderStatus),
  paymentStatus: z.nativeEnum(PaymentStatus),
  notes: z.string().trim().max(2000).optional()
});

export async function updateOrderAction(formData: FormData) {
  await requireAdmin();

  const parsedInput = updateOrderSchema.safeParse({
    orderId: formData.get("orderId"),
    status: formData.get("status"),
    paymentStatus: formData.get("paymentStatus"),
    notes: formData.get("notes") || undefined
  });

  if (!parsedInput.success) {
    return;
  }

  await prisma.order.update({
    where: {
      id: parsedInput.data.orderId
    },
    data: {
      status: parsedInput.data.status,
      paymentStatus: parsedInput.data.paymentStatus,
      notes: parsedInput.data.notes
    }
  });

  revalidatePaths(["/admin", "/admin/orders"]);
}

const updateCustomerRoleSchema = z.object({
  customerId: z.string().cuid(),
  role: z.nativeEnum(UserRole)
});

export async function updateCustomerRoleAction(formData: FormData) {
  const adminProfile = await requireAdmin();

  const parsedInput = updateCustomerRoleSchema.safeParse({
    customerId: formData.get("customerId"),
    role: formData.get("role")
  });

  if (!parsedInput.success) {
    return;
  }

  if (
    adminProfile.id === parsedInput.data.customerId &&
    parsedInput.data.role !== UserRole.ADMIN
  ) {
    return;
  }

  await prisma.userProfile.update({
    where: {
      id: parsedInput.data.customerId
    },
    data: {
      role: parsedInput.data.role
    }
  });

  revalidatePaths(["/admin", "/admin/customers"]);
}
