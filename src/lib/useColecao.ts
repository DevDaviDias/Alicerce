"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { escutarColecao } from "./firestoreService";

export function useColecao<T>(colecao: string, campoOrdenacao = "data") {
  const { usuario } = useAuth();
  const [itens, setItens] = useState<(T & { id: string })[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!usuario) return;
    setCarregando(true);
    const unsub = escutarColecao<T>(
      usuario.uid,
      colecao,
      (dados) => {
        setItens(dados);
        setCarregando(false);
      },
      campoOrdenacao
    );
    return () => unsub();
  }, [usuario, colecao, campoOrdenacao]);

  return { itens, carregando, uid: usuario?.uid };
}
