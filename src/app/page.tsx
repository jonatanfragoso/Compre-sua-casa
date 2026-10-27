import Link from "next/link";
import { Suspense } from "react";
import { CartaoCasa } from "@/components/CartaoCasa";
import { Filtros } from "@/components/Filtros";
import { listarBairros, listarCasas } from "@/lib/casas";
import { lerFiltros, temFiltroAtivo, type SearchParams } from "@/lib/filtros";
import { plural } from "@/lib/format";

export default function Home({ searchParams }: PageProps<"/">) {
  return (
    <Suspense fallback={<Carregando />}>
      <Lista searchParams={searchParams} />
    </Suspense>
  );
}

async function Lista({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const ativos = temFiltroAtivo(sp);
  const [casas, bairros] = await Promise.all([
    listarCasas(lerFiltros(sp)),
    listarBairros(),
  ]);

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:items-start">
      <aside className="lg:sticky lg:top-20">
        <Filtros sp={sp} bairros={bairros} ativos={ativos} />
      </aside>
      <section>
        <p className="mb-3 text-sm text-stone-500">
          {plural(casas.length, "casa encontrada", "casas encontradas")}
        </p>
        {casas.length === 0 ? (
          <Vazio filtrando={ativos} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {casas.map((casa) => (
              <CartaoCasa key={casa.id} casa={casa} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Vazio({ filtrando }: { filtrando: boolean }) {
  return (
    <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
      {filtrando ? (
        <>
          <p className="font-medium">Nenhuma casa com esses filtros.</p>
          <Link href="/" className="mt-3 inline-block text-sm text-emerald-700 underline">
            Limpar filtros
          </Link>
        </>
      ) : (
        <>
          <p className="text-lg font-medium">Nenhuma casa cadastrada ainda.</p>
          <p className="mt-1 text-sm text-stone-500">Comece adicionando a primeira casa que vocês viram.</p>
          <Link href="/casas/nova" className="btn-primario mt-4">
            + Cadastrar casa
          </Link>
        </>
      )}
    </div>
  );
}

function Carregando() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="h-80 animate-pulse rounded-2xl bg-stone-200/60" />
      ))}
    </div>
  );
}
