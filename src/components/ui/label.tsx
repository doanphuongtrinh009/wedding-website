import type { LabelHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export { Label };
