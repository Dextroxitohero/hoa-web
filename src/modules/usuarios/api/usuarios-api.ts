import { apiClient } from "@/lib/api/client";
import {
  CreateUsuarioInput,
  UpdateUsuarioInput,
  UserRole,
  Usuario,
} from "../types/usuario";

type ListParams = {
  tenantId?: string;
  role?: UserRole;
};

export async function getUsuarios(params: ListParams = {}) {
  const { data } = await apiClient.get<Usuario[]>("/usuarios", { params });
  return data;
}

export async function createUsuario(payload: CreateUsuarioInput) {
  const { data } = await apiClient.post<Usuario>("/usuarios", payload);
  return data;
}

export async function updateUsuario(userId: string, payload: UpdateUsuarioInput) {
  const { data } = await apiClient.patch<Usuario>(`/usuarios/${userId}`, payload);
  return data;
}

export async function deleteUsuario(userId: string) {
  const { data } = await apiClient.delete<{ ok: boolean }>(`/usuarios/${userId}`);
  return data;
}
