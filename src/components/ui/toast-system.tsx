"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { CircleAlert, CircleCheck, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from "react";

import { toastMotion } from "@/components/motion/variants";
import { cn } from "@/lib/utils";

type ToastTone = "default" | "destructive";

type ToastInput = {
  title: string;
  description?: string;
  tone?: ToastTone;
  durationMs?: number;
};

type ToastItem = ToastInput & {
  id: string;
  tone: ToastTone;
};

type ToastContextValue = {
  toast: (input: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function getToastId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    ({ durationMs = 4200, tone = "default", ...input }: ToastInput) => {
      const id = getToastId();
      const nextToast: ToastItem = { id, tone, ...input };

      setToasts((current) => [...current, nextToast]);

      window.setTimeout(() => {
        dismissToast(id);
      }, durationMs);
    },
    [dismissToast]
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

function ToastViewport({
  toasts,
  onDismiss
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-0 top-3 z-[70] flex flex-col items-center gap-2 px-3 md:inset-x-auto md:right-4 md:top-4 md:items-end"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <m.div
            key={toast.id}
            variants={toastMotion}
            initial={shouldReduceMotion ? false : "initial"}
            animate={shouldReduceMotion ? "animate" : "animate"}
            exit={shouldReduceMotion ? "exit" : "exit"}
            className={cn(
              "bg-background/96 pointer-events-auto w-full max-w-sm rounded-2xl border p-3 shadow-luxury backdrop-blur",
              toast.tone === "destructive"
                ? "border-destructive/35"
                : "border-border/70"
            )}
            role="status"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                {toast.tone === "destructive" ? (
                  <CircleAlert
                    className="size-4 text-destructive"
                    aria-hidden="true"
                  />
                ) : (
                  <CircleCheck
                    className="size-4 text-primary"
                    aria-hidden="true"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {toast.title}
                </p>
                {toast.description ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {toast.description}
                  </p>
                ) : null}
              </div>

              <button
                type="button"
                aria-label="Dismiss notification"
                className="inline-flex size-7 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition hover:text-foreground"
                onClick={() => onDismiss(toast.id)}
              >
                <X className="size-3" aria-hidden="true" />
              </button>
            </div>
          </m.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider.");
  }

  return context;
}
