import { apiClient } from "@/lib/api/client";
import {
  AuthUser,
  BootstrapSuperadminInput,
  LoginInput,
  SignupInput,
} from "../types/auth";

type AuthResponse = {
  user: AuthUser;
};

export async function me() {
  const { data } = await apiClient.get<AuthResponse>("/auth/me");
  return data.user;
}

export async function login(payload: LoginInput) {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
  return data.user;
}

export async function signup(payload: SignupInput) {
  const { data } = await apiClient.post<AuthResponse>("/auth/signup", payload);
  return data.user;
}

export async function logout() {
  await apiClient.post("/auth/logout");
}

export async function bootstrapStatus() {
  const { data } = await apiClient.get<{ requiresBootstrap: boolean }>(
    "/auth/bootstrap-status",
  );
  return data;
}

export async function bootstrapSuperadmin(payload: BootstrapSuperadminInput) {
  const { data } = await apiClient.post<AuthResponse>(
    "/auth/bootstrap-superadmin",
    payload,
  );
  return data.user;
}
