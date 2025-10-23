"use client";

import { useLoading } from "@/contexts/loading-context";
import { Spinner } from "./ui/spinner";

export function GlobalLoader() {
  const { isLoading } = useLoading();
  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      }}
    >
      <div className="rounded-lg bg-background p-8 shadow-xl border animate-in fade-in duration-200">
        <div className="flex flex-col items-center space-y-4">
          <Spinner className="h-8 w-8 text-primary" />
          <p className="text-base font-medium text-foreground">
            {"Carregando..."}
          </p>
        </div>
      </div>
    </div>
  );
}
