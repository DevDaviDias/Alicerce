"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Dumbbell,
  Wallet,
  BookOpen,
  NotebookPen,
  UserRound,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const ITENS = [
  { href: "/dashboard", label: "Painel", icone: LayoutGrid },
  { href: "/treino", label: "Treino", icone: Dumbbell },
  { href: "/financas", label: "Finanças", icone: Wallet },
  { href: "/estudos", label: "Estudos", icone: BookOpen },
  { href: "/diario", label: "Diário", icone: NotebookPen },
  { href: "/perfil", label: "Perfil", icone: UserRound },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sair, usuario } = useAuth();
  const router = useRouter();

  async function handleSair() {
    await sair();
    router.push("/");
  }

  const iniciais = (usuario?.displayName || usuario?.email || "?")
    .charAt(0)
    .toUpperCase();

  return (
    <aside className="hidden md:flex w-60 shrink-0 border-r border-border flex-col justify-between py-7 px-4 h-screen sticky top-0">
      <div>
        <Link href="/dashboard" className="font-display text-xl px-2 block mb-12">
          Alicerce
        </Link>

        <nav className="flex flex-col gap-1">
          {ITENS.map((item) => {
            const ativo = pathname === item.href;
            const Icone = item.icone;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  ativo
                    ? "bg-surface2 text-ink"
                    : "text-muted hover:text-ink hover:bg-surface"
                }`}
              >
                <Icone size={17} strokeWidth={ativo ? 2.2 : 1.8} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="px-2">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
          <div className="w-8 h-8 rounded-full bg-moss-dark flex items-center justify-center text-xs font-medium shrink-0">
            {iniciais}
          </div>
          <div className="min-w-0">
            <p className="text-sm truncate">
              {usuario?.displayName || "Sua conta"}
            </p>
            <p className="text-xs text-muted truncate">{usuario?.email}</p>
          </div>
        </div>
        <button
          onClick={handleSair}
          className="flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors"
        >
          <LogOut size={15} />
          Sair
        </button>
      </div>
    </aside>
  );
}
