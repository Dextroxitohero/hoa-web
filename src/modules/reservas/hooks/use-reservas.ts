import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReserva,
  deleteReserva,
  getReservas,
  updateReserva,
} from "../api/reservas-api";
import { ReservaInput } from "../types/reserva";

export function useReservas(
  privateId?: string,
  amenityId?: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ["reservas", privateId, amenityId],
    queryFn: () => getReservas(privateId ?? "", amenityId),
    enabled: enabled && Boolean(privateId && amenityId),
  });
}

export function useCreateReserva(privateId?: string, amenityId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReservaInput) => {
      if (!privateId || !amenityId) throw new Error("Selecciona privada y amenity");
      return createReserva(privateId, amenityId, payload);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["reservas", privateId, amenityId] }),
  });
}

export function useUpdateReserva(privateId?: string, amenityId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      reservationId,
      payload,
    }: {
      reservationId: string;
      payload: Partial<ReservaInput>;
    }) => {
      if (!privateId || !amenityId) throw new Error("Selecciona privada y amenity");
      return updateReserva(privateId, amenityId, reservationId, payload);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["reservas", privateId, amenityId] }),
  });
}

export function useDeleteReserva(privateId?: string, amenityId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reservationId: string) => {
      if (!privateId || !amenityId) throw new Error("Selecciona privada y amenity");
      return deleteReserva(privateId, amenityId, reservationId);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["reservas", privateId, amenityId] }),
  });
}
