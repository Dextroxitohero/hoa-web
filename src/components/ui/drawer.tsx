"use client";

import { PropsWithChildren } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DrawerProps = PropsWithChildren<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  side?: "right" | "left";
}>;

export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  side = "right",
  children,
}: DrawerProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Cerrar drawer"
        onClick={() => onOpenChange(false)}
      />

      <aside
        className={cn(
          "absolute top-0 h-full w-full max-w-md bg-background shadow-xl sm:w-[420px]",
          side === "right" ? "right-0" : "left-0",
        )}
      >
        <header className="flex items-start justify-between gap-3 border-b p-4">
          <div>
            <h2 className="text-base font-semibold">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onOpenChange(false)}
            aria-label="Cerrar"
          >
            <XMarkIcon className="size-4" />
          </Button>
        </header>
        <div className="h-[calc(100%-73px)] overflow-y-auto p-4">{children}</div>
      </aside>
    </div>
  );
}
