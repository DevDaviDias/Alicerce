"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Card, PageHeader } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";

export default function PerfilPage() {
  const { usuario, sair } = useAuth();
  const router = useRouter();

  async function handleSair() {
    await sair();
    router.push("/");
  }

  return (
    <AppShell>
      <PageHeader titulo="Perfil" descricao="Seus dados de conta." />

      <Card className="mb-6 max-w-md">
        <p className="text-xs text-muted mb-1">Nome</p>
        <p className="text-sm mb-4">{usuario?.displayName || "—"}</p>

        <p className="text-xs text-muted mb-1">E-mail</p>
        <p className="text-sm mb-4">{usuario?.email}</p>

        <p className="text-xs text-muted mb-1">Conta criada em</p>
        <p className="text-sm">
          {usuario?.metadata.creationTime
            ? new Date(usuario.metadata.creationTime).toLocaleDateString(
                "pt-BR"
              )
            : "—"}
        </p>
      </Card>

      <button
        onClick={handleSair}
        className="text-sm text-red-400 hover:text-red-300 transition-colors"
      >
        Sair da conta
      </button>
    </AppShell>
  );
}
