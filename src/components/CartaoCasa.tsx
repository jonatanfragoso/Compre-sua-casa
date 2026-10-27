import Link from "next/link";
import type { Casa } from "@/lib/casas";
import { formatarArea, formatarPreco } from "@/lib/format";
import { Badge } from "./Badge";
import { BotaoFavorito } from "./BotaoFavorito";

export function CartaoCasa({ casa }: { casa: Casa }) {
  const capa = casa.imagens[0];
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/casas/${casa.id}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[4/3] bg-stone-100">
          {capa ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={capa} alt={casa.titulo} loading="lazy" className="size-full object-cover" />
          ) : (
            <div className="grid size-full place-items-center text-stone-300">
              <svg viewBox="0 0 24 24" className="size-14" fill="currentColor" aria-hidden>
                <path d="M12 3 2 11h3v9h5v-6h4v6h5v-9h3z" />
              </svg>
            </div>
          )}
          {casa.imagens.length > 1 && (
            <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
              {casa.imagens.length} fotos
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div>
            <p className="text-xl font-bold text-emerald-800">{formatarPreco(casa.valor)}</p>
            <h2 className="font-semibold leading-snug">{casa.titulo}</h2>
            {casa.bairro && <p className="text-sm text-stone-500">{casa.bairro}</p>}
          </div>
          <ul className="grid grid-cols-4 gap-1 text-center text-xs text-stone-600">
            <Info valor={casa.quartos} rotulo="quartos" />
            <Info valor={casa.banheiros} rotulo="banh." />
            <Info valor={casa.vagas} rotulo="vagas" />
            <Info valor={formatarArea(casa.terreno_m2)} rotulo="terreno" />
          </ul>
          <div className="mt-auto flex flex-wrap gap-1 pt-1">
            {casa.visitada ? <Badge tom="verde">Visitada</Badge> : <Badge>Não visitada</Badge>}
            {casa.precisa_reforma && <Badge tom="ambar">Precisa reforma</Badge>}
            <Badge tom="azul">{casa.origem === "imobiliaria" ? "Imobiliária" : "Particular"}</Badge>
            {casa.piscina && <Badge>Piscina</Badge>}
            {casa.churrasqueira && <Badge>Churrasqueira</Badge>}
            {casa.quintal_gramado && <Badge>Gramado</Badge>}
          </div>
        </div>
      </Link>
      <BotaoFavorito id={casa.id} favorita={casa.favorita} className="absolute right-2 top-2" />
    </article>
  );
}

function Info({ valor, rotulo }: { valor: number | string; rotulo: string }) {
  return (
    <li className="rounded-lg bg-stone-50 px-1 py-1.5">
      <span className="block text-sm font-semibold text-stone-800">{valor}</span>
      {rotulo}
    </li>
  );
}
