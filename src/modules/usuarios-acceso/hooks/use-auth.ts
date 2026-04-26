import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  bootstrapStatus,
  bootstrapSuperadmin,
  login,
  logout,
  me,
  signup,
} from "../api/auth-api";
import {
  BootstrapSuperadminInput,
  LoginInput,
  SignupInput,
} from "../types/auth";

function isUnauthorized(error: unknown) {
  return error instanceof AxiosError && error.response?.status === 401;
}

export function useMe() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: me,
    retry: (failureCount, error) => {
      if (isUnauthorized(error)) {
        return false;
      }
      return failureCount < 1;
    },
  });
}

export function useBootstrapStatus() {
  return useQuery({
    queryKey: ["auth", "bootstrap-status"],
    queryFn: bootstrapStatus,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginInput) => login(payload),
    onSuccess: async (user) => {
      queryClient.setQueryData(["auth", "me"], user);
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}

export function useSignup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SignupInput) => signup(payload),
    onSuccess: async (user) => {
      queryClient.setQueryData(["auth", "me"], user);
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);
      return queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

export function useBootstrapSuperadmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BootstrapSuperadminInput) =>
      bootstrapSuperadmin(payload),
    onSuccess: async (user) => {
      queryClient.setQueryData(["auth", "me"], user);
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}
