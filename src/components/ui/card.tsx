import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-2xl border text-card-foreground transition-[transform,opacity,box-shadow] duration-300 ease-out motion-safe:will-change-transform",
  {
    variants: {
      variant: {
        default:
          "border-border/70 bg-card shadow-soft motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-editorial",
        elevated:
          "border-brand-pearl/90 bg-card shadow-luxury motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-luxury",
        editorial:
          "border-border/65 bg-card/90 shadow-editorial backdrop-blur-sm hover:border-brand-taupe/20 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-luxury",
        product:
          "border-border/70 bg-card shadow-soft motion-safe:hover:-translate-y-1.5 motion-safe:hover:shadow-luxury motion-safe:hover:border-brand-taupe/30"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

type CardProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants>;

function Card({ className, variant, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant, className }))} {...props} />
  );
}

function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-2 p-5 sm:p-6", className)} {...props} />;
}

function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-display text-2xl leading-tight tracking-tight",
        className
      )}
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-5 pt-0 sm:p-6 sm:pt-0", className)} {...props} />
  );
}

function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-5 pt-0 sm:p-6 sm:pt-0", className)} {...props} />
  );
}

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
};
