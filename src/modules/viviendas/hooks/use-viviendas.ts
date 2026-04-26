import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createVivienda,
  deleteVivienda,
  getViviendas,
  updateVivienda,
} from "../api/viviendas-api";
import { CreateHomeInput } from "../types/home";

export function useViviendas(privateId?: string, enabled = true) {
  return useQuery({
    queryKey: ["viviendas", privateId],
    queryFn: () => getViviendas(privateId ?? ""),
    enabled: enabled && Boolean(privateId),
  });
}

export function useCreateVivienda(privateId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateHomeInput) => {
      if (!privateId) {
        throw new Error("Selecciona una privada para registrar vivienda");
      }
      return createVivienda(privateId, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["viviendas", privateId] });
    },
  });
}

export function useUpdateVivienda(privateId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      homeId,
      payload,
    }: {
      homeId: string;
      payload: Partial<CreateHomeInput>;
    }) => {
      if (!privateId) {
        throw new Error("Selecciona una privada para actualizar vivienda");
      }
      return updateVivienda(privateId, homeId, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["viviendas", privateId] });
    },
  });
}

export function useDeleteVivienda(privateId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (homeId: string) => {
      if (!privateId) {
        throw new Error("Selecciona una privada para eliminar vivienda");
      }
      return deleteVivienda(privateId, homeId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["viviendas", privateId] });
    },
  });
}
