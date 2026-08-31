import { useCallback, useEffect, useState } from "react";

export type CopyStatus = "idle" | "copied" | "error";

export function useCopy() {
  const [status, setStatus] = useState<CopyStatus>("idle");

  const copy = useCallback(async (value: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      setStatus("error");
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      setStatus("copied");
    } catch {
      // Clipboard is unavailable over plain HTTP or when permission is denied.
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (status === "idle") return;
    const timer = window.setTimeout(() => setStatus("idle"), 2000);
    return () => window.clearTimeout(timer);
  }, [status]);

  return { status, copy };
}
