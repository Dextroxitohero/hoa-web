"use client";

import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { PrivateCommunitySummary } from "@/modules/privadas/types/private-community";
import { CreateHomeInput } from "../types/home";
import { useCreateVivienda } from "../hooks/use-viviendas";

type CreateViviendaFormProps = {
  privateId?: string;
  privateOptions: PrivateCommunitySummary[];
  onPrivateChange: (privateId: string) => void;
  title?: string;
  submitLabel?: string;
  initialValues?: Partial<CreateHomeInput>;
  pending?: boolean;
  error?: unknown;
  onSubmit?: (payload: CreateHomeInput) => Promise<void>;
  onSubmitted?: () => void;
};

export function CreateViviendaForm({
  privateId,
  privateOptions,
  onPrivateChange,
  title = "Registrar vivienda",
  submitLabel = "Crear vivienda",
  initialValues,
  pending,
  error,
  onSubmit,
  onSubmitted,
}: CreateViviendaFormProps) {
  const createVivienda = useCreateVivienda(privateId);
  const isPending = pending ?? createVivienda.isPending;
  const currentError = error ?? createVivienda.error;

  const form = useForm({
    defaultValues: {
      homeNumber: initialValues?.homeNumber ?? "",
      contactPhone: initialValues?.contactPhone ?? "",
      contactEmail: initialValues?.contactEmail ?? "",
      regulationSigned: initialValues?.regulationSigned ?? false,
    },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        contactPhone: value.contactPhone || undefined,
        contactEmail: value.contactEmail || undefined,
      };
      if (onSubmit) {
        await onSubmit(payload);
      } else {
        await createVivienda.mutateAsync(payload);
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

      <label className="block space-y-1 text-sm">
        <span>Privada</span>
        <select
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          value={privateId ?? ""}
          onChange={(event) => onPrivateChange(event.target.value)}
        >
          <option value="">Selecciona una privada</option>
          {privateOptions.map((privateCommunity) => (
            <option key={privateCommunity.id} value={privateCommunity.id}>
              {privateCommunity.name}
            </option>
          ))}
        </select>
      </label>

      <form.Field
        name="homeNumber"
        validators={{ onChange: ({ value }) => (!value ? "Requerido" : undefined) }}
      >
        {(field) => (
          <label className="block space-y-1 text-sm">
            <span>Número de vivienda</span>
            <input
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
            />
          </label>
        )}
      </form.Field>

      <form.Field name="contactPhone">
        {(field) => (
          <label className="block space-y-1 text-sm">
            <span>Teléfono de contacto</span>
            <input
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
            />
          </label>
        )}
      </form.Field>

      <form.Field name="regulationSigned">
        {(field) => (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={field.state.value}
              onChange={(event) => field.handleChange(event.target.checked)}
            />
            Reglamento firmado
          </label>
        )}
      </form.Field>

      {currentError ? (
        <p className="text-xs text-destructive">
          {currentError instanceof Error
            ? currentError.message
            : "No se pudo crear la vivienda"}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isPending || !privateId}
        className="w-full"
      >
        {isPending ? "Guardando..." : submitLabel}
      </Button>
    </form>
  );
}
