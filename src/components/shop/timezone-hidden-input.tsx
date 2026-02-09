"use client";

import { useEffect, useState } from "react";

const fallbackTimeZone = "UTC";

export function TimezoneHiddenInput() {
  const [timeZone, setTimeZone] = useState(fallbackTimeZone);

  useEffect(() => {
    try {
      const resolved = Intl.DateTimeFormat().resolvedOptions().timeZone;

      if (resolved) {
        setTimeZone(resolved);
      }
    } catch {
      setTimeZone(fallbackTimeZone);
    }
  }, []);

  return <input type="hidden" name="timeZone" value={timeZone} />;
}
