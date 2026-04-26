"use client";

import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { useBootstrapSuperadmin } from "../hooks/use-auth";

type BootstrapSuperadminPanelProps = {
  onCompleted?: () => void;
};

export function BootstrapSuperadminPanel({
  onCompleted,
}: BootstrapSuperadminPanelProps) {
  const bootstrapMutation = useBootstrapSuperadmin();

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      bootstrapKey: "",
    },
    onSubmit: async ({ value }) => {
      await bootstrapMutation.mutateAsync(value);
      onCompleted?.();
    },
  });

  return (
    <section className="mx-auto w-full max-w-md rounded-xl border bg-card p-4 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold">Configurar primer SuperAdmin</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Esta pantalla solo aparece cuando no existe un SuperAdmin en el sistema.
      </p>

      <form
        className="mt-4 space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <form.Field name="firstName">
            {(field) => (
              <label className="block space-y-1 text-sm">
                <span>Nombre</span>
                <input
                  className="w-full rounded-md border bg-background px-3 py-2"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </label>
            )}
          </form.Field>
          <form.Field name="lastName">
            {(field) => (
              <label className="block space-y-1 text-sm">
                <span>Apellido</span>
                <input
                  className="w-full rounded-md border bg-background px-3 py-2"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </label>
            )}
          </form.Field>
        </div>

        <form.Field name="email">
          {(field) => (
            <label className="block space-y-1 text-sm">
              <span>Email</span>
              <input
                type="email"
                className="w-full rounded-md border bg-background px-3 py-2"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </label>
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <label className="block space-y-1 text-sm">
              <span>Contraseña</span>
              <input
                type="password"
                className="w-full rounded-md border bg-background px-3 py-2"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </label>
          )}
        </form.Field>

        <form.Field name="bootstrapKey">
          {(field) => (
            <label className="block space-y-1 text-sm">
              <span>Bootstrap key</span>
              <input
                type="password"
                className="w-full rounded-md border bg-background px-3 py-2"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </label>
          )}
        </form.Field>

        {bootstrapMutation.error ? (
          <p className="text-sm text-destructive">
            {bootstrapMutation.error instanceof Error
              ? bootstrapMutation.error.message
              : "No se pudo completar el bootstrap"}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={bootstrapMutation.isPending}>
          {bootstrapMutation.isPending ? "Creando SuperAdmin..." : "Crear SuperAdmin"}
        </Button>
      </form>
    </section>
  );
}
