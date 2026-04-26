import { apiClient } from "@/lib/api/client";
import { Amenity, AmenityInput } from "../types/amenity";

export async function getAmenities(privateId: string) {
  if (!privateId) return [];
  const { data } = await apiClient.get<Amenity[]>(
    `/privadas/${privateId}/amenities`,
  );
  return data;
}

export async function createAmenity(privateId: string, payload: AmenityInput) {
  const { data } = await apiClient.post<Amenity>(
    `/privadas/${privateId}/amenities`,
    payload,
  );
  return data;
}

export async function updateAmenity(
  privateId: string,
  amenityId: string,
  payload: Partial<AmenityInput>,
) {
  const { data } = await apiClient.patch<Amenity>(
    `/privadas/${privateId}/amenities/${amenityId}`,
    payload,
  );
  return data;
}

export async function deleteAmenity(privateId: string, amenityId: string) {
  const { data } = await apiClient.delete<{ ok: boolean }>(
    `/privadas/${privateId}/amenities/${amenityId}`,
  );
  return data;
}
