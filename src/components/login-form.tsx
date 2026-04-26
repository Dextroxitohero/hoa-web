import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLogin, useSignup } from "@/modules/usuarios-acceso/hooks/use-auth";
import { LoginInput, SignupInput } from "@/modules/usuarios-acceso/types/auth";

export function LoginForm({
  onAuthenticated,
  className,
  ...props
}: React.ComponentProps<"div"> & { onAuthenticated?: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const loginMutation = useLogin();
  const signupMutation = useSignup();

  const loginForm = useForm({
    defaultValues: {
      email: "",
      password: "",
    } as LoginInput,
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
      } as SignupInput);
      onAuthenticated?.();
    },
  });

  const currentError =
    (loginMutation.error ?? signupMutation.error) instanceof Error
      ? (loginMutation.error ?? signupMutation.error)?.message
      : undefined;

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <div className="mx-auto flex w-full max-w-sm gap-2">
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
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="p-6 md:p-8"
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              if (mode === "login") {
                void loginForm.handleSubmit();
                return;
              }
              void signupForm.handleSubmit();
            }}
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">
                  {mode === "login" ? "Bienvenido de nuevo" : "Crear cuenta"}
                </h1>
                <p className="text-balance text-muted-foreground">
                  {mode === "login"
                    ? "Inicia sesión para acceder al panel de HabitaPro"
                    : "El registro estándar crea cuentas con perfil propietario"}
                </p>
              </div>
              {mode === "signup" ? (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <signupForm.Field name="firstName">
                    {(field) => (
                      <Field>
                        <FieldLabel>Nombre</FieldLabel>
                        <Input
                          value={field.state.value}
                          onChange={(event) => field.handleChange(event.target.value)}
                          required
                        />
                      </Field>
                    )}
                  </signupForm.Field>
                  <signupForm.Field name="lastName">
                    {(field) => (
                      <Field>
                        <FieldLabel>Apellido</FieldLabel>
                        <Input
                          value={field.state.value}
                          onChange={(event) => field.handleChange(event.target.value)}
                          required
                        />
                      </Field>
                    )}
                  </signupForm.Field>
                </div>
              ) : null}

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                {mode === "login" ? (
                  <loginForm.Field name="email">
                    {(field) => (
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={field.state.value}
                        onChange={(event) => field.handleChange(event.target.value)}
                        required
                      />
                    )}
                  </loginForm.Field>
                ) : (
                  <signupForm.Field name="email">
                    {(field) => (
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={field.state.value}
                        onChange={(event) => field.handleChange(event.target.value)}
                        required
                      />
                    )}
                  </signupForm.Field>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                {mode === "login" ? (
                  <loginForm.Field name="password">
                    {(field) => (
                      <Input
                        id="password"
                        type="password"
                        value={field.state.value}
                        onChange={(event) => field.handleChange(event.target.value)}
                        required
                      />
                    )}
                  </loginForm.Field>
                ) : (
                  <signupForm.Field name="password">
                    {(field) => (
                      <Input
                        id="password"
                        type="password"
                        minLength={8}
                        value={field.state.value}
                        onChange={(event) => field.handleChange(event.target.value)}
                        required
                      />
                    )}
                  </signupForm.Field>
                )}
              </Field>

              {mode === "signup" ? (
                <signupForm.Field name="tenantId">
                  {(field) => (
                    <Field>
                      <FieldLabel>Tenant ID (opcional)</FieldLabel>
                      <Input
                        value={field.state.value}
                        onChange={(event) => field.handleChange(event.target.value)}
                      />
                    </Field>
                  )}
                </signupForm.Field>
              ) : null}

              {currentError ? (
                <p className="text-sm text-destructive">{currentError}</p>
              ) : null}

              <Field>
                <Button type="submit" disabled={loginMutation.isPending || signupMutation.isPending}>
                  {loginMutation.isPending || signupMutation.isPending
                    ? "Procesando..."
                    : mode === "login"
                      ? "Entrar"
                      : "Crear cuenta"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Acceso y registro para operar módulos por privada en HabitaPro.
      </FieldDescription>
    </div>
  );
}
