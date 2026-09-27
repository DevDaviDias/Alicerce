"use client";

import { useState, FormEvent } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, PageHeader } from "@/components/ui/Card";
import { useColecao } from "@/lib/useColecao";
import { criarDocumento, removerDocumento } from "@/lib/firestoreService";
import { EntradaDiario } from "@/types";

const HUMORES = ["😐", "🙂", "😄", "😤", "😞"];

export default function DiarioPage() {
  const { itens: entradas, uid } = useColecao<EntradaDiario>("diario");
  const [texto, setTexto] = useState("");
  const [humor, setHumor] = useState(HUMORES[1]);
  const [destaque, setDestaque] = useState("");

  async function handleAdicionar(e: FormEvent) {
    e.preventDefault();
    if (!uid || !texto.trim()) return;

    await criarDocumento<EntradaDiario>(uid, "diario", {
      id: "",
      texto,
      humor,
      destaque,
      data: new Date().toISOString(),
    });

    setTexto("");
    setDestaque("");
  }

  return (
    <AppShell>
      <PageHeader
        titulo="Diário"
        descricao="Um espaço rápido para registrar o dia."
      />

      <Card className="mb-8">
        <form onSubmit={handleAdicionar} className="flex flex-col gap-3">
          <div className="flex gap-2">
            {HUMORES.map((h) => (
              <button
                type="button"
                key={h}
                onClick={() => setHumor(h)}
                className={`text-xl w-10 h-10 rounded-md flex items-center justify-center border ${
                  humor === h ? "border-moss bg-surface2" : "border-border"
                }`}
              >
                {h}
              </button>
            ))}
          </div>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Como foi o dia?"
            rows={3}
            className="bg-surface2 border border-border rounded-md px-3 py-2 text-sm placeholder:text-muted resize-none"
          />
          <input
            value={destaque}
            onChange={(e) => setDestaque(e.target.value)}
            placeholder="Um destaque do dia (opcional)"
            className="bg-surface2 border border-border rounded-md px-3 py-2 text-sm placeholder:text-muted"
          />
          <button
            type="submit"
            className="self-start bg-moss hover:bg-moss-light transition-colors rounded-md px-4 py-2 text-sm font-medium"
          >
            Salvar entrada
          </button>
        </form>
      </Card>

      <div className="flex flex-col gap-3">
        {entradas.length === 0 && (
          <p className="text-sm text-muted">Nenhuma entrada ainda.</p>
        )}
        {entradas.map((e) => (
          <Card key={e.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm mb-1">
                  {e.humor} {e.texto}
                </p>
                {e.destaque && (
                  <p className="text-xs text-bronze-light">★ {e.destaque}</p>
                )}
                <p className="text-xs text-muted mt-2">
                  {new Date(e.data).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <button
                onClick={() => uid && removerDocumento(uid, "diario", e.id)}
                className="text-xs text-muted hover:text-ink transition-colors shrink-0"
              >
                Remover
              </button>
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
