"use client";

import { useTransition } from "react";
import { removerCasa } from "@/app/actions";

export function BotaoExcluir({ id, titulo }: { id: number; titulo: string }) {
  const [excluindo, startTransition] = useTransition();
  return (
    <button
      type="button"
      className="btn-perigo"
      disabled={excluindo}
      onClick={() => {
        if (confirm(`Excluir "${titulo}"? As fotos também serão apagadas.`)) {
          startTransition(() => removerCasa(id));
        }
      }}
    >
      {excluindo ? "Excluindo..." : "Excluir"}
    </button>
  );
}
