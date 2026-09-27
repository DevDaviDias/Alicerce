import { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`border border-border rounded-lg bg-surface p-5 ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({
  titulo,
  descricao,
}: {
  titulo: string;
  descricao?: string;
}) {
  return (
    <header className="mb-8">
      <h1 className="font-display text-3xl mb-1">{titulo}</h1>
      {descricao && <p className="text-muted text-sm">{descricao}</p>}
    </header>
  );
}
