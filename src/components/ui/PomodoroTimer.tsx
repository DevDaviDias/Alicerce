"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

const FOCO_SEGUNDOS = 25 * 60;
const PAUSA_SEGUNDOS = 5 * 60;

export function PomodoroTimer({
  onCicloConcluido,
}: {
  onCicloConcluido: (segundosFoco: number) => void;
}) {
  const [modo, setModo] = useState<"foco" | "pausa">("foco");
  const [segundos, setSegundos] = useState(FOCO_SEGUNDOS);
  const [rodando, setRodando] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!rodando) return;

    intervalRef.current = setInterval(() => {
      setSegundos((atual) => {
        if (atual <= 1) {
          // ciclo terminou
          if (modo === "foco") {
            onCicloConcluido(FOCO_SEGUNDOS);
            setModo("pausa");
            return PAUSA_SEGUNDOS;
          } else {
            setModo("foco");
            return FOCO_SEGUNDOS;
          }
        }
        return atual - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rodando, modo]);

  function reiniciar() {
    setRodando(false);
    setModo("foco");
    setSegundos(FOCO_SEGUNDOS);
  }

  const minutos = String(Math.floor(segundos / 60)).padStart(2, "0");
  const segs = String(segundos % 60).padStart(2, "0");

  const total = modo === "foco" ? FOCO_SEGUNDOS : PAUSA_SEGUNDOS;
  const progresso = ((total - segundos) / total) * 100;

  return (
    <div className="flex flex-col items-center py-4">
      <p className="text-xs text-muted mb-4 uppercase tracking-wide">
        {modo === "foco" ? "Foco" : "Pausa"}
      </p>

      <div className="relative w-40 h-40 mb-6">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#2C3033"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={modo === "foco" ? "#4F6D5A" : "#B08D57"}
            strokeWidth="6"
            strokeDasharray={2 * Math.PI * 45}
            strokeDashoffset={2 * Math.PI * 45 * (1 - progresso / 100)}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-3xl">
            {minutos}:{segs}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setRodando((r) => !r)}
          className="flex items-center gap-2 bg-moss hover:bg-moss-light transition-colors rounded-md px-5 py-2.5 text-sm font-medium"
        >
          {rodando ? <Pause size={15} /> : <Play size={15} />}
          {rodando ? "Pausar" : "Iniciar"}
        </button>
        <button
          onClick={reiniciar}
          className="flex items-center gap-2 border border-border hover:bg-surface2 transition-colors rounded-md px-4 py-2.5 text-sm"
        >
          <RotateCcw size={14} />
          Reiniciar
        </button>
      </div>

      <p className="text-xs text-muted mt-5 text-center max-w-[220px]">
        Ao concluir um ciclo de foco de 25 min, a sessão é somada
        automaticamente na matéria escolhida abaixo.
      </p>
    </div>
  );
}
