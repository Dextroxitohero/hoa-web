"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { BootstrapSuperadminPanel } from "@/modules/usuarios-acceso/components/bootstrap-superadmin-panel";
import { useBootstrapStatus, useMe } from "@/modules/usuarios-acceso/hooks/use-auth";

export default function LoginPage() {
  const router = useRouter();
  const meQuery = useMe();
  const bootstrapStatusQuery = useBootstrapStatus();
  const requiresBootstrap = bootstrapStatusQuery.data?.requiresBootstrap ?? false;

  useEffect(() => {
    if (meQuery.data && !requiresBootstrap) {
      router.replace("/");
    }
  }, [meQuery.data, requiresBootstrap, router]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        {meQuery.isLoading || bootstrapStatusQuery.isLoading ? (
          <p className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
            Cargando sesión...
          </p>
        ) : requiresBootstrap ? (
          <BootstrapSuperadminPanel onCompleted={() => router.replace("/")} />
        ) : (
          <LoginForm onAuthenticated={() => router.replace("/")} />
        )}
      </div>
    </div>
  );
}
