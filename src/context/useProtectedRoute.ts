"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

/**
 * Redireciona para /login se não houver usuário autenticado.
 * Usar dentro de qualquer página de /dashboard, /treino, etc.
 */
export function useProtectedRoute() {
  const { usuario, carregando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!carregando && !usuario) {
      router.replace("/login");
    }
  }, [usuario, carregando, router]);

  return { usuario, carregando };
}
