import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "flex h-12 w-full rounded-2xl border border-input/85 bg-background/80 px-4 text-sm text-foreground shadow-sm transition-all placeholder:text-muted-foreground/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    />
  );
}

export { Input };
