import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPago, deletePago, getPagos, updatePago } from "../api/pagos-api";
import { PagoInput } from "../types/pago";

export function usePagos(privateId?: string, enabled = true) {
  return useQuery({
    queryKey: ["pagos", privateId],
    queryFn: () => getPagos(privateId ?? ""),
    enabled: enabled && Boolean(privateId),
  });
}

export function useCreatePago(privateId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PagoInput) => {
      if (!privateId) throw new Error("Selecciona una privada");
      return createPago(privateId, payload);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pagos", privateId] }),
  });
}

export function useUpdatePago(privateId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ pagoId, payload }: { pagoId: string; payload: Partial<PagoInput> }) => {
      if (!privateId) throw new Error("Selecciona una privada");
      return updatePago(privateId, pagoId, payload);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pagos", privateId] }),
  });
}

export function useDeletePago(privateId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pagoId: string) => {
      if (!privateId) throw new Error("Selecciona una privada");
      return deletePago(privateId, pagoId);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pagos", privateId] }),
  });
}
