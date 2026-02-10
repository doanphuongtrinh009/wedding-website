const fallbackPhoneDigits = "15551001010";
const fallbackSocialHandle = "quynhtrambridal";
const configuredPhoneDigits = (
  process.env.NEXT_PUBLIC_CONTACT_PHONE ?? fallbackPhoneDigits
).replace(/\D/g, "");

export const siteConfig = {
  name: "Quỳnh Trâm Bridal",
  description:
    "Luxury bridal styling, curated gowns, and private appointments for modern brides.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  keywords: [
    "bridal shop",
    "wedding dress boutique",
    "bridal try-on",
    "luxury bridal gowns",
    "wedding dress appointment"
  ],
  ogImage: "/og-image.svg",
  authEnabled: Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes(
      "test_Y2xlcmsuZXhhbXBsZS5jb20k"
    )
  ),
  support: {
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "+1 (555) 100-1010",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@quynhtrambridal.vn",
    whatsappUrl:
      process.env.NEXT_PUBLIC_WHATSAPP_URL ??
      `https://wa.me/${configuredPhoneDigits}?text=Hello%20Maison%20Etoile%2C%20I%20want%20to%20book%20a%20bridal%20fitting.`,
    zaloUrl:
      process.env.NEXT_PUBLIC_ZALO_URL ??
      `https://zalo.me/${configuredPhoneDigits}`
  },
  social: {
    facebookUrl:
      process.env.NEXT_PUBLIC_FACEBOOK_URL ??
      `https://facebook.com/${fallbackSocialHandle}`,
    instagramUrl:
      process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
      `https://instagram.com/${fallbackSocialHandle}`,
    tiktokUrl:
      process.env.NEXT_PUBLIC_TIKTOK_URL ??
      `https://www.tiktok.com/@${fallbackSocialHandle}`,
    youtubeUrl:
      process.env.NEXT_PUBLIC_YOUTUBE_URL ??
      `https://www.youtube.com/@${fallbackSocialHandle}`
  }
} as const;
