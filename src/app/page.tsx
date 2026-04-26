"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AmenityForm } from "@/modules/amenities/components/amenity-form";
import {
  useAmenities,
  useCreateAmenity,
  useDeleteAmenity,
  useUpdateAmenity,
} from "@/modules/amenities/hooks/use-amenities";
import { CreatePrivadaForm } from "@/modules/privadas/components/create-privada-form";
import { PagoForm } from "@/modules/pagos/components/pago-form";
import { ReservaForm } from "@/modules/reservas/components/reserva-form";
import {
  useCreateReserva,
  useDeleteReserva,
  useReservas,
  useUpdateReserva,
} from "@/modules/reservas/hooks/use-reservas";
import { PrivateSummaryCard } from "@/modules/privadas/components/private-summary-card";
import {
  useCreatePago,
  useDeletePago,
  usePagos,
  useUpdatePago,
} from "@/modules/pagos/hooks/use-pagos";
import {
  useDeletePrivada,
  usePrivadas,
  useUpdatePrivada,
} from "@/modules/privadas/hooks/use-privadas";
import { CreateViviendaForm } from "@/modules/viviendas/components/create-vivienda-form";
import { HomeListMobile } from "@/modules/viviendas/components/home-list-mobile";
import {
  useLogout,
  useMe,
} from "@/modules/usuarios-acceso/hooks/use-auth";
import {
  useDeleteVivienda,
  useUpdateVivienda,
  useViviendas,
} from "@/modules/viviendas/hooks/use-viviendas";

type DashboardSection =
  | "panel"
  | "privadas"
  | "viviendas"
  | "amenities"
  | "reservas"
  | "pagos";

type DashboardPageProps = {
  initialSection?: DashboardSection;
};

