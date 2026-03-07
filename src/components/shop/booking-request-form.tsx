"use client";

import { m, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
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

type ServiceCode = "makeup" | "photo";

const serviceCodes: ServiceCode[] = ["makeup", "photo"];

type BookingRequestFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  products: BookingProduct[];
  selectedProductId: string;
  selectedServices: ServiceCode[];
};

function SubmitBookingButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("Booking.form");

  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? t("submitting") : t("submitButton")}
    </Button>
  );
}

export function BookingRequestForm({
  action,
  products,
  selectedProductId,
  selectedServices
}: BookingRequestFormProps) {
  const locale = useLocale();
  const t = useTranslations("Booking.form");
  const shouldReduceMotion = useReducedMotion();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [shouldShake, setShouldShake] = useState(false);
  const selectedServiceSet = useMemo(
    () => new Set(selectedServices),
    [selectedServices]
  );
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
      target.validationMessage || t("validation.reviewField")
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
      setError("eventDate", t("validation.weddingDateError"));
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
        <input type="hidden" name="locale" value={locale} />

        <m.div
          className="bg-background/72 space-y-4 rounded-2xl border border-border/75 p-4"
          variants={fadeUp}
        >
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-brand-taupe">
            {t("appointmentDetails")}
          </p>

          <div className="space-y-2">
            <Label htmlFor="productId">{t("preferredGown")}</Label>
            <div className="relative">
              <select
                id="productId"
                name="productId"
                defaultValue={selectedProductId}
                className="flex h-12 w-full appearance-none rounded-2xl border border-input/85 bg-background/80 px-4 pr-10 text-sm text-foreground shadow-xs transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
                aria-invalid={Boolean(fieldErrors.productId)}
                aria-describedby={
                  fieldErrors.productId ? "productId-error" : undefined
                }
              >
                <option value="">{t("noPreference")}</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-muted-foreground">
              {t("productOptionalNote")}
            </p>
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
              <Label htmlFor="appointmentDate">{t("appointmentDate")}</Label>
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
              <Label htmlFor="appointmentTime">{t("appointmentTime")}</Label>
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
            <Label htmlFor="eventDate">{t("weddingDate")}</Label>
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

          <div className="space-y-3">
            <Label>{t("addOnServices")}</Label>
            <div className="grid gap-2 sm:grid-cols-2">
              {serviceCodes.map((serviceCode) => (
                <label
                  key={serviceCode}
                  className="group flex cursor-pointer gap-3 rounded-2xl border border-border/70 bg-background/75 p-3 transition hover:border-brand-taupe/35 hover:bg-card/90"
                >
                  <input
                    type="checkbox"
                    name="services"
                    value={serviceCode}
                    defaultChecked={selectedServiceSet.has(serviceCode)}
                    className="mt-1 size-4 rounded border-border text-primary focus:ring-ring"
                  />
                  <span className="block">
                    <span className="block text-sm font-semibold text-foreground">
                      {t(`services.${serviceCode}.title`)}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                      {t(`services.${serviceCode}.note`)}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        </m.div>

        <m.div
          className="bg-background/72 space-y-3 rounded-2xl border border-border/75 p-4"
          variants={fadeUp}
        >
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-brand-taupe">
            {t("stylingContext")}
          </p>
          <div className="space-y-2">
            <Label htmlFor="notes">{t("styleNotes")}</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder={t("styleNotesPlaceholder")}
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
            <Link href="/collections">{t("browseCollections")}</Link>
          </Button>
        </m.div>

        {Object.keys(fieldErrors).length > 0 ? (
          <p className="text-sm text-destructive" aria-live="polite">
            {t("validation.generalError")}
          </p>
        ) : null}
      </m.form>
    </m.div>
  );
}
