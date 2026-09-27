export function ProgressBar({
  valor,
  max,
  cor = "moss",
}: {
  valor: number;
  max: number;
  cor?: "moss" | "bronze";
}) {
  const pct = max > 0 ? Math.min(100, Math.round((valor / max) * 100)) : 0;
  const barColor = cor === "bronze" ? "bg-bronze" : "bg-moss";

  return (
    <div className="w-full h-2 rounded-full bg-surface2 overflow-hidden">
      <div
        className={`h-full ${barColor} rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
