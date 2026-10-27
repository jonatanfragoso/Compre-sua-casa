"use client";

import { useEffect, useState } from "react";

export function Galeria({ imagens, titulo }: { imagens: string[]; titulo: string }) {
  const [atual, setAtual] = useState(0);
  const [ampliada, setAmpliada] = useState(false);
  const total = imagens.length;
  const ir = (delta: number) => setAtual((i) => (i + delta + total) % total);

  useEffect(() => {
    if (!ampliada) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAmpliada(false);
      if (e.key === "ArrowRight") setAtual((i) => (i + 1) % total);
      if (e.key === "ArrowLeft") setAtual((i) => (i - 1 + total) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ampliada, total]);

  if (!total) {
    return (
      <div className="grid aspect-[16/9] place-items-center rounded-2xl bg-stone-100 text-stone-400">
        Nenhuma foto cadastrada
      </div>
    );
  }

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl bg-stone-900">
        <button type="button" onClick={() => setAmpliada(true)} className="block w-full" aria-label="Ampliar foto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imagens[atual]} alt={`${titulo} — foto ${atual + 1}`} className="mx-auto aspect-[16/10] w-full object-contain" />
        </button>
        {total > 1 && (
          <>
            <Seta lado="esq" onClick={() => ir(-1)} />
            <Seta lado="dir" onClick={() => ir(1)} />
            <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
              {atual + 1} / {total}
            </span>
          </>
        )}
      </div>
      {total > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {imagens.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setAtual(i)}
              className={`size-16 shrink-0 overflow-hidden rounded-lg ring-2 sm:size-20 ${i === atual ? "ring-emerald-600" : "ring-transparent opacity-70 hover:opacity-100"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {ampliada && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/95" onClick={() => setAmpliada(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imagens[atual]} alt="" className="max-h-[92vh] max-w-[96vw] object-contain" onClick={(e) => e.stopPropagation()} />
          <button type="button" onClick={() => setAmpliada(false)} className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/20 text-xl text-white" aria-label="Fechar">
            ✕
          </button>
          {total > 1 && (
            <>
              <Seta lado="esq" onClick={(e) => { e.stopPropagation(); ir(-1); }} />
              <Seta lado="dir" onClick={(e) => { e.stopPropagation(); ir(1); }} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Seta({ lado, onClick }: { lado: "esq" | "dir"; onClick: (e: React.MouseEvent) => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={lado === "esq" ? "Foto anterior" : "Próxima foto"}
      className={`absolute top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-2xl text-stone-800 shadow hover:bg-white ${lado === "esq" ? "left-3" : "right-3"}`}
    >
      {lado === "esq" ? "‹" : "›"}
    </button>
  );
}
