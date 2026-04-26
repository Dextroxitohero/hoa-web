"use client";

import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { CreatePrivateCommunityInput } from "../types/private-community";
import { useCreatePrivada } from "../hooks/use-privadas";

type CreatePrivadaFormProps = {
  title?: string;
  submitLabel?: string;
  initialValues?: Partial<CreatePrivateCommunityInput>;
  pending?: boolean;
  error?: unknown;
  onSubmit?: (payload: CreatePrivateCommunityInput) => Promise<void>;
  onSubmitted?: () => void;
};

export function CreatePrivadaForm({
  title = "Registrar privada",
  submitLabel = "Crear privada",
  initialValues,
  pending,
  error,
  onSubmit,
  onSubmitted,
}: CreatePrivadaFormProps = {}) {
  const createPrivada = useCreatePrivada();
  const isPending = pending ?? createPrivada.isPending;
  const currentError = error ?? createPrivada.error;

  const form = useForm({
    defaultValues: {
      name: initialValues?.name ?? "",
      address: initialValues?.address ?? "",
      city: initialValues?.city ?? "",
      country: initialValues?.country ?? "México",
      postalCode: initialValues?.postalCode ?? "",
      phone: initialValues?.phone ?? "",
      email: initialValues?.email ?? "",
    },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        phone: value.phone || undefined,
        email: value.email || undefined,
      };

      if (onSubmit) {
        await onSubmit(payload);
      } else {
        await createPrivada.mutateAsync(payload);
      }
      form.reset();
      onSubmitted?.();
    },
  });

  return (
    <form
      className="space-y-3 rounded-xl border bg-card p-4"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <h3 className="text-sm font-semibold">{title}</h3>

      <form.Field
        name="name"
        validators={{ onChange: ({ value }) => (!value ? "Requerido" : undefined) }}
      >
        {(field) => (
          <label className="block space-y-1 text-sm">
            <span>Nombre</span>
            <input
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
            />
          </label>
        )}
      </form.Field>

      <form.Field name="address">
        {(field) => (
          <label className="block space-y-1 text-sm">
            <span>Dirección</span>
            <input
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
            />
          </label>
        )}
      </form.Field>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <form.Field name="city">
          {(field) => (
            <label className="block space-y-1 text-sm">
              <span>Ciudad</span>
              <input
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </label>
          )}
        </form.Field>
        <form.Field name="postalCode">
          {(field) => (
            <label className="block space-y-1 text-sm">
              <span>Código postal</span>
              <input
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </label>
          )}
        </form.Field>
      </div>

      {currentError ? (
        <p className="text-xs text-destructive">
          {currentError instanceof Error
            ? currentError.message
            : "No se pudo crear la privada"}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Guardando..." : submitLabel}
      </Button>
    </form>
  );
}
