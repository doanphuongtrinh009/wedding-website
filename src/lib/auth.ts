import { auth, currentUser } from "@clerk/nextjs/server";
import { getLocale } from "next-intl/server";

import { Prisma, UserRole } from "@/generated/prisma/client";
import { redirect as intlRedirect } from "@/i18n/routing";
import { type LocalizedHref, resolveLocale } from "@/lib/localized-paths";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";

const isClerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);

function isClerkRuntimeDisabled() {
  return (
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes(
      "test_Y2xlcmsuZXhhbXBsZS5jb20k"
    ) || process.env.CLERK_SECRET_KEY?.includes("dummy")
  );
}

function canUseClerkAuth() {
  if (!isClerkConfigured || !isDatabaseConfigured) {
    return false;
  }

  return !isClerkRuntimeDisabled();
}

function getProfileByClerkUserId(clerkUserId: string) {
  return prisma.userProfile.findUnique({
    where: {
      clerkUserId
    }
  });
}

async function getRequestLocale() {
  try {
    return resolveLocale(await getLocale());
  } catch {
    return resolveLocale(undefined);
  }
}

async function redirectWithLocale(href: LocalizedHref): Promise<never> {
  const locale = await getRequestLocale();

  return intlRedirect({
    href,
    locale
  });
}

export async function getCurrentUserProfile() {
  if (!canUseClerkAuth()) {
    return null;
  }

  try {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    return getProfileByClerkUserId(userId);
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}

export async function ensureUserProfile() {
  if (!canUseClerkAuth()) {
    return null;
  }

  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const existingProfile = await getProfileByClerkUserId(userId);

  if (existingProfile) {
    return existingProfile;
  }

  const clerkUser = await currentUser();
  const primaryEmail = clerkUser?.emailAddresses.find(
    (emailAddress) => emailAddress.id === clerkUser.primaryEmailAddressId
  )?.emailAddress;

  const fallbackEmail = primaryEmail ?? `${userId}@local.quynhtrambridal`;

  try {
    return await prisma.userProfile.create({
      data: {
        clerkUserId: userId,
        email: fallbackEmail,
        firstName: clerkUser?.firstName ?? undefined,
        lastName: clerkUser?.lastName ?? undefined,
        phone: clerkUser?.phoneNumbers?.[0]?.phoneNumber ?? undefined
      }
    });
  } catch (error) {
    // Parallel first-logins can collide on unique constraints; fetch the row
    // created by the other request instead of failing the action/page render.
    const isUniqueConflict =
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002";

    if (!isUniqueConflict) {
      throw error;
    }

    return getProfileByClerkUserId(userId);
  }
}

export async function requireUserProfile() {
  if (!isDatabaseConfigured) {
    return redirectWithLocale("/");
  }

  const profile = await ensureUserProfile();

  if (!profile) {
    return redirectWithLocale("/sign-in");
  }

  return profile;
}

export async function requireAdmin() {
  const profile = await requireUserProfile();

  if (profile.role !== UserRole.ADMIN) {
    return redirectWithLocale("/");
  }

  return profile;
}
