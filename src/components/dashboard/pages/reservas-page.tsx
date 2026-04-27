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
import { useAmenities } from "@/modules/amenities/hooks/use-amenities";
import { ReservaForm } from "@/modules/reservas/components/reserva-form";
import { useCreateReserva, useDeleteReserva, useReservas, useUpdateReserva } from "@/modules/reservas/hooks/use-reservas";

export function ReservasModulePage() {
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
  const [selectedAmenityId, setSelectedAmenityId] = useState<string>();
  const amenitiesQuery = useAmenities(activePrivateId, isAuthenticated);
  const amenities = amenitiesQuery.data ?? [];
  const activeAmenityId = selectedAmenityId ?? amenities[0]?.id;
  const reservasQuery = useReservas(activePrivateId, activeAmenityId, isAuthenticated);
  const reservas = reservasQuery.data ?? [];
  const createReserva = useCreateReserva(activePrivateId, activeAmenityId);
  const updateReserva = useUpdateReserva(activePrivateId, activeAmenityId);
  const deleteReserva = useDeleteReserva(activePrivateId, activeAmenityId);
  const reservaToEdit = reservas.find((item) => item.id === editId);
  const reservaToDelete = reservas.find((item) => item.id === deleteId);

  const { pagination, setPagination } = usePersistentPagination({
    storageKey: "table:reservas",
    userId: meQuery.data?.id,
  });
  const columns: ColumnDef<(typeof reservas)[number]>[] = useMemo(
    () => [{ accessorKey: "contactName" }, { accessorKey: "startsAt" }, { id: "actions" }],
    [],
  );
  const table = useReactTable({
    data: reservas,
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
              <h2 className="text-lg font-semibold">Reservas</h2>
              <div className="flex items-center gap-2">
                <select
                  className="rounded-md border bg-background px-3 py-1 text-sm"
                  value={activeAmenityId ?? ""}
                  onChange={(event) => setSelectedAmenityId(event.target.value)}
                >
                  {amenities.map((amenity) => (
                    <option key={amenity.id} value={amenity.id}>{amenity.name}</option>
                  ))}
                </select>
                <Button variant={viewMode === "table" ? "default" : "outline"} size="sm" onClick={() => setViewMode("table")}>Tabla</Button>
                <Button variant={viewMode === "cards" ? "default" : "outline"} size="sm" onClick={() => setViewMode("cards")}>Tarjetas</Button>
                <Button size="sm" onClick={() => setCreateOpen(true)}>Nueva</Button>
              </div>
            </div>
            {viewMode === "cards" ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {reservas.map((reserva) => (
                  <article key={reserva.id} className="rounded-xl border bg-card p-4">
                    <p className="font-semibold">{reserva.contactName}</p>
                    <p className="text-sm text-muted-foreground">{new Date(reserva.startsAt).toLocaleString("es-MX")}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/60 text-left">
                    <tr><th className="px-4 py-3 font-medium">Responsable</th><th className="px-4 py-3 font-medium">Inicio</th><th className="px-4 py-3 font-medium">Acciones</th></tr>
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => {
                      const reserva = row.original;
                      return (
                        <tr key={reserva.id} className="border-t">
                          <td className="px-4 py-3">{reserva.contactName}</td>
                          <td className="px-4 py-3">{new Date(reserva.startsAt).toLocaleString("es-MX")}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => setEditId(reserva.id)}>Editar</Button>
                              <Button variant="destructive" size="sm" onClick={() => setDeleteId(reserva.id)}>Eliminar</Button>
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

          <Drawer open={createOpen} onOpenChange={setCreateOpen} title="Registrar reserva">
            <ReservaForm
              submitLabel="Crear reserva"
              pending={createReserva.isPending}
              error={createReserva.error}
              onSubmit={async (payload) => createReserva.mutateAsync(payload)}
              onSubmitted={() => setCreateOpen(false)}
            />
          </Drawer>
          <Drawer open={Boolean(reservaToEdit)} onOpenChange={(open) => !open && setEditId(undefined)} title="Editar reserva">
            {reservaToEdit ? (
              <ReservaForm
                title="Editar reserva"
                submitLabel="Guardar cambios"
                initialValues={{
                  homeId: reservaToEdit.homeId,
                  reservationDate: reservaToEdit.reservationDate,
                  contactName: reservaToEdit.contactName,
                  contactPhone: reservaToEdit.contactPhone,
                  contactEmail: reservaToEdit.contactEmail ?? "",
                  startsAt: reservaToEdit.startsAt,
                  endsAt: reservaToEdit.endsAt,
                }}
                pending={updateReserva.isPending}
                error={updateReserva.error}
                onSubmit={async (payload) =>
                  updateReserva.mutateAsync({ reservationId: reservaToEdit.id, payload })
                }
                onSubmitted={() => setEditId(undefined)}
              />
            ) : null}
          </Drawer>
          <Drawer open={Boolean(reservaToDelete)} onOpenChange={(open) => !open && setDeleteId(undefined)} title="Eliminar reserva" description="Esta accion no se puede deshacer">
            {reservaToDelete ? (
              <div className="space-y-4">
                <p className="text-sm">
                  Vas a eliminar la reserva de <strong>{reservaToDelete.contactName}</strong>.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setDeleteId(undefined)}>Cancelar</Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    disabled={deleteReserva.isPending}
                    onClick={async () => {
                      await deleteReserva.mutateAsync(reservaToDelete.id);
                      setDeleteId(undefined);
                    }}
                  >
                    {deleteReserva.isPending ? "Eliminando..." : "Eliminar"}
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
