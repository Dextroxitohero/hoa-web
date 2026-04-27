import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUsuario,
  deleteUsuario,
  getUsuarios,
  updateUsuario,
} from "../api/usuarios-api";
import { CreateUsuarioInput, UpdateUsuarioInput, UserRole } from "../types/usuario";

export function useUsuarios(
  filters: { tenantId?: string; role?: UserRole },
  enabled = true,
) {
  return useQuery({
    queryKey: ["usuarios", filters.tenantId, filters.role],
    queryFn: () => getUsuarios(filters),
    enabled,
  });
}

export function useCreateUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUsuarioInput) => createUsuario(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["usuarios"] }),
  });
}

export function useUpdateUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string;
      payload: UpdateUsuarioInput;
    }) => updateUsuario(userId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["usuarios"] }),
  });
}

export function useDeleteUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => deleteUsuario(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["usuarios"] }),
  });
}
