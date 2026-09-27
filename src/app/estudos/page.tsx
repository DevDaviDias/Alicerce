"use client";

import { useState, FormEvent } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, PageHeader } from "@/components/ui/Card";
import { useColecao } from "@/lib/useColecao";
import { criarDocumento, removerDocumento } from "@/lib/firestoreService";
import { HistoricoEstudo } from "@/types";

export default function EstudosPage() {
  const { itens: sessoes, uid } = useColecao<HistoricoEstudo>(
    "historicoEstudo"
  );
  const [materia, setMateria] = useState("");
  const [minutos, setMinutos] = useState("");

  async function handleAdicionar(e: FormEvent) {
    e.preventDefault();
    if (!uid || !materia.trim() || !minutos) return;

    await criarDocumento<HistoricoEstudo>(uid, "historicoEstudo", {
      id: "",
      materia,
      duracaoSegundos: Number(minutos) * 60,
      data: new Date().toISOString(),
    });

    setMateria("");
    setMinutos("");
  }

  return (
    <AppShell>
      <PageHeader
        titulo="Estudos"
        descricao="Registre cada sessão de estudo por matéria."
      />

      <Card className="mb-8">
        <form onSubmit={handleAdicionar} className="flex flex-wrap gap-3">
          <input
            value={materia}
            onChange={(e) => setMateria(e.target.value)}
            placeholder="Matéria (ex: Edital CREA-MG)"
            className="flex-1 min-w-[200px] bg-surface2 border border-border rounded-md px-3 py-2 text-sm placeholder:text-muted"
          />
          <input
            value={minutos}
            onChange={(e) => setMinutos(e.target.value)}
            type="number"
            placeholder="Minutos"
            className="w-28 bg-surface2 border border-border rounded-md px-3 py-2 text-sm placeholder:text-muted"
          />
          <button
            type="submit"
            className="bg-moss hover:bg-moss-light transition-colors rounded-md px-4 py-2 text-sm font-medium"
          >
            Registrar
          </button>
        </form>
      </Card>

      <div className="flex flex-col gap-3">
        {sessoes.length === 0 && (
          <p className="text-sm text-muted">Nenhuma sessão registrada ainda.</p>
        )}
        {sessoes.map((s) => (
          <Card key={s.id} className="flex items-center justify-between">
            <div>
              <p className="text-sm">{s.materia}</p>
              <p className="text-xs text-muted mt-1">
                {Math.round(s.duracaoSegundos / 60)} min
              </p>
            </div>
            <button
              onClick={() => uid && removerDocumento(uid, "historicoEstudo", s.id)}
              className="text-xs text-muted hover:text-ink transition-colors"
            >
              Remover
            </button>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
