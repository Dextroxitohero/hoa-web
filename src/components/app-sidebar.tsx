"use client";

import * as React from "react";
import {
  HiOutlineBuildingOffice2,
  HiOutlineCalendarDays,
  HiOutlineCreditCard,
  HiOutlineHomeModern,
  HiOutlineMapPin,
  HiOutlineSquares2X2,
  HiOutlineUsers,
} from "react-icons/hi2";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { PrivateCommunitySummary } from "@/modules/privadas/types/private-community";

const modules = [
  { title: "Panel", href: "/", icon: HiOutlineSquares2X2 },
  { title: "Privadas", href: "/privadas", icon: HiOutlineBuildingOffice2 },
  { title: "Viviendas", href: "/viviendas", icon: HiOutlineHomeModern },
  { title: "Amenities", href: "/amenities", icon: HiOutlineMapPin },
  { title: "Reservas", href: "/reservas", icon: HiOutlineCalendarDays },
  { title: "Pagos", href: "/pagos", icon: HiOutlineCreditCard },
  { title: "Usuarios", href: "/usuarios", icon: HiOutlineUsers },
];

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  privadas: PrivateCommunitySummary[];
  activePrivateId?: string;
  isSuperadmin: boolean;
  onPrivateChange: (privateId: string) => void;
};

export function AppSidebar({
  privadas,
  activePrivateId,
  isSuperadmin,
  onPrivateChange,
  ...props
}: AppSidebarProps) {
  const activePrivate = privadas.find((item) => item.id === activePrivateId);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="space-y-2 px-2 py-1">
          <p className="text-xs text-sidebar-foreground/70">HOA-Maintenance</p>
          <p className="text-sm font-semibold">HabitaPro</p>
          {isSuperadmin ? (
            <select
              value={activePrivateId ?? ""}
              onChange={(event) => onPrivateChange(event.target.value)}
              className="w-full rounded-md border border-sidebar-border bg-sidebar px-2 py-1 text-xs"
            >
              {privadas.length === 0 ? (
                <option value="">Sin privadas</option>
              ) : null}
              {privadas.map((privada) => (
                <option key={privada.id} value={privada.id}>
                  {privada.name}
                </option>
              ))}
            </select>
          ) : (
            <p className="truncate text-xs text-sidebar-foreground/80">
              Privada: {activePrivate?.name ?? "Sin privada asignada"}
            </p>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Módulos</SidebarGroupLabel>
          <SidebarMenu>
            {modules.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} render={<a href={item.href} />}>
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
