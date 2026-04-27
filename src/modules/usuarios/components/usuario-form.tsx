"use client";

import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { PrivateCommunitySummary } from "@/modules/privadas/types/private-community";
import { CreateUsuarioInput, roleOptions, UserRole } from "../types/usuario";

type UsuarioFormProps = {
  privadas: PrivateCommunitySummary[];
  isSuperadmin: boolean;
  title?: string;
  submitLabel?: string;
  initialValues?: Partial<CreateUsuarioInput>;
  pending?: boolean;
  error?: unknown;
  onSubmit: (payload: CreateUsuarioInput) => Promise<void>;
  onSubmitted?: () => void;
};

export function UsuarioForm({
  privadas,
  isSuperadmin,
  title = "Registrar usuario",
  submitLabel = "Guardar",
  initialValues,
  pending,
  error,
  onSubmit,
  onSubmitted,
}: UsuarioFormProps) {
  const form = useForm({
    defaultValues: {
      firstName: initialValues?.firstName ?? "",
      lastName: initialValues?.lastName ?? "",
      email: initialValues?.email ?? "",
      password: initialValues?.password ?? "",
      phone: initialValues?.phone ?? "",
      tenantId: initialValues?.tenantId ?? privadas[0]?.id ?? "",
      roles: initialValues?.roles ?? ["ADMIN_PRIVADA"],
    } as CreateUsuarioInput,
    onSubmit: async ({ value }) => {
      await onSubmit(value);
      onSubmitted?.();
    },
  });

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="grid grid-cols-2 gap-2">
        <form.Field name="firstName">
          {(field) => (
            <input
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="Nombre"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
            />
          )}
        </form.Field>
        <form.Field name="lastName">
          {(field) => (
            <input
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="Apellido"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
            />
          )}
        </form.Field>
      </div>
      <form.Field name="email">
        {(field) => (
          <input
            type="email"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="Email"
            value={field.state.value}
            onChange={(event) => field.handleChange(event.target.value)}
          />
        )}
      </form.Field>
      <form.Field name="password">
        {(field) => (
          <input
            type="password"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="Contraseña (min 8)"
            value={field.state.value}
            onChange={(event) => field.handleChange(event.target.value)}
          />
        )}
      </form.Field>
      <form.Field name="phone">
        {(field) => (
          <input
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="Teléfono (opcional)"
            value={field.state.value}
            onChange={(event) => field.handleChange(event.target.value)}
          />
        )}
      </form.Field>
      {isSuperadmin ? (
        <form.Field name="tenantId">
          {(field) => (
            <select
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={field.state.value ?? ""}
              onChange={(event) => field.handleChange(event.target.value)}
            >
              {privadas.map((privada) => (
                <option key={privada.id} value={privada.id}>
                  {privada.name}
                </option>
              ))}
            </select>
          )}
        </form.Field>
      ) : null}
      <form.Field name="roles">
        {(field) => (
          <select
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={field.state.value[0]}
            onChange={(event) => field.handleChange([event.target.value as UserRole])}
          >
            {roleOptions
              .filter((role) => (isSuperadmin ? true : role !== "SUPERADMIN"))
              .map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
          </select>
        )}
      </form.Field>
      {error ? (
        <p className="text-xs text-destructive">
          {error instanceof Error ? error.message : "Error al guardar usuario"}
        </p>
      ) : null}
      <Button className="w-full" disabled={pending} type="submit">
        {pending ? "Guardando..." : submitLabel}
      </Button>
    </form>
  );
}
