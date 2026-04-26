"use client";

import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { PagoInput, paymentMethods } from "../types/pago";

type HomeOption = {
  id: string;
  homeNumber: string;
};

type PagoFormProps = {
  homes: HomeOption[];
  title?: string;
  submitLabel?: string;
  initialValues?: Partial<PagoInput>;
  pending?: boolean;
  error?: unknown;
  onSubmit: (payload: PagoInput) => Promise<void>;
  onSubmitted?: () => void;
};

function toDateInput(dateLike?: string) {
  if (!dateLike) return new Date().toISOString().slice(0, 10);
  return dateLike.slice(0, 10);
}

export function PagoForm({
  homes,
  title = "Registrar pago",
  submitLabel = "Guardar",
  initialValues,
  pending,
  error,
  onSubmit,
  onSubmitted,
}: PagoFormProps) {
  const form = useForm({
    defaultValues: {
      homeId: initialValues?.homeId ?? homes[0]?.id ?? "",
      paymentDate: toDateInput(initialValues?.paymentDate),
      monthLabel: initialValues?.monthLabel ?? "",
      amount: initialValues?.amount ?? 0,
      paymentMethod: initialValues?.paymentMethod ?? paymentMethods[0],
      referenceNumber: initialValues?.referenceNumber ?? "",
      paymentNumber: initialValues?.paymentNumber ?? "",
    } as PagoInput,
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

      <form.Field name="homeId">
        {(field) => (
          <select
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
          >
            {homes.map((home) => (
              <option key={home.id} value={home.id}>
                {home.homeNumber}
              </option>
            ))}
          </select>
        )}
      </form.Field>

      <div className="grid grid-cols-2 gap-2">
        <form.Field name="paymentDate">
          {(field) => (
            <input
              type="date"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>
        <form.Field name="monthLabel">
          {(field) => (
            <input
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="Mes (ej. Abril 2026)"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <form.Field name="amount">
          {(field) => (
            <input
              type="number"
              step="0.01"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="Monto"
              value={field.state.value}
              onChange={(e) => field.handleChange(Number(e.target.value))}
            />
          )}
        </form.Field>
        <form.Field name="paymentMethod">
          {(field) => (
            <select
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value as PagoInput["paymentMethod"])}
            >
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          )}
        </form.Field>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <form.Field name="referenceNumber">
          {(field) => (
            <input
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="Referencia"
              value={field.state.value ?? ""}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>
        <form.Field name="paymentNumber">
          {(field) => (
            <input
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="Folio de pago"
              value={field.state.value ?? ""}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>
      </div>

      {error ? (
        <p className="text-xs text-destructive">
          {error instanceof Error ? error.message : "Error al guardar pago"}
        </p>
      ) : null}

      <Button className="w-full" disabled={pending || homes.length === 0} type="submit">
        {pending ? "Guardando..." : submitLabel}
      </Button>
    </form>
  );
}
