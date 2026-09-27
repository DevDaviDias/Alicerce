"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Trash2, ImagePlus, NotebookPen } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, PageHeader, SectionTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { useColecao } from "@/lib/useColecao";
import { criarDocumento, removerDocumento } from "@/lib/firestoreService";
import { storage } from "@/lib/firebase";
import { EntradaDiario } from "@/types";

const HUMORES = ["😐", "🙂", "😄", "😤", "😞"];

export default function DiarioPage() {
  const { itens: entradas, uid } = useColecao<EntradaDiario>("diario");
  const [texto, setTexto] = useState("");
  const [humor, setHumor] = useState(HUMORES[1]);
  const [destaque, setDestaque] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);

  function handleFoto(e: ChangeEvent<HTMLInputElement>) {
    setFoto(e.target.files?.[0] ?? null);
  }

  async function handleAdicionar(e: FormEvent) {
    e.preventDefault();
    if (!uid || !texto.trim()) return;

    setEnviando(true);
    try {
      let fotoUrl = "";
      if (foto) {
        const caminho = `users/${uid}/diario/${Date.now()}-${foto.name}`;
        const storageRef = ref(storage, caminho);
        await uploadBytes(storageRef, foto);
        fotoUrl = await getDownloadURL(storageRef);
      }

      await criarDocumento<EntradaDiario>(uid, "diario", {
        id: "",
        texto,
        humor,
        destaque,
        fotoUrl,
        data: new Date().toISOString(),
      });

      setTexto("");
      setDestaque("");
      setFoto(null);
    } finally {
      setEnviando(false);
    }
  }

  const ultimosHumores = [...entradas]
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    .slice(-7);

  return (
    <AppShell>
      <PageHeader
        titulo="Diário"
        descricao="Um espaço rápido para registrar o dia."
      />

      {ultimosHumores.length > 0 && (
        <Card className="mb-8 flex items-center justify-between">
          {ultimosHumores.map((e, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <span className="text-xl">{e.humor}</span>
              <span className="text-[10px] text-muted">
                {new Date(e.data).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                })}
              </span>
            </div>
          ))}
        </Card>
      )}

      <Card className="mb-10">
        <form onSubmit={handleAdicionar} className="flex flex-col gap-3">
          <div className="flex gap-2">
            {HUMORES.map((h) => (
              <button
                type="button"
                key={h}
                onClick={() => setHumor(h)}
                className={`text-xl w-10 h-10 rounded-md flex items-center justify-center border transition-colors ${
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

          <label className="flex items-center gap-2 text-xs text-muted cursor-pointer w-fit">
            <ImagePlus size={15} />
            {foto ? foto.name : "Adicionar uma foto (opcional)"}
            <input type="file" accept="image/*" onChange={handleFoto} className="hidden" />
          </label>

          <button
            type="submit"
            disabled={enviando}
            className="self-start bg-moss hover:bg-moss-light transition-colors rounded-md px-4 py-2 text-sm font-medium disabled:opacity-60"
          >
            {enviando ? "Salvando..." : "Salvar entrada"}
          </button>
        </form>
      </Card>

      <SectionTitle>Entradas</SectionTitle>
      <div className="flex flex-col gap-3">
        {entradas.length === 0 && (
          <EmptyState
            icone={NotebookPen}
            titulo="Nenhuma entrada ainda"
            descricao="Registre o primeiro dia usando o formulário acima."
          />
        )}
        {entradas.map((e) => (
          <Card key={e.id}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4 min-w-0">
                {e.fotoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={e.fotoUrl}
                    alt=""
                    className="w-16 h-16 rounded-md object-cover shrink-0 border border-border"
                  />
                )}
                <div className="min-w-0">
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
              </div>
              <button
                onClick={() => uid && removerDocumento(uid, "diario", e.id)}
                className="text-muted hover:text-ink transition-colors shrink-0"
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
