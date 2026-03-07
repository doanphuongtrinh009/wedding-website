import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "flex min-h-32 w-full rounded-2xl border border-input/85 bg-background/80 px-4 py-3 text-sm text-foreground shadow-xs transition-[border-color,box-shadow,transform] duration-200 ease-out placeholder:text-muted-foreground/85 focus-visible:border-ring/60 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/55 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:shadow-[0_0_0_6px_rgba(112,83,64,0.12)] disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
