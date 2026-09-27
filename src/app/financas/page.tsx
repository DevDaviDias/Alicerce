"use client";

import { useState, FormEvent } from "react";
import { Trash2, Wallet } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, PageHeader, SectionTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { useColecao } from "@/lib/useColecao";
import { criarDocumento, removerDocumento } from "@/lib/firestoreService";
import { Transacao } from "@/types";

export default function FinancasPage() {
  const { itens: transacoes, uid } = useColecao<Transacao>("transacoes");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState<Transacao["tipo"]>("despesa");
  const [categoria, setCategoria] = useState("Geral");

  const receitas = transacoes
    .filter((t) => t.tipo === "receita")
    .reduce((s, t) => s + t.valor, 0);
  const despesas = transacoes
    .filter((t) => t.tipo === "despesa")
    .reduce((s, t) => s + t.valor, 0);
  const saldo = receitas - despesas;

  const categorias = Array.from(
    new Set(transacoes.filter((t) => t.tipo === "despesa").map((t) => t.categoria))
  )
    .map((cat) => ({
      nome: cat,
      total: transacoes
        .filter((t) => t.tipo === "despesa" && t.categoria === cat)
        .reduce((s, t) => s + t.valor, 0),
    }))
    .sort((a, b) => b.total - a.total);

  const maiorCategoria = Math.max(1, ...categorias.map((c) => c.total));

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

      <div className="grid grid-cols-3 gap-4 mb-10">
        <Card>
          <p className="text-xs text-muted mb-2">Receitas</p>
          <p className="font-display text-xl text-moss-light">
            {receitas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-muted mb-2">Despesas</p>
          <p className="font-display text-xl text-red-400">
            {despesas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-muted mb-2">Saldo</p>
          <p
            className={`font-display text-xl ${
              saldo >= 0 ? "text-moss-light" : "text-red-400"
            }`}
          >
            {saldo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>
        </Card>
      </div>

      <Card className="mb-10">
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

      {categorias.length > 0 && (
        <>
          <SectionTitle>Despesas por categoria</SectionTitle>
          <Card className="mb-10">
            <div className="flex flex-col gap-4">
              {categorias.map((c) => (
                <div key={c.nome}>
                  <div className="flex items-center justify-between mb-1.5 text-sm">
                    <span>{c.nome}</span>
                    <span className="text-muted text-xs">
                      {c.total.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                  <ProgressBar valor={c.total} max={maiorCategoria} cor="bronze" />
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      <SectionTitle>Lançamentos</SectionTitle>
      <div className="flex flex-col gap-3">
        {transacoes.length === 0 && (
          <EmptyState
            icone={Wallet}
            titulo="Nenhum lançamento ainda"
            descricao="Registre sua primeira receita ou despesa acima."
          />
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
                className="text-muted hover:text-ink transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
