import { apiClient } from "@/lib/api/client";
import {
  CreatePrivateCommunityInput,
  PrivateCommunitySummary,
} from "../types/private-community";

export async function getPrivadas() {
  const { data } = await apiClient.get<PrivateCommunitySummary[]>("/privadas");
  return data;
}

export async function createPrivada(payload: CreatePrivateCommunityInput) {
  const { data } = await apiClient.post<PrivateCommunitySummary>(
    "/privadas",
    payload,
  );
  return data;
}

export async function updatePrivada(
  id: string,
  payload: Partial<CreatePrivateCommunityInput>,
) {
  const { data } = await apiClient.patch<PrivateCommunitySummary>(
    `/privadas/${id}`,
    payload,
  );
  return data;
}

export async function deletePrivada(id: string) {
  const { data } = await apiClient.delete<{ ok: boolean }>(`/privadas/${id}`);
  return data;
}
