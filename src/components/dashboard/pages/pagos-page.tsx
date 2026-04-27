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
import { PagoForm } from "@/modules/pagos/components/pago-form";
import { useCreatePago, useDeletePago, usePagos, useUpdatePago } from "@/modules/pagos/hooks/use-pagos";
import { useViviendas } from "@/modules/viviendas/hooks/use-viviendas";

export function PagosModulePage() {
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
  const pagosQuery = usePagos(activePrivateId, isAuthenticated);
  const pagos = pagosQuery.data ?? [];
  const createPago = useCreatePago(activePrivateId);
  const updatePago = useUpdatePago(activePrivateId);
  const deletePago = useDeletePago(activePrivateId);
  const paymentToEdit = pagos.find((item) => item.id === editId);
  const paymentToDelete = pagos.find((item) => item.id === deleteId);

  const { pagination, setPagination } = usePersistentPagination({
    storageKey: "table:pagos",
    userId: meQuery.data?.id,
  });
  const columns: ColumnDef<(typeof pagos)[number]>[] = useMemo(
    () => [
      { accessorKey: "home.homeNumber" },
      { accessorKey: "monthLabel" },
      { accessorKey: "amount" },
      { accessorKey: "paymentMethod" },
      { id: "actions" },
    ],
    [],
  );
  const table = useReactTable({
    data: pagos,
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
        <section className="rounded-xl border bg-card p-6"><p className="text-sm text-muted-foreground">Validando sesion...</p></section>
      ) : !isAuthenticated ? (
        <section className="rounded-xl border bg-card p-6"><p className="text-sm text-muted-foreground">Redirigiendo al login...</p></section>
      ) : (
        <>
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">Pagos</h2>
              <div className="flex items-center gap-2">
                <Button variant={viewMode === "table" ? "default" : "outline"} size="sm" onClick={() => setViewMode("table")}>Tabla</Button>
                <Button variant={viewMode === "cards" ? "default" : "outline"} size="sm" onClick={() => setViewMode("cards")}>Tarjetas</Button>
                <Button size="sm" onClick={() => setCreateOpen(true)}>Nuevo</Button>
              </div>
            </div>
            {viewMode === "cards" ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {pagos.map((pago) => (
                  <article key={pago.id} className="rounded-xl border bg-card p-4">
                    <p className="font-semibold">{pago.home.homeNumber}</p>
                    <p className="text-sm text-muted-foreground">{pago.monthLabel} - ${pago.amount}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/60 text-left">
                    <tr><th className="px-4 py-3 font-medium">Vivienda</th><th className="px-4 py-3 font-medium">Mes</th><th className="px-4 py-3 font-medium">Monto</th><th className="px-4 py-3 font-medium">Metodo</th><th className="px-4 py-3 font-medium">Acciones</th></tr>
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => {
                      const pago = row.original;
                      return (
                        <tr key={pago.id} className="border-t">
                          <td className="px-4 py-3">{pago.home.homeNumber}</td>
                          <td className="px-4 py-3">{pago.monthLabel}</td>
                          <td className="px-4 py-3">${pago.amount}</td>
                          <td className="px-4 py-3">{pago.paymentMethod}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => setEditId(pago.id)}>Editar</Button>
                              <Button variant="destructive" size="sm" onClick={() => setDeleteId(pago.id)}>Eliminar</Button>
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

          <Drawer open={createOpen} onOpenChange={setCreateOpen} title="Registrar pago">
            <PagoForm
              homes={viviendas.map((home) => ({ id: home.id, homeNumber: home.homeNumber }))}
              submitLabel="Crear pago"
              pending={createPago.isPending}
              error={createPago.error}
              onSubmit={async (payload) => {
                await createPago.mutateAsync(payload);
              }}
              onSubmitted={() => setCreateOpen(false)}
            />
          </Drawer>
          <Drawer open={Boolean(paymentToEdit)} onOpenChange={(open) => !open && setEditId(undefined)} title="Editar pago">
            {paymentToEdit ? (
              <PagoForm
                homes={viviendas.map((home) => ({ id: home.id, homeNumber: home.homeNumber }))}
                title="Editar pago"
                submitLabel="Guardar cambios"
                initialValues={{
                  homeId: paymentToEdit.homeId,
                  paymentDate: paymentToEdit.paymentDate,
                  monthLabel: paymentToEdit.monthLabel,
                  amount: Number(paymentToEdit.amount),
                  paymentMethod: paymentToEdit.paymentMethod,
                  referenceNumber: paymentToEdit.referenceNumber ?? "",
                  paymentNumber: paymentToEdit.paymentNumber ?? "",
                }}
                pending={updatePago.isPending}
                error={updatePago.error}
                onSubmit={async (payload) => {
                  await updatePago.mutateAsync({ pagoId: paymentToEdit.id, payload });
                }}
                onSubmitted={() => setEditId(undefined)}
              />
            ) : null}
          </Drawer>
          <Drawer open={Boolean(paymentToDelete)} onOpenChange={(open) => !open && setDeleteId(undefined)} title="Eliminar pago" description="Esta accion no se puede deshacer">
            {paymentToDelete ? (
              <div className="space-y-4">
                <p className="text-sm">
                  Vas a eliminar el pago de <strong>{paymentToDelete.home.homeNumber}</strong> ({paymentToDelete.monthLabel}).
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setDeleteId(undefined)}>Cancelar</Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    disabled={deletePago.isPending}
                    onClick={async () => {
                      await deletePago.mutateAsync(paymentToDelete.id);
                      setDeleteId(undefined);
                    }}
                  >
                    {deletePago.isPending ? "Eliminando..." : "Eliminar"}
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
