import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.16em] transition-colors",
  {
    variants: {
      variant: {
        default: "border-primary/20 bg-primary/10 text-primary",
        secondary: "border-brand-rose/35 bg-brand-blush/45 text-brand-cocoa",
        outline: "border-border bg-background/60 text-muted-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

type BadgeProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
