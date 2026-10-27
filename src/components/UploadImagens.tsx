"use client";

import { upload } from "@vercel/blob/client";
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";

const LADO_MAX = 2000;

// Reduz fotos grandes do celular antes de enviar (economiza espaço e acelera o upload).
async function reduzir(arquivo: File): Promise<File> {
  if (arquivo.type === "image/gif") return arquivo;
  try {
    const bitmap = await createImageBitmap(arquivo);
    const escala = Math.min(1, LADO_MAX / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * escala);
    canvas.height = Math.round(bitmap.height * escala);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.85));
    if (!blob || blob.size >= arquivo.size) return arquivo;
    const nome = arquivo.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], nome, { type: "image/jpeg" });
  } catch {
    return arquivo;
  }
}

export function UploadImagens({
  imagens,
  onChange,
  onEnviando,
}: {
  imagens: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
  onEnviando: (enviando: boolean) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [pendentes, setPendentes] = useState(0);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => onEnviando(pendentes > 0), [pendentes, onEnviando]);

  async function enviar(arquivos: FileList | null) {
    if (!arquivos?.length) return;
    setErro(null);
    const lista = Array.from(arquivos);
    setPendentes((p) => p + lista.length);

    const urls: string[] = [];
    let falhas = 0;
    await Promise.all(
      lista.map(async (arquivo) => {
        try {
          const final = await reduzir(arquivo);
          const nome = final.name.normalize("NFD").replace(/[^\w.-]+/g, "-");
          const blob = await upload(`casas/${nome}`, final, {
            access: "public",
            handleUploadUrl: "/api/upload",
          });
          urls.push(blob.url);
        } catch (err) {
          console.error(err);
          falhas++;
        } finally {
          setPendentes((p) => p - 1);
        }
      }),
    );

    onChange((atuais) => [...atuais, ...urls]);
    if (falhas) setErro(`${falhas} foto(s) não puderam ser enviadas.`);
    if (input.current) input.current.value = "";
  }

  function mover(i: number, delta: number) {
    const j = i + delta;
    if (j < 0 || j >= imagens.length) return;
    const nova = [...imagens];
    [nova[i], nova[j]] = [nova[j], nova[i]];
    onChange(nova);
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {imagens.map((url, i) => (
          <div key={url} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-stone-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="size-full object-cover" />
            {i === 0 && (
              <span className="absolute left-1.5 top-1.5 rounded-full bg-emerald-700 px-2 py-0.5 text-xs text-white">
                Capa
              </span>
            )}
            <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-gradient-to-t from-black/60 p-1.5">
              <div className="flex gap-1">
                <MiniBotao onClick={() => mover(i, -1)} disabled={i === 0} label="Mover para a esquerda">‹</MiniBotao>
                <MiniBotao onClick={() => mover(i, 1)} disabled={i === imagens.length - 1} label="Mover para a direita">›</MiniBotao>
              </div>
              <MiniBotao onClick={() => onChange(imagens.filter((u) => u !== url))} label="Remover foto">✕</MiniBotao>
            </div>
          </div>
        ))}
        {Array.from({ length: pendentes }, (_, i) => (
          <div key={`p${i}`} className="grid aspect-[4/3] animate-pulse place-items-center rounded-xl bg-stone-200 text-xs text-stone-500">
            Enviando...
          </div>
        ))}
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="grid aspect-[4/3] place-items-center rounded-xl border-2 border-dashed border-stone-300 text-sm text-stone-500 transition hover:border-emerald-600 hover:text-emerald-700"
        >
          <span className="text-center">
            <span className="block text-2xl">+</span>
            Adicionar fotos
          </span>
        </button>
      </div>
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => enviar(e.target.files)}
      />
      {erro && <p className="mt-2 text-sm text-red-600">{erro}</p>}
      <p className="mt-2 text-xs text-stone-500">
        A primeira foto é usada como capa. Use as setas para reordenar.
      </p>
    </div>
  );
}

function MiniBotao({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="grid size-7 place-items-center rounded-full bg-white/90 text-sm font-bold text-stone-800 disabled:opacity-30"
    >
      {children}
    </button>
  );
}
