"use client";

export default function Erro({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
      <p className="text-lg font-semibold">Algo deu errado.</p>
      <p className="mt-2 text-sm text-stone-500">
        Se o site acabou de ser instalado, confira se o banco de dados (Neon) e o
        armazenamento de fotos (Blob) estão conectados ao projeto na Vercel.
      </p>
      {error.digest && <p className="mt-2 text-xs text-stone-400">Código: {error.digest}</p>}
      <button onClick={reset} className="btn-primario mt-4">
        Tentar de novo
      </button>
    </div>
  );
}
