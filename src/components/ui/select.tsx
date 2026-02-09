import { ChevronDown } from "lucide-react";
import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

function Select({ className, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          "flex h-12 w-full appearance-none rounded-2xl border border-input/85 bg-background/80 px-4 pr-10 text-sm text-foreground shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

export { Select };
