"use server";

import { BookingStatus, Prisma, ProductStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { ensureUserProfile } from "@/lib/auth";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";

const toggleWishlistInputSchema = z.object({
  productId: z.string().cuid(),
  isWishlisted: z.boolean(),
  returnTo: z.string().optional()
});

export async function toggleWishlistAction(input: {
  productId: string;
  isWishlisted: boolean;
  returnTo?: string;
}) {
  const parsedInput = toggleWishlistInputSchema.safeParse(input);

  if (!parsedInput.success) {
    return { status: "error" as const, message: "Invalid wishlist action." };
  }

  if (!isDatabaseConfigured) {
    return {
      status: "error" as const,
      message: "Wishlist service is temporarily unavailable."
    };
  }

  const profile = await ensureUserProfile();

  if (!profile) {
    return { status: "signed_out" as const };
  }

  const product = await prisma.product.findFirst({
    where: {
      id: parsedInput.data.productId,
      status: ProductStatus.ACTIVE
    },
    select: {
      slug: true
    }
  });

  if (!product) {
    return { status: "error" as const, message: "Product is not available." };
  }

  if (parsedInput.data.isWishlisted) {
    await prisma.wishlistItem.deleteMany({
      where: {
        userId: profile.id,
        productId: parsedInput.data.productId
      }
    });
  } else {
    await prisma.wishlistItem.upsert({
      where: {
        userId_productId: {
          userId: profile.id,
          productId: parsedInput.data.productId
        }
      },
      update: {},
      create: {
        userId: profile.id,
        productId: parsedInput.data.productId
      }
    });
  }

  revalidatePath("/collections");
  revalidatePath(`/collections/${product.slug}`);
  revalidatePath("/wishlist");
  revalidatePath("/account");

  if (parsedInput.data.returnTo) {
    revalidatePath(parsedInput.data.returnTo);
  }

  return {
    status: "ok" as const,
    wishlisted: !parsedInput.data.isWishlisted
  };
}

const bookingSchema = z.object({
  productId: z.string().cuid().optional(),
  appointmentDate: z.string().date(),
  appointmentTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  eventDate: z.string().date().optional(),
  notes: z.string().trim().max(1500).optional(),
  timeZone: z.string().trim().min(1).max(64).optional()
});

function getAppointmentDateTime(
  appointmentDate: string,
  appointmentTime: string
) {
  const appointmentAt = new Date(`${appointmentDate}T${appointmentTime}:00`);

  if (Number.isNaN(appointmentAt.getTime())) {
    return null;
  }

  return appointmentAt;
}

const appointmentDurationInMinutes = 90;
const openBookingStatuses: BookingStatus[] = [
  BookingStatus.PENDING,
  BookingStatus.CONFIRMED
];
const slotUnavailableError = "SLOT_UNAVAILABLE";

function isValidTimeZone(timeZone: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

export async function createTryOnBookingAction(formData: FormData) {
  const parsedInput = bookingSchema.safeParse({
    productId: formData.get("productId") || undefined,
    appointmentDate: formData.get("appointmentDate"),
    appointmentTime: formData.get("appointmentTime"),
    eventDate: formData.get("eventDate") || undefined,
    notes: formData.get("notes") || undefined,
    timeZone: formData.get("timeZone") || undefined
  });

  if (!parsedInput.success) {
    redirect("/book?error=invalid-form");
  }

  if (!isDatabaseConfigured) {
    redirect("/book?error=service-unavailable");
  }

  const profile = await ensureUserProfile();

  if (!profile) {
    redirect("/sign-in?redirect_url=/book");
  }

  const appointmentAt = getAppointmentDateTime(
    parsedInput.data.appointmentDate,
    parsedInput.data.appointmentTime
  );

  if (!appointmentAt || appointmentAt <= new Date()) {
    redirect("/book?error=invalid-datetime");
  }
  const appointmentEndAt = new Date(
    appointmentAt.getTime() + appointmentDurationInMinutes * 60 * 1000
  );

  let productId: string | undefined;

  if (parsedInput.data.productId) {
    const product = await prisma.product.findFirst({
      where: {
        id: parsedInput.data.productId,
        status: ProductStatus.ACTIVE
      },
      select: {
        id: true
      }
    });

    if (!product) {
      redirect("/book?error=invalid-product");
    }

    productId = product.id;
  }

  let eventDate: Date | null = null;

  if (parsedInput.data.eventDate) {
    eventDate = new Date(`${parsedInput.data.eventDate}T00:00:00`);

    if (
      Number.isNaN(eventDate.getTime()) ||
      parsedInput.data.eventDate < parsedInput.data.appointmentDate
    ) {
      redirect("/book?error=invalid-datetime");
    }
  }

  const appointmentTimeZone =
    parsedInput.data.timeZone && isValidTimeZone(parsedInput.data.timeZone)
      ? parsedInput.data.timeZone
      : "UTC";

  try {
    await prisma.$transaction(
      async (tx) => {
        const overlappingBooking = await tx.booking.findFirst({
          where: {
            status: {
              in: openBookingStatuses
            },
            appointmentAt: {
              lt: appointmentEndAt
            },
            appointmentEndAt: {
              gt: appointmentAt
            }
          },
          select: {
            id: true
          }
        });

        if (overlappingBooking) {
          throw new Error(slotUnavailableError);
        }

        await tx.booking.create({
          data: {
            customerId: profile.id,
            productId,
            appointmentAt,
            appointmentEndAt,
            appointmentTimeZone,
            durationInMinutes: appointmentDurationInMinutes,
            eventDate,
            notes: parsedInput.data.notes
          }
        });
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable
      }
    );
  } catch (error) {
    const isSerializationConflict =
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2034";

    if (
      (error instanceof Error && error.message === slotUnavailableError) ||
      isSerializationConflict
    ) {
      redirect("/book?error=slot-unavailable");
    }

    throw error;
  }

  revalidatePath("/account");
  revalidatePath("/book");

  redirect("/account?booking=created");
}
