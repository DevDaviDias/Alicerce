import { LucideIcon } from "lucide-react";

export function EmptyState({
  icone: Icone,
  titulo,
  descricao,
}: {
  icone: LucideIcon;
  titulo: string;
  descricao: string;
}) {
  return (
    <div className="flex flex-col items-center text-center py-14 px-6 border border-dashed border-border rounded-lg">
      <div className="w-11 h-11 rounded-full bg-surface2 flex items-center justify-center mb-4">
        <Icone size={20} className="text-muted" />
      </div>
      <p className="text-sm mb-1">{titulo}</p>
      <p className="text-xs text-muted max-w-[240px]">{descricao}</p>
    </div>
  );
}
