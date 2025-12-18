"use client";

import { useActionState, useEffect, useState } from "react";
import slugify from "slugify";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import type { Performance } from "@/api/types.api";

type PerformanceFormProps = {
  initialData?: Performance;
  action: (prevState: any, formData: FormData) => Promise<any>;
  submitLabel?: string;
};

export function PerformanceForm({
  initialData,
  action,
  submitLabel = "Uložit",
}: PerformanceFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);

  // Converts UTC date string to local datetime-local format (YYYY-MM-DDTHH:MM)
  // Database stores UTC, but datetime-local input works in browser's timezone
  // Uses Date object's local getters to extract components in user's timezone
  const formatDateTimeLocal = (utcDate: string) => {
    const date = new Date(utcDate);
    // Get local time components (automatically adjusted from UTC)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Controlled form state
  const [name, setName] = useState(initialData?.name || "");
  const [date, setDate] = useState(
    initialData?.date ? formatDateTimeLocal(initialData.date) : ""
  );
  const [introText, setIntroText] = useState(initialData?.intro_text || "");
  const [slug, setSlug] = useState(initialData?.url_slug || "");
  const [performanceState, setPerformanceState] = useState<string>(
    initialData?.state || "draft"
  );
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Track if form has been modified
  useEffect(() => {
    const hasChanges =
      name !== (initialData?.name || "") ||
      date !== (initialData?.date ? formatDateTimeLocal(initialData.date) : "") ||
      introText !== (initialData?.intro_text || "") ||
      (isSlugManual && slug !== (initialData?.url_slug || "")) ||
      performanceState !== (initialData?.state || "draft");

    setIsDirty(hasChanges);
  }, [name, date, introText, slug, performanceState, isSlugManual, initialData]);

  // Auto-generate slug from name if not manual
  useEffect(() => {
    if (!isSlugManual && name) {
      setSlug(slugify(name, { lower: true, strict: true }));
    }
  }, [name, isSlugManual]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  return (
    <form action={formAction} className="space-y-6" aria-label="Formulář představení">
      {initialData && (
        <input type="hidden" name="id" value={initialData.id} />
      )}

      {/* Name */}
      <div>
        <Label htmlFor="name">Název představení *</Label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={255}
          placeholder="např. Letní improvizace 2025"
        />
        {state?.fieldErrors?.name && (
          <p className="text-sm text-red-600 mt-1">
            {state.fieldErrors.name[0]}
          </p>
        )}
      </div>

      {/* Date */}
      <div>
        <Label htmlFor="date">Datum a čas *</Label>
        <Input
          id="date"
          name="date"
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        {state?.fieldErrors?.date && (
          <p className="text-sm text-red-600 mt-1">
            {state.fieldErrors.date[0]}
          </p>
        )}
      </div>

      {/* Intro Text */}
      <div>
        <Label htmlFor="intro_text">Úvodní text (HTML)</Label>
        <Textarea
          id="intro_text"
          name="intro_text"
          value={introText}
          onChange={(e) => setIntroText(e.target.value)}
          rows={5}
          maxLength={10000}
          placeholder="HTML pro úvodní obrazovku"
        />
        {state?.fieldErrors?.intro_text && (
          <p className="text-sm text-red-600 mt-1">
            {state.fieldErrors.intro_text[0]}
          </p>
        )}
      </div>

      {/* URL Slug */}
      <div>
        <Label htmlFor="url_slug">URL adresa</Label>
        <div className="flex gap-2">
          <Input
            id="url_slug_display"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setIsSlugManual(true);
            }}
            readOnly={!isSlugManual}
            className={!isSlugManual ? "bg-gray-900" : ""}
            placeholder="automaticky-generovano"
          />
          {/* Hidden input to ensure slug is always submitted */}
          <input type="hidden" name="url_slug" value={slug} />
          {!isSlugManual && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSlugManual(true)}
            >
              Upravit
            </Button>
          )}
        </div>
        <p className="text-sm text-gray-300 mt-1">
          {isSlugManual
            ? "Ruční úprava - použijte pouze malá písmena, číslice a pomlčky"
            : "Automaticky generováno z názvu"}
        </p>
        {state?.fieldErrors?.url_slug && (
          <p className="text-sm text-red-600 mt-1">
            {state.fieldErrors.url_slug[0]}
          </p>
        )}
      </div>

      {/* State */}
      <div>
        <Label htmlFor="state">Stav</Label>
        <Select
          name="state"
          value={performanceState}
          onValueChange={setPerformanceState}
        >
          <SelectTrigger>
            <SelectValue placeholder="Vyberte stav" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft (Koncept)</SelectItem>
            <SelectItem value="intro">Intro (Úvod)</SelectItem>
            <SelectItem value="life">Life (Živě)</SelectItem>
            <SelectItem value="closing">Closing (Závěr)</SelectItem>
            <SelectItem value="finished">Finished (Ukončeno)</SelectItem>
          </SelectContent>
        </Select>
        {state?.fieldErrors?.state && (
          <p className="text-sm text-red-600 mt-1">
            {state.fieldErrors.state[0]}
          </p>
        )}
      </div>

      {/* Success Message */}
      {state?.successMessage && (
        <div
          role="status"
          aria-live="polite"
          className="p-4 bg-green-950 border border-green-800 rounded"
        >
          <p className="text-sm text-green-200">{state.successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {state?.error && !state?.fieldErrors && (
        <div
          role="alert"
          aria-live="assertive"
          className="p-4 bg-red-950 border border-red-800 rounded"
        >
          <p className="text-sm text-red-200">{state.error}</p>
        </div>
      )}

      {/* Submit */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Ukládání..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
