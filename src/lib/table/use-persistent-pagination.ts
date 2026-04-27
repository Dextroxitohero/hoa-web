"use client";

import { useEffect, useState } from "react";
import { PaginationState } from "@tanstack/react-table";

const DEFAULT_PAGE_SIZE = 10;

type PersistentPaginationOptions = {
  storageKey: string;
  userId?: string | null;
  initialPageSize?: number;
};

export function usePersistentPagination(
  options: PersistentPaginationOptions,
) {
  const {
    storageKey,
    userId,
    initialPageSize = DEFAULT_PAGE_SIZE,
  } = options;
  const perUserStorageKey = `${storageKey}:${userId ?? "anon"}`;
  const [pagination, setPagination] = useState<PaginationState>(() => {
    if (typeof window === "undefined") {
      return {
        pageIndex: 0,
        pageSize: initialPageSize,
      };
    }

    try {
      const raw = window.localStorage.getItem(perUserStorageKey);
      if (!raw) {
        return {
          pageIndex: 0,
          pageSize: initialPageSize,
        };
      }

      const parsed = JSON.parse(raw) as PaginationState;
      if (
        typeof parsed?.pageIndex === "number" &&
        parsed.pageIndex >= 0 &&
        typeof parsed?.pageSize === "number" &&
        parsed.pageSize > 0
      ) {
        return parsed;
      }
    } catch {
      // Ignore malformed localStorage values.
    }

    return {
      pageIndex: 0,
      pageSize: initialPageSize,
    };
  });

  useEffect(() => {
    window.localStorage.setItem(perUserStorageKey, JSON.stringify(pagination));
  }, [pagination, perUserStorageKey]);

  return { pagination, setPagination };
}
