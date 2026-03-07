"use client";

import { useEffect, useRef } from "react";

const fallbackTimeZone = "UTC";

export function TimezoneHiddenInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const resolved = Intl.DateTimeFormat().resolvedOptions().timeZone;

      if (resolved && inputRef.current) {
        inputRef.current.value = resolved;
      }
    } catch {
      if (inputRef.current) {
        inputRef.current.value = fallbackTimeZone;
      }
    }
  }, []);

  return (
    <input
      ref={inputRef}
      type="hidden"
      name="timeZone"
      defaultValue={fallbackTimeZone}
    />
  );
}
