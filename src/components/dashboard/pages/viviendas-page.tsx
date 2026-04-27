"use client";

import { useMemo, useState } from "react";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { TablePagination } from "@/components/ui/table-pagination";
import { DashboardLayoutShell } from "@/components/dashboard/dashboard-layout-shell";
import { useDashboardShellState } from "@/components/dashboard/hooks/use-dashboard-shell-state";
import { usePersistentPagination } from "@/lib/table/use-persistent-pagination";
import { CreateViviendaForm } from "@/modules/viviendas/components/create-vivienda-form";
import { HomeListMobile } from "@/modules/viviendas/components/home-list-mobile";
import { useDeleteVivienda, useUpdateVivienda, useViviendas } from "@/modules/viviendas/hooks/use-viviendas";

export function ViviendasModulePage() {
  const {
    meQuery,
    logoutMutation,
    isAuthenticated,
    isSuperadmin,
    privadas,
    activePrivateId,
    onPrivateChange,
  } = useDashboardShellState();
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [createOpen, setCreateOpen] = useState(false);
  const [editId, setEditId] = useState<string>();
  const [deleteId, setDeleteId] = useState<string>();
  const viviendasQuery = useViviendas(activePrivateId, isAuthenticated);
  const viviendas = viviendasQuery.data ?? [];
  const updateVivienda = useUpdateVivienda(activePrivateId);
  const deleteVivienda = useDeleteVivienda(activePrivateId);
  const homeToEdit = viviendas.find((item) => item.id === editId);
  const homeToDelete = viviendas.find((item) => item.id === deleteId);

  const { pagination, setPagination } = usePersistentPagination({
    storageKey: "table:viviendas",
    userId: meQuery.data?.id,
  });
  const columns: ColumnDef<(typeof viviendas)[number]>[] = useMemo(
    () => [
      { accessorKey: "homeNumber" },
      { accessorKey: "contactPhone" },
      { accessorKey: "regulationSigned" },
      { id: "actions" },
    ],
    [],
  );
  const table = useReactTable({
    data: viviendas,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

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
        <>
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">Viviendas</h2>
              <div className="flex items-center gap-2">
                <Button variant={viewMode === "table" ? "default" : "outline"} size="sm" onClick={() => setViewMode("table")}>Tabla</Button>
                <Button variant={viewMode === "cards" ? "default" : "outline"} size="sm" onClick={() => setViewMode("cards")}>Tarjetas</Button>
                <Button size="sm" onClick={() => setCreateOpen(true)}>Nueva</Button>
              </div>
            </div>
            {viewMode === "cards" ? (
              <HomeListMobile homes={viviendas} />
            ) : (
              <div className="overflow-hidden rounded-xl border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/60 text-left">
                    <tr>
                      <th className="px-4 py-3 font-medium">Vivienda</th>
                      <th className="px-4 py-3 font-medium">Telefono</th>
                      <th className="px-4 py-3 font-medium">Reglamento</th>
                      <th className="px-4 py-3 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => {
                      const home = row.original;
                      return (
                        <tr key={home.id} className="border-t">
                          <td className="px-4 py-3">{home.homeNumber}</td>
                          <td className="px-4 py-3">{home.contactPhone ?? "-"}</td>
                          <td className="px-4 py-3">{home.regulationSigned ? "Firmado" : "Pendiente"}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => setEditId(home.id)}>Editar</Button>
                              <Button variant="destructive" size="sm" onClick={() => setDeleteId(home.id)}>Eliminar</Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <TablePagination table={table} />
              </div>
            )}
          </section>

          <Drawer open={createOpen} onOpenChange={setCreateOpen} title="Registrar vivienda" description="Alta de vivienda">
            <CreateViviendaForm
              privateId={activePrivateId}
              privateOptions={privadas}
              onPrivateChange={onPrivateChange}
              onSubmitted={() => setCreateOpen(false)}
            />
          </Drawer>

          <Drawer open={Boolean(homeToEdit)} onOpenChange={(open) => !open && setEditId(undefined)} title="Editar vivienda">
            {homeToEdit ? (
              <CreateViviendaForm
                privateId={activePrivateId}
                privateOptions={privadas}
                onPrivateChange={onPrivateChange}
                title="Editar vivienda"
                submitLabel="Guardar cambios"
                initialValues={{
                  homeNumber: homeToEdit.homeNumber,
                  contactPhone: homeToEdit.contactPhone ?? "",
                  contactEmail: homeToEdit.contactEmail ?? "",
                  regulationSigned: homeToEdit.regulationSigned,
                }}
                pending={updateVivienda.isPending}
                error={updateVivienda.error}
                onSubmit={async (payload) => {
                  await updateVivienda.mutateAsync({ homeId: homeToEdit.id, payload });
                }}
                onSubmitted={() => setEditId(undefined)}
              />
            ) : null}
          </Drawer>

          <Drawer open={Boolean(homeToDelete)} onOpenChange={(open) => !open && setDeleteId(undefined)} title="Eliminar vivienda" description="Esta accion no se puede deshacer">
            {homeToDelete ? (
              <div className="space-y-4">
                <p className="text-sm">
                  Vas a eliminar la vivienda <strong>{homeToDelete.homeNumber}</strong>.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setDeleteId(undefined)}>Cancelar</Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    disabled={deleteVivienda.isPending}
                    onClick={async () => {
                      await deleteVivienda.mutateAsync(homeToDelete.id);
                      setDeleteId(undefined);
                    }}
                  >
                    {deleteVivienda.isPending ? "Eliminando..." : "Eliminar"}
                  </Button>
                </div>
              </div>
            ) : null}
          </Drawer>
        </>
      )}
    </DashboardLayoutShell>
  );
}