export function DashboardPage({ initialSection = "panel" }: DashboardPageProps) {
  const router = useRouter();
  const activeSection = initialSection;
  const meQuery = useMe();
  const logoutMutation = useLogout();
  const [privateViewMode, setPrivateViewMode] = useState<"table" | "cards">(
    "table",
  );
  const [homeViewMode, setHomeViewMode] = useState<"table" | "cards">("table");
  const [createPrivateOpen, setCreatePrivateOpen] = useState(false);
  const [createHomeOpen, setCreateHomeOpen] = useState(false);
  const [amenityViewMode, setAmenityViewMode] = useState<"table" | "cards">(
    "table",
  );
  const [reservationViewMode, setReservationViewMode] = useState<
    "table" | "cards"
  >("table");
  const [paymentViewMode, setPaymentViewMode] = useState<"table" | "cards">(
    "table",
  );
  const [createAmenityOpen, setCreateAmenityOpen] = useState(false);
  const [editAmenityId, setEditAmenityId] = useState<string>();
  const [deleteAmenityId, setDeleteAmenityId] = useState<string>();
  const [selectedAmenityId, setSelectedAmenityId] = useState<string>();
  const [createReservationOpen, setCreateReservationOpen] = useState(false);
  const [editReservationId, setEditReservationId] = useState<string>();
  const [deleteReservationId, setDeleteReservationId] = useState<string>();
  const [createPaymentOpen, setCreatePaymentOpen] = useState(false);
  const [editPaymentId, setEditPaymentId] = useState<string>();
  const [deletePaymentId, setDeletePaymentId] = useState<string>();
  const [editPrivateId, setEditPrivateId] = useState<string>();
  const [deletePrivateId, setDeletePrivateId] = useState<string>();
  const [editHomeId, setEditHomeId] = useState<string>();
  const [deleteHomeId, setDeleteHomeId] = useState<string>();
  const isAuthenticated = Boolean(meQuery.data);
  const isSuperadmin = meQuery.data?.roles?.includes("SUPERADMIN") ?? false;
  const [selectedPrivateId, setSelectedPrivateId] = useState<string>();
  const privadasQuery = usePrivadas(isAuthenticated);
  const privadas = privadasQuery.data ?? [];
  const updatePrivada = useUpdatePrivada();
  const deletePrivada = useDeletePrivada();

  const activePrivateId = isSuperadmin
    ? selectedPrivateId ?? privadas[0]?.id
    : meQuery.data?.tenantId ?? privadas[0]?.id;

  const viviendasQuery = useViviendas(activePrivateId, isAuthenticated);
  const viviendas = viviendasQuery.data ?? [];
  const updateVivienda = useUpdateVivienda(activePrivateId);
  const deleteVivienda = useDeleteVivienda(activePrivateId);
  const pagosQuery = usePagos(activePrivateId, isAuthenticated);
  const pagos = pagosQuery.data ?? [];
  const createPago = useCreatePago(activePrivateId);
  const updatePago = useUpdatePago(activePrivateId);
  const deletePago = useDeletePago(activePrivateId);
  const amenitiesQuery = useAmenities(activePrivateId, isAuthenticated);
  const amenities = amenitiesQuery.data ?? [];
  const activeAmenityId = selectedAmenityId ?? amenities[0]?.id;
  const reservasQuery = useReservas(
    activePrivateId,
    activeAmenityId,
    isAuthenticated,
  );
  const reservas = reservasQuery.data ?? [];
  const createAmenity = useCreateAmenity(activePrivateId);
  const updateAmenity = useUpdateAmenity(activePrivateId);
  const deleteAmenity = useDeleteAmenity(activePrivateId);
  const createReserva = useCreateReserva(activePrivateId, activeAmenityId);
  const updateReserva = useUpdateReserva(activePrivateId, activeAmenityId);
  const deleteReserva = useDeleteReserva(activePrivateId, activeAmenityId);

  const privateToEdit = privadas.find((item) => item.id === editPrivateId);
  const privateToDelete = privadas.find((item) => item.id === deletePrivateId);
  const homeToEdit = viviendas.find((item) => item.id === editHomeId);
  const homeToDelete = viviendas.find((item) => item.id === deleteHomeId);
  const amenityToEdit = amenities.find((item) => item.id === editAmenityId);
  const amenityToDelete = amenities.find((item) => item.id === deleteAmenityId);
  const reservaToEdit = reservas.find((item) => item.id === editReservationId);
  const reservaToDelete = reservas.find((item) => item.id === deleteReservationId);
  const paymentToEdit = pagos.find((item) => item.id === editPaymentId);
  const paymentToDelete = pagos.find((item) => item.id === deletePaymentId);

  useEffect(() => {
    if (!meQuery.isLoading && !meQuery.data) {
      router.replace("/login");
    }
  }, [meQuery.isLoading, meQuery.data, router]);

  return (
    <SidebarProvider>
      <AppSidebar
        privadas={privadas}
        activePrivateId={activePrivateId}
        isSuperadmin={isSuperadmin}
        onPrivateChange={setSelectedPrivateId}
      />
      <SidebarInset>
        <header
          className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
          id="panel"
        >
          <div className="flex w-full items-center justify-between gap-3 px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground">HOA-Maintenance</p>
                <p className="text-base font-semibold">HabitaPro</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <p className="hidden text-xs text-muted-foreground md:block">
                  {meQuery.data?.firstName} {meQuery.data?.lastName}
                </p>
              ) : null}
              <ThemeToggle />
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                >
                  Salir
                </Button>
              ) : null}
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 pb-6">

      {meQuery.isLoading ? (
        <section className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Validando sesión...
          </p>
        </section>
      ) : !isAuthenticated ? (
        <section className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Redirigiendo al login...
          </p>
        </section>
      ) : (
        <>
          {activeSection === "panel" ? (
          <section id="panel" className="rounded-xl border bg-card p-4 sm:p-6">
            <h2 className="text-lg font-medium sm:text-xl">Panel operativo</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Vista inicial mobile-first para operar privadas, viviendas y pagos
              desde celular o escritorio.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 md:flex md:flex-wrap">
              <Button
                className="w-full md:w-auto"
                onClick={() => setCreatePrivateOpen(true)}
              >
                Registrar privada
              </Button>
              <Button
                variant="outline"
                className="w-full md:w-auto"
                onClick={() => setCreateHomeOpen(true)}
              >
                Registrar vivienda
              </Button>
              <Button
                variant="outline"
                className="w-full md:w-auto"
                onClick={() => setCreatePaymentOpen(true)}
              >
                Registrar pago
              </Button>
            </div>
          </section>
          ) : null}

          {activeSection === "privadas" ? (
          <section id="privadas" className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">Privadas</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant={privateViewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPrivateViewMode("table")}
                >
                  Tabla
                </Button>
                <Button
                  variant={privateViewMode === "cards" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPrivateViewMode("cards")}
                >
                  Tarjetas
                </Button>
                <Button size="sm" onClick={() => setCreatePrivateOpen(true)}>
                  Nueva
                </Button>
              </div>
            </div>
            {privadasQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Cargando privadas...</p>
            ) : null}
            {privadasQuery.isError ? (
              <p className="text-sm text-destructive">
                No se pudieron cargar privadas. Verifica login y permisos.
              </p>
            ) : null}
            {privateViewMode === "cards" ? (
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
                      <th className="px-4 py-3 font-medium">País</th>
                      <th className="px-4 py-3 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {privadas.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="px-4 py-3">{item.name}</td>
                        <td className="px-4 py-3">{item.city}</td>
                        <td className="px-4 py-3">{item.country}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedPrivateId(item.id);
                                setCreateHomeOpen(true);
                              }}
                            >
                              Nueva vivienda
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditPrivateId(item.id)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setDeletePrivateId(item.id)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
          ) : null}

          {activeSection === "amenities" ? (
          <section id="amenities" className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">Amenities</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant={amenityViewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAmenityViewMode("table")}
                >
                  Tabla
                </Button>
                <Button
                  variant={amenityViewMode === "cards" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAmenityViewMode("cards")}
                >
                  Tarjetas
                </Button>
                <Button size="sm" onClick={() => setCreateAmenityOpen(true)}>
                  Nuevo
                </Button>
              </div>
            </div>
            {amenitiesQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Cargando amenities...</p>
            ) : null}
            {amenityViewMode === "cards" ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {amenities.map((amenity) => (
                  <article key={amenity.id} className="rounded-xl border bg-card p-4">
                    <p className="font-semibold">{amenity.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {amenity.description || "Sin descripción"}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/60 text-left">
                    <tr>
                      <th className="px-4 py-3 font-medium">Amenity</th>
                      <th className="px-4 py-3 font-medium">Reserva</th>
                      <th className="px-4 py-3 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {amenities.map((amenity) => (
                      <tr key={amenity.id} className="border-t">
                        <td className="px-4 py-3">{amenity.name}</td>
                        <td className="px-4 py-3">${amenity.bookingCost}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedAmenityId(amenity.id);
                                setCreateReservationOpen(true);
                              }}
                            >
                              Reserva
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditAmenityId(amenity.id)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setDeleteAmenityId(amenity.id)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
          ) : null}

          {activeSection === "reservas" ? (
          <section id="reservas" className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">Reservas</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant={reservationViewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setReservationViewMode("table")}
                >
                  Tabla
                </Button>
                <Button
                  variant={reservationViewMode === "cards" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setReservationViewMode("cards")}
                >
                  Tarjetas
                </Button>
                <Button size="sm" onClick={() => setCreateReservationOpen(true)}>
                  Nueva
                </Button>
              </div>
            </div>
            {reservationViewMode === "cards" ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {reservas.map((reserva) => (
                  <article key={reserva.id} className="rounded-xl border bg-card p-4">
                    <p className="font-semibold">{reserva.contactName}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(reserva.startsAt).toLocaleString("es-MX")}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/60 text-left">
                    <tr>
                      <th className="px-4 py-3 font-medium">Responsable</th>
                      <th className="px-4 py-3 font-medium">Inicio</th>
                      <th className="px-4 py-3 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservas.map((reserva) => (
                      <tr key={reserva.id} className="border-t">
                        <td className="px-4 py-3">{reserva.contactName}</td>
                        <td className="px-4 py-3">
                          {new Date(reserva.startsAt).toLocaleString("es-MX")}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditReservationId(reserva.id)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setDeleteReservationId(reserva.id)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
          ) : null}

          {activeSection === "viviendas" ? (
          <section id="viviendas" className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">Viviendas recientes</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant={homeViewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setHomeViewMode("table")}
                >
                  Tabla
                </Button>
                <Button
                  variant={homeViewMode === "cards" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setHomeViewMode("cards")}
                >
                  Tarjetas
                </Button>
                <Button size="sm" onClick={() => setCreateHomeOpen(true)}>
                  Nueva
                </Button>
              </div>
            </div>

            {viviendasQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Cargando viviendas...</p>
            ) : null}
            {viviendasQuery.isError ? (
              <p className="text-sm text-destructive">
                No se pudieron cargar viviendas de la privada seleccionada.
              </p>
            ) : null}

            {homeViewMode === "cards" ? (
              <HomeListMobile homes={viviendas} />
            ) : (
              <div className="overflow-hidden rounded-xl border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/60 text-left">
                    <tr>
                      <th className="px-4 py-3 font-medium">Vivienda</th>
                      <th className="px-4 py-3 font-medium">Teléfono</th>
                      <th className="px-4 py-3 font-medium">Reglamento</th>
                      <th className="px-4 py-3 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viviendas.map((home) => (
                      <tr key={home.id} className="border-t">
                        <td className="px-4 py-3">{home.homeNumber}</td>
                        <td className="px-4 py-3">{home.contactPhone ?? "-"}</td>
                        <td className="px-4 py-3">
                          {home.regulationSigned ? "Firmado" : "Pendiente"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditHomeId(home.id)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setDeleteHomeId(home.id)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
          ) : null}

          {activeSection === "pagos" ? (
          <section id="pagos" className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">Pagos</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant={paymentViewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPaymentViewMode("table")}
                >
                  Tabla
                </Button>
                <Button
                  variant={paymentViewMode === "cards" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPaymentViewMode("cards")}
                >
                  Tarjetas
                </Button>
                <Button size="sm" onClick={() => setCreatePaymentOpen(true)}>
                  Nuevo
                </Button>
              </div>
            </div>

            {pagosQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Cargando pagos...</p>
            ) : null}
            {pagosQuery.isError ? (
              <p className="text-sm text-destructive">
                No se pudieron cargar pagos de la privada seleccionada.
              </p>
            ) : null}

            {paymentViewMode === "cards" ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {pagos.map((pago) => (
                  <article key={pago.id} className="rounded-xl border bg-card p-4">
                    <p className="font-semibold">{pago.home.homeNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {pago.monthLabel} - ${pago.amount}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/60 text-left">
                    <tr>
                      <th className="px-4 py-3 font-medium">Vivienda</th>
                      <th className="px-4 py-3 font-medium">Mes</th>
                      <th className="px-4 py-3 font-medium">Monto</th>
                      <th className="px-4 py-3 font-medium">Método</th>
                      <th className="px-4 py-3 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagos.map((pago) => (
                      <tr key={pago.id} className="border-t">
                        <td className="px-4 py-3">{pago.home.homeNumber}</td>
                        <td className="px-4 py-3">{pago.monthLabel}</td>
                        <td className="px-4 py-3">${pago.amount}</td>
                        <td className="px-4 py-3">{pago.paymentMethod}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditPaymentId(pago.id)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setDeletePaymentId(pago.id)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
          ) : null}

          <Drawer
            open={createPrivateOpen}
            onOpenChange={setCreatePrivateOpen}
            title="Registrar privada"
            description="Alta de nueva privada mediante drawer"
          >
            <CreatePrivadaForm onSubmitted={() => setCreatePrivateOpen(false)} />
          </Drawer>

          <Drawer
            open={createHomeOpen}
            onOpenChange={setCreateHomeOpen}
            title="Registrar vivienda"
            description="Alta de vivienda vinculada a privada"
          >
            <CreateViviendaForm
              privateId={activePrivateId}
              privateOptions={privadas}
              onPrivateChange={setSelectedPrivateId}
              onSubmitted={() => setCreateHomeOpen(false)}
            />
          </Drawer>

          <Drawer
            open={Boolean(privateToEdit)}
            onOpenChange={(open) => {
              if (!open) setEditPrivateId(undefined);
            }}
            title="Editar privada"
            description="Actualiza la información principal de la privada"
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
                  await updatePrivada.mutateAsync({
                    id: privateToEdit.id,
                    payload,
                  });
                }}
                onSubmitted={() => setEditPrivateId(undefined)}
              />
            ) : null}
          </Drawer>

          <Drawer
            open={Boolean(privateToDelete)}
            onOpenChange={(open) => {
              if (!open) setDeletePrivateId(undefined);
            }}
            title="Eliminar privada"
            description="Esta acción no se puede deshacer"
          >
            {privateToDelete ? (
              <div className="space-y-4">
                <p className="text-sm">
                  Vas a eliminar la privada <strong>{privateToDelete.name}</strong>.
                </p>
                {deletePrivada.error ? (
                  <p className="text-sm text-destructive">
                    {deletePrivada.error instanceof Error
                      ? deletePrivada.error.message
                      : "No se pudo eliminar la privada"}
                  </p>
                ) : null}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setDeletePrivateId(undefined)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    disabled={deletePrivada.isPending}
                    onClick={async () => {
                      await deletePrivada.mutateAsync(privateToDelete.id);
                      if (selectedPrivateId === privateToDelete.id) {
                        setSelectedPrivateId(undefined);
                      }
                      setDeletePrivateId(undefined);
                    }}
                  >
                    {deletePrivada.isPending ? "Eliminando..." : "Eliminar"}
                  </Button>
                </div>
              </div>
            ) : null}
          </Drawer>

          <Drawer
            open={Boolean(homeToEdit)}
            onOpenChange={(open) => {
              if (!open) setEditHomeId(undefined);
            }}
            title="Editar vivienda"
            description="Actualiza los datos de la vivienda seleccionada"
          >
            {homeToEdit ? (
              <CreateViviendaForm
                privateId={activePrivateId}
                privateOptions={privadas}
                onPrivateChange={setSelectedPrivateId}
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
                  await updateVivienda.mutateAsync({
                    homeId: homeToEdit.id,
                    payload,
                  });
                }}
                onSubmitted={() => setEditHomeId(undefined)}
              />
            ) : null}
          </Drawer>

          <Drawer
            open={Boolean(homeToDelete)}
            onOpenChange={(open) => {
              if (!open) setDeleteHomeId(undefined);
            }}
            title="Eliminar vivienda"
            description="Esta acción no se puede deshacer"
          >
            {homeToDelete ? (
              <div className="space-y-4">
                <p className="text-sm">
                  Vas a eliminar la vivienda{" "}
                  <strong>{homeToDelete.homeNumber}</strong>.
                </p>
                {deleteVivienda.error ? (
                  <p className="text-sm text-destructive">
                    {deleteVivienda.error instanceof Error
                      ? deleteVivienda.error.message
                      : "No se pudo eliminar la vivienda"}
                  </p>
                ) : null}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setDeleteHomeId(undefined)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    disabled={deleteVivienda.isPending}
                    onClick={async () => {
                      await deleteVivienda.mutateAsync(homeToDelete.id);
                      setDeleteHomeId(undefined);
                    }}
                  >
                    {deleteVivienda.isPending ? "Eliminando..." : "Eliminar"}
                  </Button>
                </div>
              </div>
            ) : null}
          </Drawer>

          <Drawer
            open={createAmenityOpen}
            onOpenChange={setCreateAmenityOpen}
            title="Registrar amenity"
            description="Alta de amenity para la privada seleccionada"
          >
            <AmenityForm
              submitLabel="Crear amenity"
              pending={createAmenity.isPending}
              error={createAmenity.error}
              onSubmit={async (payload) => {
                await createAmenity.mutateAsync(payload);
              }}
              onSubmitted={() => setCreateAmenityOpen(false)}
            />
          </Drawer>

          <Drawer
            open={Boolean(amenityToEdit)}
            onOpenChange={(open) => {
              if (!open) setEditAmenityId(undefined);
            }}
            title="Editar amenity"
          >
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
                  await updateAmenity.mutateAsync({
                    amenityId: amenityToEdit.id,
                    payload,
                  });
                }}
                onSubmitted={() => setEditAmenityId(undefined)}
              />
            ) : null}
          </Drawer>

          <Drawer
            open={Boolean(amenityToDelete)}
            onOpenChange={(open) => {
              if (!open) setDeleteAmenityId(undefined);
            }}
            title="Eliminar amenity"
            description="Esta acción no se puede deshacer"
          >
            {amenityToDelete ? (
              <div className="space-y-4">
                <p className="text-sm">
                  Vas a eliminar el amenity <strong>{amenityToDelete.name}</strong>.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setDeleteAmenityId(undefined)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    disabled={deleteAmenity.isPending}
                    onClick={async () => {
                      await deleteAmenity.mutateAsync(amenityToDelete.id);
                      if (selectedAmenityId === amenityToDelete.id) {
                        setSelectedAmenityId(undefined);
                      }
                      setDeleteAmenityId(undefined);
                    }}
                  >
                    {deleteAmenity.isPending ? "Eliminando..." : "Eliminar"}
                  </Button>
                </div>
              </div>
            ) : null}
          </Drawer>

          <Drawer
            open={createReservationOpen}
            onOpenChange={setCreateReservationOpen}
            title="Registrar reserva"
            description="Alta de reserva para el amenity seleccionado"
          >
            <ReservaForm
              submitLabel="Crear reserva"
              pending={createReserva.isPending}
              error={createReserva.error}
              onSubmit={async (payload) => {
                await createReserva.mutateAsync(payload);
              }}
              onSubmitted={() => setCreateReservationOpen(false)}
            />
          </Drawer>

          <Drawer
            open={Boolean(reservaToEdit)}
            onOpenChange={(open) => {
              if (!open) setEditReservationId(undefined);
            }}
            title="Editar reserva"
          >
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
                onSubmit={async (payload) => {
                  await updateReserva.mutateAsync({
                    reservationId: reservaToEdit.id,
                    payload,
                  });
                }}
                onSubmitted={() => setEditReservationId(undefined)}
              />
            ) : null}
          </Drawer>

          <Drawer
            open={Boolean(reservaToDelete)}
            onOpenChange={(open) => {
              if (!open) setDeleteReservationId(undefined);
            }}
            title="Eliminar reserva"
            description="Esta acción no se puede deshacer"
          >
            {reservaToDelete ? (
              <div className="space-y-4">
                <p className="text-sm">
                  Vas a eliminar la reserva de{" "}
                  <strong>{reservaToDelete.contactName}</strong>.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setDeleteReservationId(undefined)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    disabled={deleteReserva.isPending}
                    onClick={async () => {
                      await deleteReserva.mutateAsync(reservaToDelete.id);
                      setDeleteReservationId(undefined);
                    }}
                  >
                    {deleteReserva.isPending ? "Eliminando..." : "Eliminar"}
                  </Button>
                </div>
              </div>
            ) : null}
          </Drawer>

          <Drawer
            open={createPaymentOpen}
            onOpenChange={setCreatePaymentOpen}
            title="Registrar pago"
            description="Alta de pago para la privada seleccionada"
          >
            <PagoForm
              homes={viviendas.map((home) => ({
                id: home.id,
                homeNumber: home.homeNumber,
              }))}
              submitLabel="Crear pago"
              pending={createPago.isPending}
              error={createPago.error}
              onSubmit={async (payload) => {
                await createPago.mutateAsync(payload);
              }}
              onSubmitted={() => setCreatePaymentOpen(false)}
            />
          </Drawer>

          <Drawer
            open={Boolean(paymentToEdit)}
            onOpenChange={(open) => {
              if (!open) setEditPaymentId(undefined);
            }}
            title="Editar pago"
          >
            {paymentToEdit ? (
              <PagoForm
                homes={viviendas.map((home) => ({
                  id: home.id,
                  homeNumber: home.homeNumber,
                }))}
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
                  await updatePago.mutateAsync({
                    pagoId: paymentToEdit.id,
                    payload,
                  });
                }}
                onSubmitted={() => setEditPaymentId(undefined)}
              />
            ) : null}
          </Drawer>

          <Drawer
            open={Boolean(paymentToDelete)}
            onOpenChange={(open) => {
              if (!open) setDeletePaymentId(undefined);
            }}
            title="Eliminar pago"
            description="Esta acción no se puede deshacer"
          >
            {paymentToDelete ? (
              <div className="space-y-4">
                <p className="text-sm">
                  Vas a eliminar el pago de{" "}
                  <strong>{paymentToDelete.home.homeNumber}</strong> ({paymentToDelete.monthLabel}
                  ).
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setDeletePaymentId(undefined)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    disabled={deletePago.isPending}
                    onClick={async () => {
                      await deletePago.mutateAsync(paymentToDelete.id);
                      setDeletePaymentId(undefined);
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
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function Home() {
  return <DashboardPage initialSection="panel" />;
}
