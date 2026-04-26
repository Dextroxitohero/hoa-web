"use client";

import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { AmenityInput } from "../types/amenity";

type AmenityFormProps = {
  title?: string;
  submitLabel?: string;
  initialValues?: Partial<AmenityInput>;
  pending?: boolean;
  error?: unknown;
  onSubmit: (payload: AmenityInput) => Promise<void>;
  onSubmitted?: () => void;
};

export function AmenityForm({
  title = "Registrar amenity",
  submitLabel = "Guardar",
  initialValues,
  pending,
  error,
  onSubmit,
  onSubmitted,
}: AmenityFormProps) {
  const form = useForm({
    defaultValues: {
      name: initialValues?.name ?? "",
      description: initialValues?.description ?? "",
      bookingCost: initialValues?.bookingCost ?? 0,
      cleaningCost: initialValues?.cleaningCost ?? 0,
      openingTime: initialValues?.openingTime ?? "09:00",
      closingTime: initialValues?.closingTime ?? "21:00",
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
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
      <form.Field name="name">
        {(field) => (
          <input
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="Nombre"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>
      <form.Field name="description">
        {(field) => (
          <input
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="Descripción"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>
      <div className="grid grid-cols-2 gap-2">
        <form.Field name="bookingCost">
          {(field) => (
            <input
              type="number"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="Costo reserva"
              value={field.state.value}
              onChange={(e) => field.handleChange(Number(e.target.value))}
            />
          )}
        </form.Field>
        <form.Field name="cleaningCost">
          {(field) => (
            <input
              type="number"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="Costo limpieza"
              value={field.state.value}
              onChange={(e) => field.handleChange(Number(e.target.value))}
            />
          )}
        </form.Field>
      </div>
      {error ? (
        <p className="text-xs text-destructive">
          {error instanceof Error ? error.message : "Error al guardar amenity"}
        </p>
      ) : null}
      <Button className="w-full" disabled={pending} type="submit">
        {pending ? "Guardando..." : submitLabel}
      </Button>
    </form>
  );
}
