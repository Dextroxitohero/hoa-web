"use client";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PrivateCommunitySummary } from "@/modules/privadas/types/private-community";
import type { AuthUser } from "@/modules/usuarios-acceso/types/auth";

type DashboardLayoutShellProps = {
  children: React.ReactNode;
  isAuthenticated: boolean;
  isSuperadmin: boolean;
  me?: AuthUser;
  logoutPending: boolean;
  onLogout: () => void;
  privadas: PrivateCommunitySummary[];
  activePrivateId?: string;
  onPrivateChange: (privateId: string) => void;
};

export function DashboardLayoutShell({
  children,
  isAuthenticated,
  isSuperadmin,
  me,
  logoutPending,
  onLogout,
  privadas,
  activePrivateId,
  onPrivateChange,
}: DashboardLayoutShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar
        privadas={privadas}
        activePrivateId={activePrivateId}
        isSuperadmin={isSuperadmin}
        onPrivateChange={onPrivateChange}
      />
      <SidebarInset>
        <header
          className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
          id="panel"
        >
          <div className="flex w-full items-center justify-between gap-3 px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground">HOA-Maintenance</p>
                <p className="text-base font-semibold">HabitaPro</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <p className="hidden text-xs text-muted-foreground md:block">
                  {me?.firstName} {me?.lastName}
                </p>
              ) : null}
              <ThemeToggle />
              {isAuthenticated ? (
                <Button variant="outline" onClick={onLogout} disabled={logoutPending}>
                  Salir
                </Button>
              ) : null}
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 pb-6">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
