import { apiClient } from "@/lib/api/client";
import { CreateHomeInput, Home } from "../types/home";

export async function getViviendas(privateId: string) {
  if (!privateId) {
    return [];
  }

  const { data } = await apiClient.get<Home[]>(`/privadas/${privateId}/viviendas`);
  return data;
}

export async function createVivienda(
  privateId: string,
  payload: CreateHomeInput,
) {
  const { data } = await apiClient.post<Home>(
    `/privadas/${privateId}/viviendas`,
    payload,
  );
  return data;
}

export async function updateVivienda(
  privateId: string,
  homeId: string,
  payload: Partial<CreateHomeInput>,
) {
  const { data } = await apiClient.patch<Home>(
    `/privadas/${privateId}/viviendas/${homeId}`,
    payload,
  );
  return data;
}

export async function deleteVivienda(privateId: string, homeId: string) {
  const { data } = await apiClient.delete<{ ok: boolean }>(
    `/privadas/${privateId}/viviendas/${homeId}`,
  );
  return data;
}
