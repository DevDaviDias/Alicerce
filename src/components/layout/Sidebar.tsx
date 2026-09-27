"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const ITENS = [
  { href: "/dashboard", label: "Painel" },
  { href: "/treino", label: "Treino" },
  { href: "/financas", label: "Finanças" },
  { href: "/estudos", label: "Estudos" },
  { href: "/diario", label: "Diário" },
  { href: "/perfil", label: "Perfil" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sair, usuario } = useAuth();
  const router = useRouter();

  async function handleSair() {
    await sair();
    router.push("/");
  }

  return (
    <aside className="w-56 shrink-0 border-r border-border flex flex-col justify-between py-6 px-4 h-screen sticky top-0">
      <div>
        <Link href="/dashboard" className="font-display text-lg px-2">
          Alicerce
        </Link>

        <nav className="mt-10 flex flex-col gap-1">
          {ITENS.map((item) => {
            const ativo = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm transition-colors ${
                  ativo
                    ? "bg-surface2 text-ink"
                    : "text-muted hover:text-ink hover:bg-surface"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="px-2">
        <p className="text-xs text-muted truncate mb-3">{usuario?.email}</p>
        <button
          onClick={handleSair}
          className="text-sm text-muted hover:text-ink transition-colors"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}
