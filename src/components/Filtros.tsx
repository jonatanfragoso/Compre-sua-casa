"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ORDENS } from "@/lib/casas";
import type { SearchParams } from "@/lib/filtros";

const CHECKS = [
  ["favorita", "Só favoritas"],
  ["churrasqueira", "Churrasqueira"],
  ["piscina", "Piscina"],
  ["quintalFundos", "Quintal atrás"],
  ["quintalGramado", "Quintal com gramado"],
  ["semReforma", "Sem reforma"],
] as const;

export function Filtros({
  sp,
  bairros,
  ativos,
}: {
  sp: SearchParams;
  bairros: string[];
  ativos: boolean;
}) {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [carregando, startTransition] = useTransition();
  const v = (k: string) => {
    const x = sp[k];
    return (Array.isArray(x) ? x[0] : x) ?? "";
  };

  function aplicar(form: HTMLFormElement) {
    const params = new URLSearchParams();
    for (const [k, val] of new FormData(form)) {
      if (typeof val === "string" && val.trim()) params.set(k, val.trim());
    }
    const qs = params.toString();
    startTransition(() => router.push(qs ? `/?${qs}` : "/", { scroll: false }));
  }

  return (
    <form
      key={JSON.stringify(sp)}
      onSubmit={(e) => {
        e.preventDefault();
        aplicar(e.currentTarget);
      }}
      onChange={(e) => {
        const t = e.target as EventTarget as HTMLInputElement;
        if (t.type === "checkbox" || t.type === "radio" || t.tagName === "SELECT") {
          aplicar(e.currentTarget);
        }
      }}
      className="space-y-3"
    >
      <div className="flex gap-2">
        <input
          name="q"
          defaultValue={v("q")}
          placeholder="Buscar por nome, bairro, endereço, prós..."
          className="campo"
          type="search"
        />
        <button className="btn-primario shrink-0">Buscar</button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setAberto((a) => !a)}
          className="btn-secundario lg:hidden"
          aria-expanded={aberto}
        >
          {aberto ? "Esconder filtros" : "Mais filtros"}
          {ativos && <span className="size-2 rounded-full bg-emerald-600" />}
        </button>
        <label className="ml-auto flex items-center gap-2 text-sm text-stone-600">
          Ordenar
          <select name="ordem" defaultValue={v("ordem") || "recentes"} className="campo w-auto py-1.5">
            {Object.entries(ORDENS).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset
        className={`${aberto ? "grid" : "hidden"} gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm lg:grid`}
        disabled={carregando}
      >
        <div>
          <label className="rotulo" htmlFor="f-bairro">Bairro</label>
          <select id="f-bairro" name="bairro" defaultValue={v("bairro")} className="campo">
            <option value="">Todos</option>
            {bairros.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>

        <div>
          <span className="rotulo">Preço (R$)</span>
          <div className="flex items-center gap-2">
            <input name="precoMin" defaultValue={v("precoMin")} placeholder="mín." inputMode="numeric" className="campo" />
            <span className="text-stone-400">a</span>
            <input name="precoMax" defaultValue={v("precoMax")} placeholder="máx." inputMode="numeric" className="campo" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Minimo nome="quartos" rotulo="Quartos" valor={v("quartos")} />
          <Minimo nome="banheiros" rotulo="Banheiros" valor={v("banheiros")} />
          <Minimo nome="vagas" rotulo="Vagas" valor={v("vagas")} />
        </div>

        <div>
          <label className="rotulo" htmlFor="f-terreno">Terreno mínimo (m²)</label>
          <input id="f-terreno" name="terrenoMin" defaultValue={v("terrenoMin")} inputMode="numeric" className="campo" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="rotulo" htmlFor="f-visitada">Visita</label>
            <select id="f-visitada" name="visitada" defaultValue={v("visitada")} className="campo">
              <option value="">Todas</option>
              <option value="sim">Já visitamos</option>
              <option value="nao">Falta visitar</option>
            </select>
          </div>
          <div>
            <label className="rotulo" htmlFor="f-origem">Anúncio</label>
            <select id="f-origem" name="origem" defaultValue={v("origem")} className="campo">
              <option value="">Todos</option>
              <option value="particular">Particular</option>
              <option value="imobiliaria">Imobiliária</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
          {CHECKS.map(([nome, label]) => (
            <label key={nome} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name={nome}
                value="1"
                defaultChecked={v(nome) === "1"}
                className="size-4 accent-emerald-700"
              />
              {label}
            </label>
          ))}
        </div>

        <div className="flex gap-2">
          <button className="btn-primario flex-1">Aplicar</button>
          {ativos && (
            <button
              type="button"
              className="btn-secundario"
              onClick={() => startTransition(() => router.push("/", { scroll: false }))}
            >
              Limpar
            </button>
          )}
        </div>
      </fieldset>
    </form>
  );
}

function Minimo({ nome, rotulo, valor }: { nome: string; rotulo: string; valor: string }) {
  return (
    <div>
      <label className="rotulo" htmlFor={`f-${nome}`}>{rotulo}</label>
      <select id={`f-${nome}`} name={nome} defaultValue={valor} className="campo px-2">
        <option value="">Tanto faz</option>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n}+
          </option>
        ))}
      </select>
    </div>
  );
}
