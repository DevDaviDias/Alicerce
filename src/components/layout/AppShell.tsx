"use client";

import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { MobileHeader } from "./MobileHeader";
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
    <div className="md:flex">
      <Sidebar />
      <MobileHeader />
      <div className="flex-1 px-5 py-6 pb-24 md:px-12 md:py-10 md:pb-10 max-w-5xl">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
