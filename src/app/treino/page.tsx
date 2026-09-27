"use client";

import { useState, FormEvent } from "react";
import { Plus, Trash2, ChevronDown, Dumbbell } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, PageHeader, SectionTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { useColecao } from "@/lib/useColecao";
import {
  criarDocumento,
  atualizarDocumento,
  removerDocumento,
} from "@/lib/firestoreService";
import { Treino } from "@/types";

function TreinoCard({
  treino,
  uid,
}: {
  treino: Treino & { id: string };
  uid: string;
}) {
  const [aberto, setAberto] = useState(false);
  const [novoExercicio, setNovoExercicio] = useState("");

  async function alternarConcluido() {
    await atualizarDocumento<Treino>(uid, "treinos", treino.id, {
      concluido: !treino.concluido,
    });
  }

  async function adicionarExercicio(e: FormEvent) {
    e.preventDefault();
    if (!novoExercicio.trim()) return;
    await atualizarDocumento<Treino>(uid, "treinos", treino.id, {
      exercicios: [...treino.exercicios, novoExercicio],
    });
    setNovoExercicio("");
  }

  async function removerExercicio(index: number) {
    const restantes = treino.exercicios.filter((_, i) => i !== index);
    await atualizarDocumento<Treino>(uid, "treinos", treino.id, {
      exercicios: restantes,
    });
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setAberto((a) => !a)}
          className="flex items-center gap-3 flex-1 text-left min-w-0"
        >
          <ChevronDown
            size={15}
            className={`text-muted shrink-0 transition-transform ${
              aberto ? "rotate-180" : ""
            }`}
          />
          <div className="min-w-0">
            <p className={`text-sm ${treino.concluido ? "line-through text-muted" : ""}`}>
              {treino.nome}
            </p>
            <p className="text-xs text-muted mt-0.5">
              {treino.categoria} · {treino.duracao} ·{" "}
              {treino.exercicios.length} exercício
              {treino.exercicios.length !== 1 ? "s" : ""}
            </p>
          </div>
        </button>
        <div className="flex gap-3 shrink-0 ml-3">
          <button
            onClick={alternarConcluido}
            className="text-xs text-moss-light hover:text-moss transition-colors"
          >
            {treino.concluido ? "Reabrir" : "Concluir"}
          </button>
          <button
            onClick={() => removerDocumento(uid, "treinos", treino.id)}
            className="text-muted hover:text-ink transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {aberto && (
        <div className="mt-4 pt-4 border-t border-border">
          {treino.exercicios.length > 0 && (
            <ul className="flex flex-col gap-2 mb-3">
              {treino.exercicios.map((ex, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between text-sm bg-surface2 rounded-md px-3 py-2"
                >
                  {ex}
                  <button
                    onClick={() => removerExercicio(i)}
                    className="text-muted hover:text-ink"
                  >
                    <Trash2 size={13} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={adicionarExercicio} className="flex gap-2">
            <input
              value={novoExercicio}
              onChange={(e) => setNovoExercicio(e.target.value)}
              placeholder="Ex: Supino reto 4x10"
              className="flex-1 bg-surface2 border border-border rounded-md px-3 py-2 text-sm placeholder:text-muted"
            />
            <button
              type="submit"
              className="bg-moss hover:bg-moss-light transition-colors rounded-md px-3 text-sm"
            >
              <Plus size={15} />
            </button>
          </form>
        </div>
      )}
    </Card>
  );
}

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

  const concluidos = treinos.filter((t) => t.concluido).length;

  return (
    <AppShell>
      <PageHeader
        titulo="Treino"
        descricao={
          treinos.length > 0
            ? `${concluidos} de ${treinos.length} treinos concluídos`
            : "Registre o treino do dia e os exercícios de cada um."
        }
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
          <EmptyState
            icone={Dumbbell}
            titulo="Nenhum treino registrado"
            descricao="Adicione o treino do dia no formulário acima."
          />
        )}
        {treinos.map((treino) => (
          <TreinoCard key={treino.id} treino={treino} uid={uid!} />
        ))}
      </div>
    </AppShell>
  );
}
