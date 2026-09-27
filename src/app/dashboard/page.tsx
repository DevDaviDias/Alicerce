"use client";

import { Dumbbell, Wallet, BookOpen, Flame } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, PageHeader, StatCard, SectionTitle } from "@/components/ui/Card";
import { useColecao } from "@/lib/useColecao";
import { Treino, Transacao, HistoricoEstudo, EntradaDiario, Habito } from "@/types";

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function inicioDaSemana() {
  const hoje = new Date();
  const diff = hoje.getDate() - hoje.getDay();
  const inicio = new Date(hoje.setDate(diff));
  inicio.setHours(0, 0, 0, 0);
  return inicio;
}

export default function DashboardPage() {
  const { itens: treinos } = useColecao<Treino>("treinos");
  const { itens: transacoes } = useColecao<Transacao>("transacoes");
  const { itens: estudos } = useColecao<HistoricoEstudo>("historicoEstudo");
  const { itens: habitos } = useColecao<Habito>("habitos");
  const { itens: diario } = useColecao<EntradaDiario>("diario");

  const treinosSemana = treinos.filter((t) => t.concluido).length;

  const saldoMes = transacoes.reduce(
    (soma, t) => soma + (t.tipo === "receita" ? t.valor : -t.valor),
    0
  );

  const horasEstudadas =
    Math.round(
      (estudos.reduce((soma, e) => soma + e.duracaoSegundos, 0) / 3600) * 10
    ) / 10;

  const maiorSequencia = habitos.reduce((max, h) => Math.max(max, h.streak), 0);

  // treinos concluídos por dia da semana atual, pra montar o mini gráfico
  const inicio = inicioDaSemana();
  const treinosPorDia = DIAS_SEMANA.map((_, index) => {
    const diaAlvo = new Date(inicio);
    diaAlvo.setDate(inicio.getDate() + index);
    return treinos.filter((t) => {
      const d = new Date(t.data);
      return (
        t.concluido &&
        d.getFullYear() === diaAlvo.getFullYear() &&
        d.getMonth() === diaAlvo.getMonth() &&
        d.getDate() === diaAlvo.getDate()
      );
    }).length;
  });
  const maxBarra = Math.max(1, ...treinosPorDia);

  // últimos eventos combinados, das quatro áreas, ordenados por data
  const atividades = [
    ...treinos.map((t) => ({
      tipo: "Treino",
      texto: t.nome,
      data: t.data,
      icone: Dumbbell,
    })),
    ...transacoes.map((t) => ({
      tipo: "Finanças",
      texto: t.descricao,
      data: t.data,
      icone: Wallet,
    })),
    ...estudos.map((e) => ({
      tipo: "Estudos",
      texto: e.materia,
      data: e.data,
      icone: BookOpen,
    })),
    ...diario.map((d) => ({
      tipo: "Diário",
      texto: d.destaque || d.texto,
      data: d.data,
      icone: Flame,
    })),
  ]
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 6);

  return (
    <AppShell>
      <PageHeader
        titulo="Painel"
        descricao="Um retrato rápido dos seus quatro pilares."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <StatCard
          icone={Dumbbell}
          label="Treinos concluídos"
          valor={String(treinosSemana)}
        />
        <StatCard
          icone={Wallet}
          label="Saldo registrado"
          tone={saldoMes >= 0 ? "positive" : "negative"}
          valor={saldoMes.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        />
        <StatCard
          icone={BookOpen}
          label="Horas de estudo"
          valor={`${horasEstudadas}h`}
        />
        <StatCard
          icone={Flame}
          label="Maior sequência"
          valor={`${maiorSequencia} dias`}
        />
      </div>

      <div className="grid md:grid-cols-[1.3fr_1fr] gap-8">
        <div>
          <SectionTitle>Treinos nesta semana</SectionTitle>
          <Card>
            <div className="flex items-end justify-between h-32 gap-3">
              {treinosPorDia.map((qtd, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex-1 flex items-end">
                    <div
                      className="w-full rounded-t-sm bg-moss transition-all duration-500"
                      style={{
                        height: `${(qtd / maxBarra) * 100}%`,
                        minHeight: qtd > 0 ? "6px" : "2px",
                        opacity: qtd > 0 ? 1 : 0.25,
                      }}
                    />
                  </div>
                  <span className="text-[11px] text-muted">
                    {DIAS_SEMANA[i]}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <SectionTitle>Atividade recente</SectionTitle>
          <Card className="p-0">
            {atividades.length === 0 && (
              <p className="text-sm text-muted p-6">
                Nada registrado ainda. Comece por qualquer um dos pilares ao
                lado.
              </p>
            )}
            <ul className="divide-y divide-border">
              {atividades.map((a, i) => {
                const Icone = a.icone;
                return (
                  <li key={i} className="flex items-center gap-3 px-5 py-3.5">
                    <div className="w-7 h-7 rounded-md bg-surface2 flex items-center justify-center shrink-0">
                      <Icone size={13} className="text-bronze-light" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm truncate">{a.texto}</p>
                      <p className="text-xs text-muted">{a.tipo}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
