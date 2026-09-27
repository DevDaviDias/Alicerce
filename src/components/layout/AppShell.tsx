"use client";

import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useProtectedRoute } from "@/context/useProtectedRoute";

export function AppShell({ children }: { children: ReactNode }) {
  const { usuario, carregando } = useProtectedRoute();

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted text-sm">
        Carregando...
      </div>
    );
  }

  if (!usuario) return null; // useProtectedRoute já está redirecionando

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 px-10 py-8 max-w-4xl">{children}</div>
    </div>
  );
}
