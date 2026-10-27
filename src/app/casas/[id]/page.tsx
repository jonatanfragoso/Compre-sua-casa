import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Badge } from "@/components/Badge";
import { BotaoExcluir } from "@/components/BotaoExcluir";
import { BotaoFavorito } from "@/components/BotaoFavorito";
import { Galeria } from "@/components/Galeria";
import { buscarCasa } from "@/lib/casas";
import { formatarArea, formatarPreco } from "@/lib/format";

export default function PaginaCasa({ params }: PageProps<"/casas/[id]">) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-stone-200/60" />}>
      <Detalhes params={params} />
    </Suspense>
  );
}

async function Detalhes({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const casa = await buscarCasa(Number(id));
  if (!casa) notFound();

  const caracteristicas: [string, boolean][] = [
    ["Churrasqueira", casa.churrasqueira],
    ["Piscina", casa.piscina],
    ["Quintal atrás", casa.quintal_fundos],
    ["Quintal com gramado", casa.quintal_gramado],
  ];

  return (
    <div className="space-y-6">
      <Link href="/" className="text-sm text-stone-500 hover:text-stone-800">
        ← Voltar para a lista
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Galeria imagens={casa.imagens} titulo={casa.titulo} />

        <div className="space-y-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold leading-tight">{casa.titulo}</h1>
                {(casa.bairro || casa.endereco) && (
                  <p className="mt-1 text-stone-500">
                    {[casa.endereco, casa.bairro].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
              <BotaoFavorito id={casa.id} favorita={casa.favorita} />
            </div>
            <p className="mt-3 text-3xl font-bold text-emerald-800">{formatarPreco(casa.valor)}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {casa.visitada ? <Badge tom="verde">Já visitamos</Badge> : <Badge>Ainda não visitamos</Badge>}
              {casa.precisa_reforma ? <Badge tom="ambar">Precisa reforma</Badge> : <Badge tom="verde">Sem reforma</Badge>}
              <Badge tom="azul">{casa.origem === "imobiliaria" ? "Imobiliária" : "Particular"}</Badge>
            </div>
            <div className="mt-5 flex gap-2">
              <Link href={`/casas/${casa.id}/editar`} className="btn-primario flex-1">
                Editar
              </Link>
              <BotaoExcluir id={casa.id} titulo={casa.titulo} />
            </div>
          </div>

          {(casa.contato || casa.link) && (
            <div className="space-y-1 rounded-2xl border border-stone-200 bg-white p-5 text-sm shadow-sm">
              {casa.contato && (
                <p>
                  <span className="text-stone-500">Contato: </span>
                  {casa.contato}
                </p>
              )}
              {casa.link && (
                <a href={casa.link} target="_blank" rel="noreferrer" className="break-all text-emerald-700 underline">
                  Ver anúncio ↗
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Numero valor={casa.quartos} rotulo="Quartos" />
        <Numero valor={casa.salas} rotulo="Salas" />
        <Numero valor={casa.banheiros} rotulo="Banheiros" />
        <Numero valor={casa.vagas} rotulo="Vagas" />
        <Numero valor={formatarArea(casa.terreno_m2)} rotulo="Terreno" className="col-span-2 sm:col-span-1" />
      </div>

      <div className="flex flex-wrap gap-2">
        {caracteristicas.map(([nome, tem]) => (
          <span
            key={nome}
            className={`rounded-full border px-3 py-1 text-sm ${tem ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-stone-200 text-stone-400 line-through"}`}
          >
            {tem ? "✓" : "✗"} {nome}
          </span>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Observacao titulo="👍 Prós" texto={casa.pros} cor="border-emerald-200 bg-emerald-50/50" />
        <Observacao titulo="👎 Contras" texto={casa.contras} cor="border-rose-200 bg-rose-50/50" />
      </div>
    </div>
  );
}

function Numero({ valor, rotulo, className = "" }: { valor: number | string; rotulo: string; className?: string }) {
  return (
    <div className={`rounded-2xl border border-stone-200 bg-white p-4 text-center shadow-sm ${className}`}>
      <p className="text-2xl font-bold">{valor}</p>
      <p className="text-sm text-stone-500">{rotulo}</p>
    </div>
  );
}

function Observacao({ titulo, texto, cor }: { titulo: string; texto: string; cor: string }) {
  return (
    <div className={`rounded-2xl border p-5 ${cor}`}>
      <h2 className="mb-2 font-semibold">{titulo}</h2>
      {texto ? (
        <p className="whitespace-pre-line text-stone-700">{texto}</p>
      ) : (
        <p className="text-sm text-stone-400">Nada anotado.</p>
      )}
    </div>
  );
}
