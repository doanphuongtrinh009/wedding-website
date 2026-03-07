import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl border text-[0.8rem] font-semibold uppercase tracking-[0.11em] transition-[transform,opacity,box-shadow] duration-300 ease-out motion-safe:will-change-transform motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-[1.015] motion-safe:active:translate-y-px motion-safe:active:scale-[0.992] disabled:pointer-events-none disabled:opacity-50 outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "border-primary/80 bg-[linear-gradient(135deg,hsl(var(--brand-cocoa))_0%,hsl(var(--primary))_100%)] text-primary-foreground shadow-soft hover:brightness-110 hover:shadow-luxury",
        secondary:
          "border-secondary bg-secondary/95 text-secondary-foreground shadow-xs hover:border-brand-rose/60 hover:bg-brand-blush/55 hover:shadow-editorial",
        outline:
          "border-border/85 bg-background/70 text-foreground shadow-xs backdrop-blur-sm hover:bg-card/90 hover:shadow-editorial",
        ghost:
          "border-transparent bg-transparent text-muted-foreground hover:bg-secondary/45 hover:text-foreground",
        link: "border-transparent p-0 text-foreground underline-offset-8 hover:underline"
      },
      size: {
        default: "h-11 px-7 sm:h-12 sm:px-8",
        sm: "h-9 px-4 text-[0.66rem]",
        lg: "h-12 px-9 sm:h-14 sm:px-11",
        icon: "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
