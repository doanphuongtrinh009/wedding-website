export const brandPalette = [
  { name: "Ivory", token: "brand-ivory", swatchClass: "bg-brand-ivory" },
  { name: "Pearl", token: "brand-pearl", swatchClass: "bg-brand-pearl" },
  { name: "Blush", token: "brand-blush", swatchClass: "bg-brand-blush" },
  { name: "Rose", token: "brand-rose", swatchClass: "bg-brand-rose" },
  { name: "Taupe", token: "brand-taupe", swatchClass: "bg-brand-taupe" },
  { name: "Cocoa", token: "brand-cocoa", swatchClass: "bg-brand-cocoa" },
  { name: "Gold", token: "brand-gold", swatchClass: "bg-brand-gold" }
] as const;

export const typographyScale = [
  {
    label: "Display",
    token: "font-display + text-display",
    note: "Editorial headlines"
  },
  {
    label: "Body",
    token: "font-sans + text-body",
    note: "Readable long-form and UI copy"
  },
  {
    label: "Overline",
    token: "text-overline",
    note: "Metadata and section labels"
  }
] as const;

export const spacingScale = [
  { label: "2XS", value: "0.5rem", token: "space-2xs" },
  { label: "XS", value: "0.75rem", token: "space-xs" },
  { label: "SM", value: "1rem", token: "space-sm" },
  { label: "MD", value: "1.5rem", token: "space-md" },
  { label: "LG", value: "2rem", token: "space-lg" },
  { label: "XL", value: "3rem", token: "space-xl" },
  { label: "2XL", value: "4rem", token: "space-2xl" },
  { label: "3XL", value: "6rem", token: "space-3xl" }
] as const;
