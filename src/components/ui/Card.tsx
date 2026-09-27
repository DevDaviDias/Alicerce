import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border border-border rounded-lg bg-surface p-6 transition-colors hover:border-[#3A3F44] ${className}`}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  titulo,
  descricao,
  acao,
}: {
  titulo: string;
  descricao?: string;
  acao?: ReactNode;
}) {
  return (
    <header className="mb-10 flex items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl md:text-4xl mb-2">{titulo}</h1>
        {descricao && <p className="text-muted text-sm">{descricao}</p>}
      </div>
      {acao && <div className="shrink-0">{acao}</div>}
    </header>
  );
}

export function StatCard({
  icone: Icone,
  label,
  valor,
  nota,
  tone = "neutral",
}: {
  icone: LucideIcon;
  label: string;
  valor: string;
  nota?: string;
  tone?: "neutral" | "positive" | "negative";
}) {
  const toneClass =
    tone === "positive"
      ? "text-moss-light"
      : tone === "negative"
      ? "text-red-400"
      : "text-ink";

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-muted">{label}</p>
        <div className="w-8 h-8 rounded-md bg-surface2 flex items-center justify-center">
          <Icone size={15} className="text-bronze-light" />
        </div>
      </div>
      <p className={`font-display text-2xl md:text-3xl ${toneClass}`}>{valor}</p>
      {nota && <p className="text-xs text-muted mt-2">{nota}</p>}
    </Card>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-lg mb-4 mt-2 text-ink/90">{children}</h2>
  );
}
