"use client";

import { Button } from "@/components/ui/button";
import { LogOut, Plus } from "lucide-react";

interface DashboardHeaderProps {
  onNewTransaction: () => void;
  onLogout: () => void;
}

export function DashboardHeader({
  onNewTransaction,
  onLogout,
}: DashboardHeaderProps) {
  return (
    <header className="border-b bg-primary-500 pt-10 pb-20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Logo" className="h-7 w-full" />
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={onNewTransaction}
            size="sm"
            className="flex text-primary-50 bg-primary-300"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:flex">{"Nova Transação"}</span>
          </Button>

          <Button
            onClick={onLogout}
            size="sm"
            className="text-red-50 bg-red-500"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
