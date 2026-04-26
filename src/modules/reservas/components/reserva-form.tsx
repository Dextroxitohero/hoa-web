"use client";

import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { ReservaInput } from "../types/reserva";

type ReservaFormProps = {
  title?: string;
  submitLabel?: string;
  initialValues?: Partial<ReservaInput>;
  pending?: boolean;
  error?: unknown;
  onSubmit: (payload: ReservaInput) => Promise<void>;
  onSubmitted?: () => void;
};

export function ReservaForm({
  title = "Registrar reserva",
  submitLabel = "Guardar",
  initialValues,
  pending,
  error,
  onSubmit,
  onSubmitted,
}: ReservaFormProps) {
  const form = useForm({
    defaultValues: {
      homeId: initialValues?.homeId ?? "",
      reservationDate: initialValues?.reservationDate?.slice(0, 10) ?? "",
      contactName: initialValues?.contactName ?? "",
      contactPhone: initialValues?.contactPhone ?? "",
      contactEmail: initialValues?.contactEmail ?? "",
      startsAt: initialValues?.startsAt ?? "",
      endsAt: initialValues?.endsAt ?? "",
    },
    onSubmit: async ({ value }) => {
      const payload: ReservaInput = {
        ...value,
        contactEmail: value.contactEmail || undefined,
      };
      await onSubmit(payload);
      onSubmitted?.();
    },
  });

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <h3 className="text-sm font-semibold">{title}</h3>
      <form.Field name="homeId">
        {(field) => (
          <input
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="ID vivienda"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>
      <form.Field name="reservationDate">
        {(field) => (
          <input
            type="date"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>
      <form.Field name="contactName">
        {(field) => (
          <input
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="Responsable"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>
      {error ? (
        <p className="text-xs text-destructive">
          {error instanceof Error ? error.message : "Error al guardar reserva"}
        </p>
      ) : null}
      <Button className="w-full" disabled={pending} type="submit">
        {pending ? "Guardando..." : submitLabel}
      </Button>
    </form>
  );
}
