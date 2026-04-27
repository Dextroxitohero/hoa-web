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
import { useDashboardShellState } from "@/components/dashboard/hooks/use-dashboard-shell-state";
import { DashboardLayoutShell } from "@/components/dashboard/dashboard-layout-shell";
import { usePersistentPagination } from "@/lib/table/use-persistent-pagination";
import { UsuarioForm } from "@/modules/usuarios/components/usuario-form";
import {
  useCreateUsuario,
  useDeleteUsuario,
  useUpdateUsuario,
  useUsuarios,
} from "@/modules/usuarios/hooks/use-usuarios";
import { UserRole } from "@/modules/usuarios/types/usuario";

export function UsuariosModulePage() {
  const {
    meQuery,
    logoutMutation,
    isAuthenticated,
    isSuperadmin,
    privadas,
    activePrivateId,
    onPrivateChange,
  } = useDashboardShellState();
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [editUserId, setEditUserId] = useState<string>();
  const [deleteUserId, setDeleteUserId] = useState<string>();
  const [userRoleFilter, setUserRoleFilter] = useState<UserRole | "ALL">("ALL");

  const usuariosQuery = useUsuarios(
    {
      tenantId: isSuperadmin ? activePrivateId : undefined,
      role: userRoleFilter === "ALL" ? undefined : userRoleFilter,
    },
    isAuthenticated,
  );
  const usuarios = usuariosQuery.data ?? [];
  const createUsuario = useCreateUsuario();
  const updateUsuario = useUpdateUsuario();
  const deleteUsuario = useDeleteUsuario();
  const userToEdit = usuarios.find((item) => item.id === editUserId);
  const userToDelete = usuarios.find((item) => item.id === deleteUserId);

  const currentUserId = meQuery.data?.id;
  const { pagination: usuariosPagination, setPagination: setUsuariosPagination } =
    usePersistentPagination({
      storageKey: "table:usuarios",
      userId: currentUserId,
    });

  const usuariosColumns: ColumnDef<(typeof usuarios)[number]>[] = useMemo(
    () => [
      { accessorKey: "firstName" },
      { accessorKey: "email" },
      { id: "roles" },
      { accessorKey: "isActive" },
      { id: "actions" },
    ],
    [],
  );

  const usuariosTable = useReactTable({
    data: usuarios,
    columns: usuariosColumns,
    state: { pagination: usuariosPagination },
    onPaginationChange: setUsuariosPagination,
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
          <section id="usuarios" className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">Usuarios</h2>
              <div className="flex items-center gap-2">
                {isSuperadmin ? (
                  <select
                    className="rounded-md border bg-background px-3 py-1 text-sm"
                    value={userRoleFilter}
                    onChange={(event) =>
                      setUserRoleFilter(event.target.value as UserRole | "ALL")
                    }
                  >
                    <option value="ALL">Todos los roles</option>
                    <option value="SUPERADMIN">Solo SUPERADMIN</option>
                    <option value="ADMIN_PRIVADA">Solo ADMIN_PRIVADA</option>
                    <option value="TESORERO">Solo TESORERO</option>
                    <option value="PROPIETARIO">Solo PROPIETARIO</option>
                    <option value="RESIDENTE">Solo RESIDENTE</option>
                  </select>
                ) : null}
                <Button size="sm" onClick={() => setCreateUserOpen(true)}>
                  Nuevo
                </Button>
              </div>
            </div>
            {usuariosQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Cargando usuarios...</p>
            ) : null}
            {usuariosQuery.isError ? (
              <p className="text-sm text-destructive">No se pudieron cargar usuarios.</p>
            ) : null}
            <div className="overflow-hidden rounded-xl border">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium">Nombre</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Rol</th>
                    <th className="px-4 py-3 font-medium">Estado</th>
                    <th className="px-4 py-3 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosTable.getRowModel().rows.map((row) => {
                    const user = row.original;
                    return (
                      <tr key={user.id} className="border-t">
                        <td className="px-4 py-3">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">
                          {user.roles.map((item) => item.role.name).join(", ")}
                        </td>
                        <td className="px-4 py-3">{user.isActive ? "Activo" : "Inactivo"}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditUserId(user.id)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setDeleteUserId(user.id)}
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
              <TablePagination table={usuariosTable} />
            </div>
          </section>

          <Drawer
            open={createUserOpen}
            onOpenChange={setCreateUserOpen}
            title="Registrar usuario"
            description="Alta de personal administrativo"
          >
            <UsuarioForm
              privadas={privadas}
              isSuperadmin={isSuperadmin}
              pending={createUsuario.isPending}
              error={createUsuario.error}
              initialValues={{
                tenantId: activePrivateId,
                roles: [isSuperadmin ? "ADMIN_PRIVADA" : "TESORERO"],
              }}
              onSubmit={async (payload) => {
                await createUsuario.mutateAsync(payload);
              }}
              onSubmitted={() => setCreateUserOpen(false)}
            />
          </Drawer>

          <Drawer
            open={Boolean(userToEdit)}
            onOpenChange={(open) => {
              if (!open) setEditUserId(undefined);
            }}
            title="Editar usuario"
          >
            {userToEdit ? (
              <UsuarioForm
                privadas={privadas}
                isSuperadmin={isSuperadmin}
                title="Editar usuario"
                submitLabel="Guardar cambios"
                pending={updateUsuario.isPending}
                error={updateUsuario.error}
                initialValues={{
                  firstName: userToEdit.firstName,
                  lastName: userToEdit.lastName,
                  email: userToEdit.email,
                  phone: userToEdit.phone ?? "",
                  tenantId: userToEdit.tenantId ?? activePrivateId,
                  roles: [userToEdit.roles[0]?.role.name ?? "ADMIN_PRIVADA"],
                }}
                onSubmit={async (payload) => {
                  const { password, ...rest } = payload;
                  await updateUsuario.mutateAsync({
                    userId: userToEdit.id,
                    payload: {
                      ...rest,
                      password: password ? password : undefined,
                    },
                  });
                }}
                onSubmitted={() => setEditUserId(undefined)}
              />
            ) : null}
          </Drawer>

          <Drawer
            open={Boolean(userToDelete)}
            onOpenChange={(open) => {
              if (!open) setDeleteUserId(undefined);
            }}
            title="Eliminar usuario"
            description="Esta accion no se puede deshacer"
          >
            {userToDelete ? (
              <div className="space-y-4">
                <p className="text-sm">
                  Vas a eliminar a <strong>{userToDelete.email}</strong>.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setDeleteUserId(undefined)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    disabled={deleteUsuario.isPending}
                    onClick={async () => {
                      await deleteUsuario.mutateAsync(userToDelete.id);
                      setDeleteUserId(undefined);
                    }}
                  >
                    {deleteUsuario.isPending ? "Eliminando..." : "Eliminar"}
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
