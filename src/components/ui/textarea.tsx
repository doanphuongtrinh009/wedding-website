import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "flex min-h-32 w-full rounded-2xl border border-input/85 bg-background/80 px-4 py-3 text-sm text-foreground shadow-sm transition-all placeholder:text-muted-foreground/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
