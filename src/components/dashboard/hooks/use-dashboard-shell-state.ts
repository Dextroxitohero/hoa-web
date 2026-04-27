"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { usePrivadas } from "@/modules/privadas/hooks/use-privadas";
import { useLogout, useMe } from "@/modules/usuarios-acceso/hooks/use-auth";

export function useDashboardShellState() {
  const router = useRouter();
  const meQuery = useMe();
  const logoutMutation = useLogout();
  const isAuthenticated = Boolean(meQuery.data);
  const isSuperadmin = meQuery.data?.roles?.includes("SUPERADMIN") ?? false;
  const [selectedPrivateId, setSelectedPrivateId] = useState<string>();
  const [, startTransition] = useTransition();
  const privadasQuery = usePrivadas(isAuthenticated);
  const privadas = privadasQuery.data ?? [];
  const privateIds = useMemo(() => new Set(privadas.map((item) => item.id)), [privadas]);

  useEffect(() => {
    if (!isSuperadmin) return;
    if (privadas.length === 0) return;
    if (!selectedPrivateId || !privateIds.has(selectedPrivateId)) {
      setSelectedPrivateId(privadas[0]?.id);
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
