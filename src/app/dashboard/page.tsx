"use client";

import { AppShell } from "@/components/layout/AppShell";
import { Card, PageHeader } from "@/components/ui/Card";
import { useColecao } from "@/lib/useColecao";
import { Treino, Transacao, HistoricoEstudo, Habito } from "@/types";

export default function DashboardPage() {
  const { itens: treinos } = useColecao<Treino>("treinos");
  const { itens: transacoes } = useColecao<Transacao>("transacoes");
  const { itens: estudos } = useColecao<HistoricoEstudo>("historicoEstudo");
  const { itens: habitos } = useColecao<Habito>("habitos");

  const treinosSemana = treinos.filter((t) => t.concluido).length;

  const saldoMes = transacoes.reduce(
    (soma, t) => soma + (t.tipo === "receita" ? t.valor : -t.valor),
    0
  );

  const horasEstudadas = Math.round(
    estudos.reduce((soma, e) => soma + e.duracaoSegundos, 0) / 3600
  );

  const maiorSequencia = habitos.reduce(
    (max, h) => Math.max(max, h.streak),
    0
  );

  return (
    <AppShell>
      <PageHeader
        titulo="Painel"
        descricao="Um retrato rápido dos seus quatro pilares."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Card>
          <p className="text-xs text-muted mb-2">Treinos concluídos</p>
          <p className="font-display text-2xl">{treinosSemana}</p>
        </Card>
        <Card>
          <p className="text-xs text-muted mb-2">Saldo registrado</p>
          <p className="font-display text-2xl">
            {saldoMes >= 0 ? "+" : ""}
            {saldoMes.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-muted mb-2">Horas de estudo</p>
          <p className="font-display text-2xl">{horasEstudadas}h</p>
        </Card>
        <Card>
          <p className="text-xs text-muted mb-2">Maior sequência</p>
          <p className="font-display text-2xl">{maiorSequencia} dias</p>
        </Card>
      </div>

      <Card>
        <p className="text-sm text-muted leading-relaxed">
          Os números acima vêm direto do Firestore, em tempo real. Assim que
          você registrar um treino, um gasto ou uma sessão de estudo nas
          páginas ao lado, este painel atualiza sozinho.
        </p>
      </Card>
    </AppShell>
  );
}
