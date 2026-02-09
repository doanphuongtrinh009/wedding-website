import { UserRole } from "@prisma/client";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { isDatabaseConfigured, prisma } from "@/lib/prisma";

const isClerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);

export async function getCurrentUserProfile() {
  if (!isClerkConfigured || !isDatabaseConfigured) {
    return null;
  }

  // Skip Clerk auth if using dummy/mock keys
  if (
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes("test_Y2xlcmsuZXhhbXBsZS5jb20k") ||
    process.env.CLERK_SECRET_KEY?.includes("dummy")
  ) {
    return null;
  }

  try {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    return prisma.userProfile.findUnique({
      where: { clerkUserId: userId }
    });
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}

export async function ensureUserProfile() {
  if (!isClerkConfigured || !isDatabaseConfigured) {
    return null;
  }

  // Skip Clerk auth if using dummy/mock keys
  if (
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes("test_Y2xlcmsuZXhhbXBsZS5jb20k") ||
    process.env.CLERK_SECRET_KEY?.includes("dummy")
  ) {
    return null;
  }

  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const existingProfile = await prisma.userProfile.findUnique({
    where: { clerkUserId: userId }
  });

  if (existingProfile) {
    return existingProfile;
  }

  const clerkUser = await currentUser();
  const primaryEmail = clerkUser?.emailAddresses.find(
    (emailAddress) => emailAddress.id === clerkUser.primaryEmailAddressId
  )?.emailAddress;

  const fallbackEmail = primaryEmail ?? `${userId}@local.maison-etoile`;

  return prisma.userProfile.create({
    data: {
      clerkUserId: userId,
      email: fallbackEmail,
      firstName: clerkUser?.firstName ?? undefined,
      lastName: clerkUser?.lastName ?? undefined,
      phone: clerkUser?.phoneNumbers?.[0]?.phoneNumber ?? undefined
    }
  });
}

export async function requireUserProfile() {
  if (!isDatabaseConfigured) {
    redirect("/");
  }

  const profile = await ensureUserProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  return profile;
}

export async function requireAdmin() {
  const profile = await requireUserProfile();

  if (profile.role !== UserRole.ADMIN) {
    redirect("/");
  }

  return profile;
}
