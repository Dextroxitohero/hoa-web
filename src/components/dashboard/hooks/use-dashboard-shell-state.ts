"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { usePrivadas } from "@/modules/privadas/hooks/use-privadas";
import { useLogout, useMe } from "@/modules/usuarios-acceso/hooks/use-auth";

const SUPERADMIN_PRIVATE_SESSION_KEY = "dashboard:superadmin:active-private-id";
let superadminActivePrivateMemory: string | undefined;

export function useDashboardShellState() {
  const router = useRouter();
  const meQuery = useMe();
  const logoutMutation = useLogout();
  const isAuthenticated = Boolean(meQuery.data);
  const isSuperadmin = meQuery.data?.roles?.includes("SUPERADMIN") ?? false;
  const [selectedPrivateId, setSelectedPrivateId] = useState<string | undefined>(
    superadminActivePrivateMemory,
  );
  const [, startTransition] = useTransition();
  const privadasQuery = usePrivadas(isAuthenticated);
  const privadas = privadasQuery.data ?? [];
  const privateIds = useMemo(() => new Set(privadas.map((item) => item.id)), [privadas]);

  useEffect(() => {
    if (superadminActivePrivateMemory) return;
    if (typeof window === "undefined") return;
    const stored = window.sessionStorage.getItem(SUPERADMIN_PRIVATE_SESSION_KEY) ?? undefined;
    if (!stored) return;
    superadminActivePrivateMemory = stored;
    setSelectedPrivateId(stored);
  }, []);

  useEffect(() => {
    if (!isSuperadmin) return;
    if (privadas.length === 0) return;
    if (!selectedPrivateId || !privateIds.has(selectedPrivateId)) {
      const nextPrivateId = privadas[0]?.id;
      superadminActivePrivateMemory = nextPrivateId;
      setSelectedPrivateId(nextPrivateId);
      if (typeof window !== "undefined" && nextPrivateId) {
        window.sessionStorage.setItem(SUPERADMIN_PRIVATE_SESSION_KEY, nextPrivateId);
      }
    }
  }, [isSuperadmin, privadas, privateIds, selectedPrivateId]);

  const activePrivateId = isSuperadmin
    ? selectedPrivateId && privateIds.has(selectedPrivateId)
      ? selectedPrivateId
      : privadas[0]?.id
    : meQuery.data?.tenantId ?? privadas[0]?.id;

  const onPrivateChange = useCallback(
    (nextPrivateId: string) => {
      if (!isSuperadmin) return;
      if (!nextPrivateId || nextPrivateId === selectedPrivateId) return;
      if (!privateIds.has(nextPrivateId)) return;
      superadminActivePrivateMemory = nextPrivateId;
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(SUPERADMIN_PRIVATE_SESSION_KEY, nextPrivateId);
      }
      startTransition(() => {
        setSelectedPrivateId(nextPrivateId);
      });
    },
    [isSuperadmin, privateIds, selectedPrivateId],
  );

  useEffect(() => {
    if (!meQuery.isLoading && !meQuery.data) {
      router.replace("/login");
    }
  }, [meQuery.isLoading, meQuery.data, router]);

  return {
    meQuery,
    logoutMutation,
    isAuthenticated,
    isSuperadmin,
    privadas,
    activePrivateId,
    onPrivateChange,
  };
}
