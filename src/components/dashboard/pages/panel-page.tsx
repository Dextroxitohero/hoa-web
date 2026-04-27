"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useDashboardShellState } from "@/components/dashboard/hooks/use-dashboard-shell-state";
import { DashboardLayoutShell } from "@/components/dashboard/dashboard-layout-shell";

export function PanelModulePage() {
  const {
    meQuery,
    logoutMutation,
    isAuthenticated,
    isSuperadmin,
    privadas,
    activePrivateId,
    onPrivateChange,
  } = useDashboardShellState();

  return (
    <DashboardLayoutShell
      isAuthenticated={isAuthenticated}
      isSuperadmin={isSuperadmin}
      me={meQuery.data}
      logoutPending={logoutMutation.isPending}
      onLogout={() => logoutMutation.mutate()}
      privadas={privadas}
      activePrivateId={activePrivateId}
      onPrivateChange={onPrivateChange}
    >
      {meQuery.isLoading ? (
        <section className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Validando sesion...</p>
        </section>
      ) : !isAuthenticated ? (
        <section className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Redirigiendo al login...</p>
        </section>
      ) : (
        <section className="rounded-xl border bg-card p-4 sm:p-6">
          <h2 className="text-lg font-medium sm:text-xl">Panel operativo</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Accede rapidamente a cada modulo con su vista independiente.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/privadas" className={buttonVariants({ variant: "outline" })}>
              Privadas
            </Link>
            <Link href="/viviendas" className={buttonVariants({ variant: "outline" })}>
              Viviendas
            </Link>
            <Link href="/amenities" className={buttonVariants({ variant: "outline" })}>
              Amenities
            </Link>
            <Link href="/reservas" className={buttonVariants({ variant: "outline" })}>
              Reservas
            </Link>
            <Link href="/pagos" className={buttonVariants({ variant: "outline" })}>
              Pagos
            </Link>
            <Link href="/usuarios" className={buttonVariants({ variant: "outline" })}>
              Usuarios
            </Link>
          </div>
        </section>
      )}
    </DashboardLayoutShell>
  );
}
