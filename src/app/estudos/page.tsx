"use client";

import { useState, FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, PageHeader, SectionTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { PomodoroTimer } from "@/components/ui/PomodoroTimer";
import { useColecao } from "@/lib/useColecao";
import { criarDocumento, removerDocumento } from "@/lib/firestoreService";
import { HistoricoEstudo, Materia } from "@/types";
import { BookOpen } from "lucide-react";

export default function EstudosPage() {
  const { itens: sessoes, uid } = useColecao<HistoricoEstudo>("historicoEstudo");
  const { itens: materias } = useColecao<Materia>("materias", "nome");

  const [materiaSelecionada, setMateriaSelecionada] = useState("");
  const [novaMateria, setNovaMateria] = useState("");
  const [metaHoras, setMetaHoras] = useState("10");
  const [manualMateria, setManualMateria] = useState("");
  const [minutos, setMinutos] = useState("");

  const materiaAtiva = materiaSelecionada || materias[0]?.nome || "";

  function horasEstudadas(nomeMateria: string) {
    const segundos = sessoes
      .filter((s) => s.materia === nomeMateria)
      .reduce((soma, s) => soma + s.duracaoSegundos, 0);
    return Math.round((segundos / 3600) * 10) / 10;
  }

  async function handleCicloPomodoro(segundosFoco: number) {
    if (!uid || !materiaAtiva) return;
    await criarDocumento<HistoricoEstudo>(uid, "historicoEstudo", {
      id: "",
      materia: materiaAtiva,
      duracaoSegundos: segundosFoco,
      comentario: "Ciclo pomodoro",
      data: new Date().toISOString(),
    });
  }

  async function handleAdicionarMateria(e: FormEvent) {
    e.preventDefault();
    if (!uid || !novaMateria.trim()) return;
    await criarDocumento<Materia>(uid, "materias", {
      id: "",
      nome: novaMateria,
      metaHoras: Number(metaHoras) || 10,
      horasEstudadas: 0,
    });
    setNovaMateria("");
  }

  async function handleAdicionarSessaoManual(e: FormEvent) {
    e.preventDefault();
    if (!uid || !manualMateria.trim() || !minutos) return;
    await criarDocumento<HistoricoEstudo>(uid, "historicoEstudo", {
      id: "",
      materia: manualMateria,
      duracaoSegundos: Number(minutos) * 60,
      data: new Date().toISOString(),
    });
    setManualMateria("");
    setMinutos("");
  }

  return (
    <AppShell>
      <PageHeader
        titulo="Estudos"
        descricao="Use o pomodoro pra focar, ou registre sessões manualmente."
      />

      <div className="grid md:grid-cols-[1fr_1.2fr] gap-8 mb-12">
        <Card>
          {materias.length > 0 && (
            <select
              value={materiaAtiva}
              onChange={(e) => setMateriaSelecionada(e.target.value)}
              className="w-full mb-2 bg-surface2 border border-border rounded-md px-3 py-2 text-sm"
            >
              {materias.map((m) => (
                <option key={m.id} value={m.nome}>
                  {m.nome}
                </option>
              ))}
            </select>
          )}
          <PomodoroTimer onCicloConcluido={handleCicloPomodoro} />
        </Card>

        <div>
          <SectionTitle>Metas por matéria</SectionTitle>
          <Card className="mb-4">
            <form onSubmit={handleAdicionarMateria} className="flex gap-2">
              <input
                value={novaMateria}
                onChange={(e) => setNovaMateria(e.target.value)}
                placeholder="Nova matéria"
                className="flex-1 bg-surface2 border border-border rounded-md px-3 py-2 text-sm placeholder:text-muted"
              />
              <input
                value={metaHoras}
                onChange={(e) => setMetaHoras(e.target.value)}
                type="number"
                title="Meta em horas"
                className="w-20 bg-surface2 border border-border rounded-md px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="bg-moss hover:bg-moss-light transition-colors rounded-md px-3 text-sm"
              >
                <Plus size={16} />
              </button>
            </form>
          </Card>

          <div className="flex flex-col gap-3">
            {materias.length === 0 && (
              <EmptyState
                icone={BookOpen}
                titulo="Nenhuma matéria cadastrada"
                descricao="Adicione uma matéria acima pra acompanhar horas e meta."
              />
            )}
            {materias.map((m) => {
              const horas = horasEstudadas(m.nome);
              return (
                <Card key={m.id}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm">{m.nome}</p>
                    <p className="text-xs text-muted">
                      {horas}h / {m.metaHoras}h
                    </p>
                  </div>
                  <ProgressBar valor={horas} max={m.metaHoras} />
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <SectionTitle>Registrar sessão manual</SectionTitle>
      <Card className="mb-8">
        <form onSubmit={handleAdicionarSessaoManual} className="flex flex-wrap gap-3">
          <input
            value={manualMateria}
            onChange={(e) => setManualMateria(e.target.value)}
            placeholder="Matéria"
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

      <SectionTitle>Histórico</SectionTitle>
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
                {s.comentario ? ` · ${s.comentario}` : ""}
              </p>
            </div>
            <button
              onClick={() => uid && removerDocumento(uid, "historicoEstudo", s.id)}
              className="text-muted hover:text-ink transition-colors"
            >
              <Trash2 size={15} />
            </button>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
