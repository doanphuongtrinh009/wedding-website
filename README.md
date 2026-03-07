# Quỳnh Trâm Bridal Website

Production-ready bridal shop built with:

- Next.js 15 (App Router)
- TypeScript (strict)
- Tailwind CSS + shadcn-style components
- Prisma + PostgreSQL
- Clerk auth
- Cloudinary images
- Vercel deployment target
- VND as the default catalog and order currency

## Core Features Implemented

1. Product catalog (`/collections`)

- Search, sort, pagination
- Mobile-first responsive product cards
- Server-rendered for speed and SEO

2. Product detail (`/collections/[slug]`)

- Dynamic metadata per product
- Product JSON-LD structured data
- Try-on booking CTA and wishlist actions

3. Booking try-on system (`/book`)

- Server action backed booking form
- Product pre-select support from catalog/detail pages
- Stores bookings in Prisma (`Booking` model)

4. Wishlist (`/wishlist`)

- Auth-protected page
- Add/remove product favorites
- Backed by Prisma `WishlistItem` model

5. User account (`/account`)

- Booking history and status
- Wishlist and booking summary metrics
- Auth-protected customer profile view

6. Admin dashboard (`/admin`)

- Dress management (create + status/price/featured updates)
- Booking management (status + internal notes)
- Order management (order status + payment status + notes)
- Customer management (role updates)
- Revenue and operations stats

## SEO + Performance

- Metadata + Open Graph defaults in `src/app/layout.tsx`
- Product-level metadata in `src/app/collections/[slug]/page.tsx`
- Structured data for products (Schema.org JSON-LD)
- `robots.txt` and dynamic `sitemap.xml` routes
- Server components and targeted client islands for interactivity

## Architecture

- `src/app`: Routes and page-level composition
- `src/components/shop`: Catalog/detail/wishlist UI
- `src/actions`: Server actions for booking and wishlist
- `src/lib`: Auth, Prisma, formatting, and query/data utilities
- `prisma`: Schema + seed script

## Prisma Models

- `UserProfile`
- `Product`
- `ProductImage`
- `Booking`
- `WishlistItem`
- `Order`
- `OrderItem`

Schema: `prisma/schema.prisma`

## Local Setup

```bash
cp .env.example .env
npm install
npx prisma generate
npm run dev
```

Optional database workflows:

```bash
npm run db:migrate
npm run db:seed
npm run db:studio
```

If you already ran migrations before orders were added, create/apply a new migration:

```bash
npm run db:migrate
```

## Validation

- `npm run lint` passes
- `npm run typecheck` passes
- `npm run build` passes

Note: `sitemap.xml` serves base routes by default. Set `ENABLE_DATABASE_SITEMAP=true` (with a valid `DATABASE_URL`) to include product URLs.

## Next Build Priorities

1. Booking availability engine (time slots, blackout dates)
2. Checkout/deposit and notifications (email/SMS)
3. Image optimization pipeline with real Cloudinary assets
4. Analytics, monitoring, and conversion tracking
5. Advanced reporting exports and admin audit logs
