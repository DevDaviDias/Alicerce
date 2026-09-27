"use client";

import { useState, FormEvent } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, PageHeader } from "@/components/ui/Card";
import { useColecao } from "@/lib/useColecao";
import {
  criarDocumento,
  atualizarDocumento,
  removerDocumento,
} from "@/lib/firestoreService";
import { Treino } from "@/types";

export default function TreinoPage() {
  const { itens: treinos, uid } = useColecao<Treino>("treinos");
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("Força");
  const [duracao, setDuracao] = useState("45 min");

  async function handleAdicionar(e: FormEvent) {
    e.preventDefault();
    if (!uid || !nome.trim()) return;

    await criarDocumento<Treino>(uid, "treinos", {
      id: "",
      nome,
      categoria,
      duracao,
      exercicios: [],
      concluido: false,
      data: new Date().toISOString(),
    });

    setNome("");
  }

  async function alternarConcluido(treino: Treino & { id: string }) {
    if (!uid) return;
    await atualizarDocumento<Treino>(uid, "treinos", treino.id, {
      concluido: !treino.concluido,
    });
  }

  async function remover(id: string) {
    if (!uid) return;
    await removerDocumento(uid, "treinos", id);
  }

  return (
    <AppShell>
      <PageHeader
        titulo="Treino"
        descricao="Registre o treino do dia e marque como concluído."
      />

      <Card className="mb-8">
        <form onSubmit={handleAdicionar} className="flex flex-wrap gap-3">
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome do treino (ex: Peito e tríceps)"
            className="flex-1 min-w-[200px] bg-surface2 border border-border rounded-md px-3 py-2 text-sm placeholder:text-muted"
          />
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="bg-surface2 border border-border rounded-md px-3 py-2 text-sm"
          >
            <option>Força</option>
            <option>Cardio</option>
            <option>Mobilidade</option>
          </select>
          <input
            value={duracao}
            onChange={(e) => setDuracao(e.target.value)}
            className="w-24 bg-surface2 border border-border rounded-md px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="bg-moss hover:bg-moss-light transition-colors rounded-md px-4 py-2 text-sm font-medium"
          >
            Adicionar
          </button>
        </form>
      </Card>

      <div className="flex flex-col gap-3">
        {treinos.length === 0 && (
          <p className="text-sm text-muted">
            Nenhum treino registrado ainda.
          </p>
        )}
        {treinos.map((treino) => (
          <Card key={treino.id} className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm ${
                  treino.concluido ? "line-through text-muted" : ""
                }`}
              >
                {treino.nome}
              </p>
              <p className="text-xs text-muted mt-1">
                {treino.categoria} · {treino.duracao}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => alternarConcluido(treino)}
                className="text-xs text-moss-light hover:text-moss transition-colors"
              >
                {treino.concluido ? "Reabrir" : "Concluir"}
              </button>
              <button
                onClick={() => remover(treino.id)}
                className="text-xs text-muted hover:text-ink transition-colors"
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
