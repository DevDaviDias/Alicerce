"use client";

import { useState, FormEvent } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, PageHeader } from "@/components/ui/Card";
import { useColecao } from "@/lib/useColecao";
import { criarDocumento, removerDocumento } from "@/lib/firestoreService";
import { Transacao } from "@/types";

export default function FinancasPage() {
  const { itens: transacoes, uid } = useColecao<Transacao>("transacoes");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState<Transacao["tipo"]>("despesa");
  const [categoria, setCategoria] = useState("Geral");

  const saldo = transacoes.reduce(
    (soma, t) => soma + (t.tipo === "receita" ? t.valor : -t.valor),
    0
  );

  async function handleAdicionar(e: FormEvent) {
    e.preventDefault();
    if (!uid || !descricao.trim() || !valor) return;

    await criarDocumento<Transacao>(uid, "transacoes", {
      id: "",
      descricao,
      valor: Number(valor),
      tipo,
      categoria,
      data: new Date().toISOString(),
    });

    setDescricao("");
    setValor("");
  }

  return (
    <AppShell>
      <PageHeader
        titulo="Finanças"
        descricao="Lance receitas e despesas para acompanhar o saldo."
      />

      <Card className="mb-8">
        <p className="text-xs text-muted mb-1">Saldo total</p>
        <p
          className={`font-display text-3xl ${
            saldo >= 0 ? "text-moss-light" : "text-red-400"
          }`}
        >
          {saldo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </p>
      </Card>

      <Card className="mb-8">
        <form onSubmit={handleAdicionar} className="flex flex-wrap gap-3">
          <input
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição (ex: Mercado)"
            className="flex-1 min-w-[180px] bg-surface2 border border-border rounded-md px-3 py-2 text-sm placeholder:text-muted"
          />
          <input
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            type="number"
            step="0.01"
            placeholder="Valor"
            className="w-28 bg-surface2 border border-border rounded-md px-3 py-2 text-sm placeholder:text-muted"
          />
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as Transacao["tipo"])}
            className="bg-surface2 border border-border rounded-md px-3 py-2 text-sm"
          >
            <option value="despesa">Despesa</option>
            <option value="receita">Receita</option>
          </select>
          <input
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            placeholder="Categoria"
            className="w-32 bg-surface2 border border-border rounded-md px-3 py-2 text-sm placeholder:text-muted"
          />
          <button
            type="submit"
            className="bg-moss hover:bg-moss-light transition-colors rounded-md px-4 py-2 text-sm font-medium"
          >
            Lançar
          </button>
        </form>
      </Card>

      <div className="flex flex-col gap-3">
        {transacoes.length === 0 && (
          <p className="text-sm text-muted">Nenhum lançamento ainda.</p>
        )}
        {transacoes.map((t) => (
          <Card key={t.id} className="flex items-center justify-between">
            <div>
              <p className="text-sm">{t.descricao}</p>
              <p className="text-xs text-muted mt-1">{t.categoria}</p>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`text-sm font-medium ${
                  t.tipo === "receita" ? "text-moss-light" : "text-red-400"
                }`}
              >
                {t.tipo === "receita" ? "+" : "-"}
                {t.valor.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
              <button
                onClick={() => uid && removerDocumento(uid, "transacoes", t.id)}
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
