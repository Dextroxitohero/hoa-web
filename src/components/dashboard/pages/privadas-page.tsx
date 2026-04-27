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
import { CreatePrivadaForm } from "@/modules/privadas/components/create-privada-form";
import { PrivateSummaryCard } from "@/modules/privadas/components/private-summary-card";
import { useDeletePrivada, useUpdatePrivada } from "@/modules/privadas/hooks/use-privadas";

export function PrivadasModulePage() {
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
  const updatePrivada = useUpdatePrivada();
  const deletePrivada = useDeletePrivada();
  const privateToEdit = privadas.find((item) => item.id === editId);
  const privateToDelete = privadas.find((item) => item.id === deleteId);

  const { pagination, setPagination } = usePersistentPagination({
    storageKey: "table:privadas",
    userId: meQuery.data?.id,
  });
  const columns: ColumnDef<(typeof privadas)[number]>[] = useMemo(
    () => [
      { accessorKey: "name" },
      { accessorKey: "city" },
      { accessorKey: "country" },
      { id: "actions" },
    ],
    [],
  );
  const table = useReactTable({
    data: privadas,
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
              <h2 className="text-lg font-semibold">Privadas</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                >
                  Tabla
                </Button>
                <Button
                  variant={viewMode === "cards" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                >
                  Tarjetas
                </Button>
                <Button size="sm" onClick={() => setCreateOpen(true)}>
                  Nueva
                </Button>
              </div>
            </div>
            {viewMode === "cards" ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {privadas.map((item) => (
                  <PrivateSummaryCard key={item.id} {...item} />
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/60 text-left">
                    <tr>
                      <th className="px-4 py-3 font-medium">Nombre</th>
                      <th className="px-4 py-3 font-medium">Ciudad</th>
                      <th className="px-4 py-3 font-medium">Pais</th>
                      <th className="px-4 py-3 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => {
                      const item = row.original;
                      return (
                        <tr key={item.id} className="border-t">
                          <td className="px-4 py-3">{item.name}</td>
                          <td className="px-4 py-3">{item.city}</td>
                          <td className="px-4 py-3">{item.country}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => setEditId(item.id)}>
                                Editar
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setDeleteId(item.id)}
                              >
                                Eliminar
                              </Button>
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

          <Drawer
            open={createOpen}
            onOpenChange={setCreateOpen}
            title="Registrar privada"
            description="Alta de nueva privada"
          >
            <CreatePrivadaForm onSubmitted={() => setCreateOpen(false)} />
          </Drawer>

          <Drawer
            open={Boolean(privateToEdit)}
            onOpenChange={(open) => {
              if (!open) setEditId(undefined);
            }}
            title="Editar privada"
          >
            {privateToEdit ? (
              <CreatePrivadaForm
                title="Editar privada"
                submitLabel="Guardar cambios"
                initialValues={{
                  name: privateToEdit.name,
                  address: privateToEdit.address,
                  city: privateToEdit.city,
                  country: privateToEdit.country,
                  postalCode: privateToEdit.postalCode,
                  phone: privateToEdit.phone ?? "",
                  email: privateToEdit.email ?? "",
                }}
                pending={updatePrivada.isPending}
                error={updatePrivada.error}
                onSubmit={async (payload) => {
                  await updatePrivada.mutateAsync({ id: privateToEdit.id, payload });
                }}
                onSubmitted={() => setEditId(undefined)}
              />
            ) : null}
          </Drawer>

          <Drawer
            open={Boolean(privateToDelete)}
            onOpenChange={(open) => {
              if (!open) setDeleteId(undefined);
            }}
            title="Eliminar privada"
            description="Esta accion no se puede deshacer"
          >
            {privateToDelete ? (
              <div className="space-y-4">
                <p className="text-sm">
                  Vas a eliminar la privada <strong>{privateToDelete.name}</strong>.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setDeleteId(undefined)}>
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    disabled={deletePrivada.isPending}
                    onClick={async () => {
                      await deletePrivada.mutateAsync(privateToDelete.id);
                      setDeleteId(undefined);
                    }}
                  >
                    {deletePrivada.isPending ? "Eliminando..." : "Eliminar"}
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
