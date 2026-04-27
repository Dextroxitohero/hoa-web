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
import { AmenityForm } from "@/modules/amenities/components/amenity-form";
import { useAmenities, useCreateAmenity, useDeleteAmenity, useUpdateAmenity } from "@/modules/amenities/hooks/use-amenities";

export function AmenitiesModulePage() {
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
  const amenitiesQuery = useAmenities(activePrivateId, isAuthenticated);
  const amenities = amenitiesQuery.data ?? [];
  const createAmenity = useCreateAmenity(activePrivateId);
  const updateAmenity = useUpdateAmenity(activePrivateId);
  const deleteAmenity = useDeleteAmenity(activePrivateId);
  const amenityToEdit = amenities.find((item) => item.id === editId);
  const amenityToDelete = amenities.find((item) => item.id === deleteId);

  const { pagination, setPagination } = usePersistentPagination({
    storageKey: "table:amenities",
    userId: meQuery.data?.id,
  });
  const columns: ColumnDef<(typeof amenities)[number]>[] = useMemo(
    () => [{ accessorKey: "name" }, { accessorKey: "bookingCost" }, { id: "actions" }],
    [],
  );
  const table = useReactTable({
    data: amenities,
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
              <h2 className="text-lg font-semibold">Amenities</h2>
              <div className="flex items-center gap-2">
                <Button variant={viewMode === "table" ? "default" : "outline"} size="sm" onClick={() => setViewMode("table")}>Tabla</Button>
                <Button variant={viewMode === "cards" ? "default" : "outline"} size="sm" onClick={() => setViewMode("cards")}>Tarjetas</Button>
                <Button size="sm" onClick={() => setCreateOpen(true)}>Nuevo</Button>
              </div>
            </div>
            {viewMode === "cards" ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {amenities.map((amenity) => (
                  <article key={amenity.id} className="rounded-xl border bg-card p-4">
                    <p className="font-semibold">{amenity.name}</p>
                    <p className="text-sm text-muted-foreground">{amenity.description || "Sin descripcion"}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/60 text-left">
                    <tr><th className="px-4 py-3 font-medium">Amenity</th><th className="px-4 py-3 font-medium">Reserva</th><th className="px-4 py-3 font-medium">Acciones</th></tr>
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => {
                      const amenity = row.original;
                      return (
                        <tr key={amenity.id} className="border-t">
                          <td className="px-4 py-3">{amenity.name}</td>
                          <td className="px-4 py-3">${amenity.bookingCost}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => setEditId(amenity.id)}>Editar</Button>
                              <Button variant="destructive" size="sm" onClick={() => setDeleteId(amenity.id)}>Eliminar</Button>
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

          <Drawer open={createOpen} onOpenChange={setCreateOpen} title="Registrar amenity">
            <AmenityForm
              submitLabel="Crear amenity"
              pending={createAmenity.isPending}
              error={createAmenity.error}
              onSubmit={async (payload) => {
                await createAmenity.mutateAsync(payload);
              }}
              onSubmitted={() => setCreateOpen(false)}
            />
          </Drawer>
          <Drawer open={Boolean(amenityToEdit)} onOpenChange={(open) => !open && setEditId(undefined)} title="Editar amenity">
            {amenityToEdit ? (
              <AmenityForm
                title="Editar amenity"
                submitLabel="Guardar cambios"
                initialValues={{
                  name: amenityToEdit.name,
                  description: amenityToEdit.description ?? "",
                  bookingCost: Number(amenityToEdit.bookingCost),
                  cleaningCost: Number(amenityToEdit.cleaningCost),
                  openingTime: amenityToEdit.openingTime,
                  closingTime: amenityToEdit.closingTime,
                }}
                pending={updateAmenity.isPending}
                error={updateAmenity.error}
                onSubmit={async (payload) => {
                  await updateAmenity.mutateAsync({ amenityId: amenityToEdit.id, payload });
                }}
                onSubmitted={() => setEditId(undefined)}
              />
            ) : null}
          </Drawer>
          <Drawer open={Boolean(amenityToDelete)} onOpenChange={(open) => !open && setDeleteId(undefined)} title="Eliminar amenity" description="Esta accion no se puede deshacer">
            {amenityToDelete ? (
              <div className="space-y-4">
                <p className="text-sm">
                  Vas a eliminar el amenity <strong>{amenityToDelete.name}</strong>.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setDeleteId(undefined)}>Cancelar</Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    disabled={deleteAmenity.isPending}
                    onClick={async () => {
                      await deleteAmenity.mutateAsync(amenityToDelete.id);
                      setDeleteId(undefined);
                    }}
                  >
                    {deleteAmenity.isPending ? "Eliminando..." : "Eliminar"}
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
