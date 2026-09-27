"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Dumbbell, Wallet, BookOpen, NotebookPen, Camera } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, PageHeader, StatCard } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { useColecao } from "@/lib/useColecao";
import { storage, auth } from "@/lib/firebase";
import { Treino, Transacao, HistoricoEstudo, EntradaDiario } from "@/types";

export default function PerfilPage() {
  const { usuario, sair } = useAuth();
  const router = useRouter();
  const [enviandoFoto, setEnviandoFoto] = useState(false);

  const { itens: treinos } = useColecao<Treino>("treinos");
  const { itens: transacoes } = useColecao<Transacao>("transacoes");
  const { itens: estudos } = useColecao<HistoricoEstudo>("historicoEstudo");
  const { itens: diario } = useColecao<EntradaDiario>("diario");

  async function handleSair() {
    await sair();
    router.push("/");
  }

  async function handleFoto(e: ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo || !usuario) return;

    setEnviandoFoto(true);
    try {
      const caminho = `users/${usuario.uid}/perfil/avatar-${Date.now()}`;
      const storageRef = ref(storage, caminho);
      await uploadBytes(storageRef, arquivo);
      const url = await getDownloadURL(storageRef);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: url });
      }
    } finally {
      setEnviandoFoto(false);
    }
  }

  const iniciais = (usuario?.displayName || usuario?.email || "?")
    .charAt(0)
    .toUpperCase();

  return (
    <AppShell>
      <PageHeader titulo="Perfil" descricao="Seus dados e um resumo geral." />

      <Card className="mb-8 max-w-md flex items-center gap-5">
        <label className="relative cursor-pointer group shrink-0">
          {usuario?.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={usuario.photoURL}
              alt=""
              className="w-16 h-16 rounded-full object-cover border border-border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-moss-dark flex items-center justify-center text-xl font-display">
              {iniciais}
            </div>
          )}
          <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera size={16} />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFoto}
            className="hidden"
            disabled={enviandoFoto}
          />
        </label>
        <div className="min-w-0">
          <p className="text-sm mb-1">{usuario?.displayName || "—"}</p>
          <p className="text-xs text-muted truncate">{usuario?.email}</p>
          <p className="text-xs text-muted mt-1">
            Desde{" "}
            {usuario?.metadata.creationTime
              ? new Date(usuario.metadata.creationTime).toLocaleDateString("pt-BR")
              : "—"}
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard icone={Dumbbell} label="Treinos registrados" valor={String(treinos.length)} />
        <StatCard icone={Wallet} label="Lançamentos" valor={String(transacoes.length)} />
        <StatCard icone={BookOpen} label="Sessões de estudo" valor={String(estudos.length)} />
        <StatCard icone={NotebookPen} label="Entradas no diário" valor={String(diario.length)} />
      </div>

      <button
        onClick={handleSair}
        className="text-sm text-red-400 hover:text-red-300 transition-colors"
      >
        Sair da conta
      </button>
    </AppShell>
  );
}
