import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAmenity,
  deleteAmenity,
  getAmenities,
  updateAmenity,
} from "../api/amenities-api";
import { AmenityInput } from "../types/amenity";

export function useAmenities(privateId?: string, enabled = true) {
  return useQuery({
    queryKey: ["amenities", privateId],
    queryFn: () => getAmenities(privateId ?? ""),
    enabled: enabled && Boolean(privateId),
  });
}

export function useCreateAmenity(privateId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AmenityInput) => {
      if (!privateId) throw new Error("Selecciona una privada");
      return createAmenity(privateId, payload);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["amenities", privateId] }),
  });
}

export function useUpdateAmenity(privateId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ amenityId, payload }: { amenityId: string; payload: Partial<AmenityInput> }) => {
      if (!privateId) throw new Error("Selecciona una privada");
      return updateAmenity(privateId, amenityId, payload);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["amenities", privateId] }),
  });
}

export function useDeleteAmenity(privateId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (amenityId: string) => {
      if (!privateId) throw new Error("Selecciona una privada");
      return deleteAmenity(privateId, amenityId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["amenities", privateId] });
      await queryClient.invalidateQueries({ queryKey: ["reservas"] });
    },
  });
}
