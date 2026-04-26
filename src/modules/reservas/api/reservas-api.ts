import { apiClient } from "@/lib/api/client";
import { Reserva, ReservaInput } from "../types/reserva";

export async function getReservas(privateId: string, amenityId?: string) {
  if (!privateId || !amenityId) return [];
  const { data } = await apiClient.get<Reserva[]>(
    `/privadas/${privateId}/amenities/${amenityId}/reservas`,
  );
  return data;
}

export async function createReserva(
  privateId: string,
  amenityId: string,
  payload: ReservaInput,
) {
  const { data } = await apiClient.post<Reserva>(
    `/privadas/${privateId}/amenities/${amenityId}/reservas`,
    payload,
  );
  return data;
}

export async function updateReserva(
  privateId: string,
  amenityId: string,
  reservationId: string,
  payload: Partial<ReservaInput>,
) {
  const { data } = await apiClient.patch<Reserva>(
    `/privadas/${privateId}/amenities/${amenityId}/reservas/${reservationId}`,
    payload,
  );
  return data;
}

export async function deleteReserva(
  privateId: string,
  amenityId: string,
  reservationId: string,
) {
  const { data } = await apiClient.delete<{ ok: boolean }>(
    `/privadas/${privateId}/amenities/${amenityId}/reservas/${reservationId}`,
  );
  return data;
}
