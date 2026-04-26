import { apiClient } from "@/lib/api/client";
import { Pago, PagoInput } from "../types/pago";

export async function getPagos(privateId: string) {
  if (!privateId) return [];
  const { data } = await apiClient.get<Pago[]>(`/privadas/${privateId}/pagos`);
  return data;
}

export async function createPago(privateId: string, payload: PagoInput) {
  const { data } = await apiClient.post<Pago>(`/privadas/${privateId}/pagos`, payload);
  return data;
}

export async function updatePago(
  privateId: string,
  pagoId: string,
  payload: Partial<PagoInput>,
) {
  const { data } = await apiClient.patch<Pago>(
    `/privadas/${privateId}/pagos/${pagoId}`,
    payload,
  );
  return data;
}

export async function deletePago(privateId: string, pagoId: string) {
  const { data } = await apiClient.delete<{ ok: boolean }>(
    `/privadas/${privateId}/pagos/${pagoId}`,
  );
  return data;
}
