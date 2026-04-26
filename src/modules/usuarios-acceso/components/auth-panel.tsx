"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { useLogin, useSignup } from "../hooks/use-auth";

type AuthPanelProps = {
  onAuthenticated?: () => void;
};

export function AuthPanel({ onAuthenticated }: AuthPanelProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const loginMutation = useLogin();
  const signupMutation = useSignup();

  const loginForm = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await loginMutation.mutateAsync(value);
      onAuthenticated?.();
    },
  });

  const signupForm = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      tenantId: "",
    },
    onSubmit: async ({ value }) => {
      await signupMutation.mutateAsync({
        ...value,
        phone: value.phone || undefined,
        tenantId: value.tenantId || undefined,
      });
      onAuthenticated?.();
    },
  });

  const currentError =
    (loginMutation.error ?? signupMutation.error) instanceof Error
      ? (loginMutation.error ?? signupMutation.error)?.message
      : undefined;

  return (
    <section className="mx-auto w-full max-w-md rounded-xl border bg-card p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex gap-2">
        <Button
          type="button"
          variant={mode === "login" ? "default" : "outline"}
          className="flex-1"
          onClick={() => setMode("login")}
        >
          Iniciar sesión
        </Button>
        <Button
          type="button"
          variant={mode === "signup" ? "default" : "outline"}
          className="flex-1"
          onClick={() => setMode("signup")}
        >
          Registrarme
        </Button>
      </div>

      {mode === "login" ? (
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void loginForm.handleSubmit();
          }}
        >
          <loginForm.Field name="email">
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
          </loginForm.Field>
          <loginForm.Field name="password">
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
          </loginForm.Field>
          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Ingresando..." : "Entrar"}
          </Button>
        </form>
      ) : (
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void signupForm.handleSubmit();
          }}
        >
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <signupForm.Field name="firstName">
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
            </signupForm.Field>
            <signupForm.Field name="lastName">
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
            </signupForm.Field>
          </div>
          <signupForm.Field name="email">
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
          </signupForm.Field>
          <signupForm.Field name="password">
            {(field) => (
              <label className="block space-y-1 text-sm">
                <span>Contraseña (min 8)</span>
                <input
                  type="password"
                  className="w-full rounded-md border bg-background px-3 py-2"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </label>
            )}
          </signupForm.Field>
          <signupForm.Field name="tenantId">
            {(field) => (
              <label className="block space-y-1 text-sm">
                <span>Tenant ID (opcional)</span>
                <input
                  className="w-full rounded-md border bg-background px-3 py-2"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </label>
            )}
          </signupForm.Field>

          <Button
            type="submit"
            className="w-full"
            disabled={signupMutation.isPending}
          >
            {signupMutation.isPending ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </form>
      )}

      <p className="mt-3 text-xs text-muted-foreground">
        El registro estándar crea cuentas con perfil propietario.
      </p>

      {currentError ? (
        <p className="mt-3 text-sm text-destructive">{currentError}</p>
      ) : null}
    </section>
  );
}
