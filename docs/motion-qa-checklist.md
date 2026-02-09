# Motion QA Checklist

Use this checklist before production deploy.

1. Reduced motion

- Enable OS/browser reduced motion and confirm route transitions, hero stagger, grid stagger, gallery crossfades, toast transitions, and button micro-interactions are minimized.

2. Route transitions

- Navigate between `/`, `/collections`, `/collections/[slug]`, `/book`, `/wishlist`.
- Confirm subtle fade + rise only, no flicker, no scroll jump.

3. Hero reveal

- Refresh homepage and confirm headline, copy, and CTA reveal in sequence.
- Confirm no layout shift during reveal.

4. Product cards and grids

- Confirm grid stagger only runs once per section reveal.
- Confirm hover lift/zoom remains subtle on desktop and does not interfere with taps on mobile.

5. Product gallery

- Switch thumbnails and confirm smooth crossfade.
- Confirm active thumbnail focus ring is visible via keyboard.

6. Booking form

- Submit with invalid values and confirm inline errors + subtle shake.
- Submit valid request and confirm flow proceeds to account success state.

7. Toasts

- Trigger wishlist error and verify toast enters/exits consistently.
- Confirm toast does not block core CTA taps on mobile.

## Global Timing Controls

Edit `src/components/motion/variants.ts`:

- `motionTimings.fast`
- `motionTimings.base`
- `motionTimings.slow`
- `motionTimings.stagger`
- `motionEase`

These values drive route transitions, section reveals, stagger behavior, and toast transitions.
