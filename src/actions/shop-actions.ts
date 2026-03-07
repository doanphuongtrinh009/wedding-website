"use server";

import { z } from "zod";

import { BookingStatus, Prisma, ProductStatus } from "@/generated/prisma/client";
import { redirect as intlRedirect } from "@/i18n/routing";
import { ensureUserProfile } from "@/lib/auth";
import {
  getLocalizedPath,
  type LocalizedHref,
  normalizeInternalPath,
  resolveLocale
} from "@/lib/localized-paths";
import { revalidateLocalizedPath } from "@/lib/localized-revalidation";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";

const toggleWishlistInputSchema = z.object({
  productId: z.string().cuid(),
  isWishlisted: z.boolean(),
  locale: z.string().optional(),
  returnTo: z.string().optional()
});

function redirectWithLocale(
  locale: string | undefined,
  href: LocalizedHref
): never {
  return intlRedirect({
    href,
    locale: resolveLocale(locale)
  });
}

export async function toggleWishlistAction(input: {
  productId: string;
  isWishlisted: boolean;
  locale?: string;
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

  revalidateLocalizedPath("/collections");
  revalidateLocalizedPath(`/collections/${product.slug}`);
  revalidateLocalizedPath("/wishlist");
  revalidateLocalizedPath("/account");

  const returnTo = normalizeInternalPath(parsedInput.data.returnTo);

  if (returnTo) {
    revalidateLocalizedPath(returnTo);
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
  services: z
    .array(z.enum(["makeup", "photo"]))
    .max(2)
    .optional(),
  timeZone: z.string().trim().min(1).max(64).optional()
});

type ZonedDateTimeParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

const zonedDateTimeFormatters = new Map<string, Intl.DateTimeFormat>();

function getZonedDateTimeFormatter(timeZone: string) {
  const existingFormatter = zonedDateTimeFormatters.get(timeZone);

  if (existingFormatter) {
    return existingFormatter;
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  zonedDateTimeFormatters.set(timeZone, formatter);

  return formatter;
}

function getZonedDateTimeParts(
  date: Date,
  timeZone: string
): ZonedDateTimeParts {
  const parts = getZonedDateTimeFormatter(timeZone)
    .formatToParts(date)
    .reduce<Partial<ZonedDateTimeParts>>((accumulator, part) => {
      if (part.type === "literal") {
        return accumulator;
      }

      if (
        part.type === "year" ||
        part.type === "month" ||
        part.type === "day" ||
        part.type === "hour" ||
        part.type === "minute" ||
        part.type === "second"
      ) {
        accumulator[part.type] = Number(part.value);
      }

      return accumulator;
    }, {});

  return {
    year: parts.year ?? 0,
    month: parts.month ?? 0,
    day: parts.day ?? 0,
    hour: parts.hour ?? 0,
    minute: parts.minute ?? 0,
    second: parts.second ?? 0
  };
}

function getTimeZoneOffsetMs(date: Date, timeZone: string) {
  const zoned = getZonedDateTimeParts(date, timeZone);
  const zonedAsUtcMs = Date.UTC(
    zoned.year,
    zoned.month - 1,
    zoned.day,
    zoned.hour,
    zoned.minute,
    zoned.second
  );

  return zonedAsUtcMs - date.getTime();
}

function parseDateAndTimeParts(
  appointmentDate: string,
  appointmentTime: string
) {
  const [year, month, day] = appointmentDate.split("-").map(Number);
  const [hour, minute] = appointmentTime.split(":").map(Number);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    !Number.isInteger(hour) ||
    !Number.isInteger(minute)
  ) {
    return null;
  }

  return { year, month, day, hour, minute };
}

function getAppointmentDateTime(
  appointmentDate: string,
  appointmentTime: string,
  timeZone: string
) {
  const parsedParts = parseDateAndTimeParts(appointmentDate, appointmentTime);

  if (!parsedParts) {
    return null;
  }

  const naiveUtcMs = Date.UTC(
    parsedParts.year,
    parsedParts.month - 1,
    parsedParts.day,
    parsedParts.hour,
    parsedParts.minute,
    0
  );

  if (Number.isNaN(naiveUtcMs)) {
    return null;
  }

  // Convert user-selected local wall clock time in `timeZone`
  // into a UTC instant, then run one extra pass for DST edge cases.
  let appointmentAt = new Date(
    naiveUtcMs - getTimeZoneOffsetMs(new Date(naiveUtcMs), timeZone)
  );
  appointmentAt = new Date(
    naiveUtcMs - getTimeZoneOffsetMs(appointmentAt, timeZone)
  );

  if (Number.isNaN(appointmentAt.getTime())) {
    return null;
  }

  const roundTrip = getZonedDateTimeParts(appointmentAt, timeZone);
  const isSameLocalDateTime =
    roundTrip.year === parsedParts.year &&
    roundTrip.month === parsedParts.month &&
    roundTrip.day === parsedParts.day &&
    roundTrip.hour === parsedParts.hour &&
    roundTrip.minute === parsedParts.minute;

  if (!isSameLocalDateTime) {
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
  const locale = resolveLocale(
    typeof formData.get("locale") === "string"
      ? String(formData.get("locale"))
      : undefined
  );
  const selectedServices = formData
    .getAll("services")
    .filter((value): value is string => typeof value === "string");

  const parsedInput = bookingSchema.safeParse({
    productId: formData.get("productId") || undefined,
    appointmentDate: formData.get("appointmentDate"),
    appointmentTime: formData.get("appointmentTime"),
    eventDate: formData.get("eventDate") || undefined,
    notes: formData.get("notes") || undefined,
    services: selectedServices.length > 0 ? selectedServices : undefined,
    timeZone: formData.get("timeZone") || undefined
  });

  if (!parsedInput.success) {
    redirectWithLocale(locale, {
      pathname: "/book",
      query: {
        error: "invalid-form"
      }
    });
  }

  const bookingInput = parsedInput.data;

  if (!isDatabaseConfigured) {
    redirectWithLocale(locale, {
      pathname: "/book",
      query: {
        error: "service-unavailable"
      }
    });
  }

  const profile = await ensureUserProfile();

  if (!profile) {
    redirectWithLocale(locale, {
      pathname: "/sign-in",
      query: {
        redirect_url: getLocalizedPath(locale, "/book")
      }
    });
  }

  const appointmentTimeZone =
    bookingInput.timeZone && isValidTimeZone(bookingInput.timeZone)
      ? bookingInput.timeZone
      : "UTC";

  const appointmentAt = getAppointmentDateTime(
    bookingInput.appointmentDate,
    bookingInput.appointmentTime,
    appointmentTimeZone
  );

  if (!appointmentAt || appointmentAt <= new Date()) {
    redirectWithLocale(locale, {
      pathname: "/book",
      query: {
        error: "invalid-datetime"
      }
    });
  }
  const appointmentEndAt = new Date(
    appointmentAt.getTime() + appointmentDurationInMinutes * 60 * 1000
  );

  let productId: string | undefined;

  if (bookingInput.productId) {
    const product = await prisma.product.findFirst({
      where: {
        id: bookingInput.productId,
        status: ProductStatus.ACTIVE
      },
      select: {
        id: true
      }
    });

    if (!product) {
      redirectWithLocale(locale, {
        pathname: "/book",
        query: {
          error: "invalid-product"
        }
      });
    }

    productId = product.id;
  }

  let eventDate: Date | null = null;

  if (bookingInput.eventDate) {
    eventDate = new Date(`${bookingInput.eventDate}T00:00:00`);

    if (
      Number.isNaN(eventDate.getTime()) ||
      bookingInput.eventDate < bookingInput.appointmentDate
    ) {
      redirectWithLocale(locale, {
        pathname: "/book",
        query: {
          error: "invalid-datetime"
        }
      });
    }
  }

  const dedupedServices = Array.from(new Set(bookingInput.services ?? []));
  const serviceNotePrefix =
    dedupedServices.length > 0 ? `[addons] ${dedupedServices.join(", ")}` : "";
  const bookingNotes = [serviceNotePrefix, bookingInput.notes]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value))
    .join("\n");

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
            notes: bookingNotes || undefined
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
      redirectWithLocale(locale, {
        pathname: "/book",
        query: {
          error: "slot-unavailable"
        }
      });
    }

    throw error;
  }

  revalidateLocalizedPath("/account");
  revalidateLocalizedPath("/book");

  redirectWithLocale(locale, {
    pathname: "/account",
    query: {
      booking: "created"
    }
  });
}
