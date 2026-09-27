"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Dumbbell, Wallet, BookOpen, NotebookPen } from "lucide-react";

const ITENS = [
  { href: "/dashboard", label: "Painel", icone: LayoutGrid },
  { href: "/treino", label: "Treino", icone: Dumbbell },
  { href: "/financas", label: "Finanças", icone: Wallet },
  { href: "/estudos", label: "Estudos", icone: BookOpen },
  { href: "/diario", label: "Diário", icone: NotebookPen },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border flex items-stretch justify-around"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {ITENS.map((item) => {
        const ativo = pathname === item.href;
        const Icone = item.icone;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] transition-colors ${
              ativo ? "text-ink" : "text-muted"
            }`}
          >
            <Icone size={19} strokeWidth={ativo ? 2.3 : 1.8} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
