"use client";

import { m, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  fadeUp,
  motionEase,
  staggerContainer
} from "@/components/motion/variants";
import { TimezoneHiddenInput } from "@/components/shop/timezone-hidden-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type BookingProduct = {
  id: string;
  name: string;
};

type BookingRequestFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  products: BookingProduct[];
  selectedProductId: string;
};

function SubmitBookingButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? "Submitting..." : "Submit booking request"}
    </Button>
  );
}

export function BookingRequestForm({
  action,
  products,
  selectedProductId
}: BookingRequestFormProps) {
  const shouldReduceMotion = useReducedMotion();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [shouldShake, setShouldShake] = useState(false);
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  useEffect(() => {
    if (!shouldShake) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setShouldShake(false);
    }, 360);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [shouldShake]);

  function triggerShake() {
    if (!shouldReduceMotion) {
      setShouldShake(true);
    }
  }

  function setError(name: string, message: string) {
    setFieldErrors((current) => ({ ...current, [name]: message }));
  }

  function clearError(name: string) {
    setFieldErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  function onInvalidCapture(event: FormEvent<HTMLFormElement>) {
    const target = event.target as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement;

    if (!target.name) {
      return;
    }

    setError(
      target.name,
      target.validationMessage || "Please review this field."
    );
    triggerShake();
  }

  function onInputCapture(event: FormEvent<HTMLFormElement>) {
    const target = event.target as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement;

    if (!target.name) {
      return;
    }

    clearError(target.name);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);

    const appointmentDateValue = String(formData.get("appointmentDate") || "");
    const eventDateValue = String(formData.get("eventDate") || "");

    if (
      eventDateValue &&
      appointmentDateValue &&
      eventDateValue < appointmentDateValue
    ) {
      event.preventDefault();
      setError(
        "eventDate",
        "Wedding date must be on or after appointment date."
      );
      triggerShake();
    }
  }

  return (
    <m.div
      animate={
        shouldShake && !shouldReduceMotion
          ? { x: [0, -5, 5, -4, 4, 0] }
          : { x: 0 }
      }
      transition={{ duration: 0.3, ease: motionEase }}
    >
      <m.form
        action={action}
        className="grid gap-5"
        variants={staggerContainer(0.08)}
        initial={shouldReduceMotion ? false : "hidden"}
        animate="visible"
        onInvalidCapture={onInvalidCapture}
        onInputCapture={onInputCapture}
        onSubmit={onSubmit}
      >
        <TimezoneHiddenInput />

        <m.div
          className="bg-background/72 space-y-4 rounded-2xl border border-border/75 p-4"
          variants={fadeUp}
        >
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-brand-taupe">
            Appointment details
          </p>

          <div className="space-y-2">
            <Label htmlFor="productId">Preferred gown</Label>
            <div className="relative">
              <select
                id="productId"
                name="productId"
                defaultValue={selectedProductId}
                className="flex h-12 w-full appearance-none rounded-2xl border border-input/85 bg-background/80 px-4 pr-10 text-sm text-foreground shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
                aria-invalid={Boolean(fieldErrors.productId)}
                aria-describedby={
                  fieldErrors.productId ? "productId-error" : undefined
                }
              >
                <option value="">No preference yet</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            {fieldErrors.productId ? (
              <p
                id="productId-error"
                className="text-sm text-destructive"
                aria-live="polite"
              >
                {fieldErrors.productId}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="appointmentDate">Appointment date</Label>
              <Input
                id="appointmentDate"
                name="appointmentDate"
                type="date"
                min={today}
                required
                aria-invalid={Boolean(fieldErrors.appointmentDate)}
                aria-describedby={
                  fieldErrors.appointmentDate
                    ? "appointmentDate-error"
                    : undefined
                }
              />
              {fieldErrors.appointmentDate ? (
                <p
                  id="appointmentDate-error"
                  className="text-sm text-destructive"
                  aria-live="polite"
                >
                  {fieldErrors.appointmentDate}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointmentTime">Appointment time</Label>
              <Input
                id="appointmentTime"
                name="appointmentTime"
                type="time"
                required
                aria-invalid={Boolean(fieldErrors.appointmentTime)}
                aria-describedby={
                  fieldErrors.appointmentTime
                    ? "appointmentTime-error"
                    : undefined
                }
              />
              {fieldErrors.appointmentTime ? (
                <p
                  id="appointmentTime-error"
                  className="text-sm text-destructive"
                  aria-live="polite"
                >
                  {fieldErrors.appointmentTime}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventDate">Wedding date (optional)</Label>
            <Input
              id="eventDate"
              name="eventDate"
              type="date"
              min={today}
              aria-invalid={Boolean(fieldErrors.eventDate)}
              aria-describedby={
                fieldErrors.eventDate ? "eventDate-error" : undefined
              }
            />
            {fieldErrors.eventDate ? (
              <p
                id="eventDate-error"
                className="text-sm text-destructive"
                aria-live="polite"
              >
                {fieldErrors.eventDate}
              </p>
            ) : null}
          </div>
        </m.div>

        <m.div
          className="bg-background/72 space-y-3 rounded-2xl border border-border/75 p-4"
          variants={fadeUp}
        >
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-brand-taupe">
            Styling context
          </p>
          <div className="space-y-2">
            <Label htmlFor="notes">Style notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Share venue details, dress preferences, and timeline constraints."
              aria-invalid={Boolean(fieldErrors.notes)}
              aria-describedby={fieldErrors.notes ? "notes-error" : undefined}
            />
            {fieldErrors.notes ? (
              <p
                id="notes-error"
                className="text-sm text-destructive"
                aria-live="polite"
              >
                {fieldErrors.notes}
              </p>
            ) : null}
          </div>
        </m.div>

        <m.div
          className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          variants={fadeUp}
        >
          <SubmitBookingButton />
          <Button asChild variant="outline" size="lg">
            <Link href="/collections">Browse collections</Link>
          </Button>
        </m.div>

        {Object.keys(fieldErrors).length > 0 ? (
          <p className="text-sm text-destructive" aria-live="polite">
            Please review the highlighted fields.
          </p>
        ) : null}
      </m.form>
    </m.div>
  );
}
