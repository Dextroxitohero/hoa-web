import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPrivada,
  deletePrivada,
  getPrivadas,
  updatePrivada,
} from "../api/privadas-api";

export function usePrivadas(enabled = true) {
  return useQuery({
    queryKey: ["privadas"],
    queryFn: getPrivadas,
    enabled,
  });
}

export function useCreatePrivada() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPrivada,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["privadas"] });
    },
  });
}

export function useUpdatePrivada() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof updatePrivada>[1];
    }) => updatePrivada(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["privadas"] });
    },
  });
}

export function useDeletePrivada() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePrivada(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["privadas"] });
      await queryClient.invalidateQueries({ queryKey: ["viviendas"] });
    },
  });
}
