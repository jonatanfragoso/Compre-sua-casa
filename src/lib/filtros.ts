import { ORDENS, type Filtros, type Ordem } from "./casas";

export type SearchParams = Record<string, string | string[] | undefined>;

function valor(sp: SearchParams, nome: string) {
  const v = sp[nome];
  return (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
}

function numero(sp: SearchParams, nome: string) {
  const v = valor(sp, nome)?.replace(/\./g, "").replace(",", ".");
  const n = v ? Number(v) : NaN;
  return Number.isFinite(n) ? n : undefined;
}

export function lerFiltros(sp: SearchParams): Filtros {
  const visitada = valor(sp, "visitada");
  const origem = valor(sp, "origem");
  const ordem = valor(sp, "ordem");
  return {
    q: valor(sp, "q"),
    bairro: valor(sp, "bairro"),
    precoMin: numero(sp, "precoMin"),
    precoMax: numero(sp, "precoMax"),
    quartos: numero(sp, "quartos"),
    banheiros: numero(sp, "banheiros"),
    vagas: numero(sp, "vagas"),
    terrenoMin: numero(sp, "terrenoMin"),
    churrasqueira: valor(sp, "churrasqueira") === "1",
    piscina: valor(sp, "piscina") === "1",
    quintalFundos: valor(sp, "quintalFundos") === "1",
    quintalGramado: valor(sp, "quintalGramado") === "1",
    semReforma: valor(sp, "semReforma") === "1",
    favorita: valor(sp, "favorita") === "1",
    visitada: visitada === "sim" || visitada === "nao" ? visitada : undefined,
    origem:
      origem === "particular" || origem === "imobiliaria" ? origem : undefined,
    ordem: ordem && ordem in ORDENS ? (ordem as Ordem) : undefined,
  };
}

export function temFiltroAtivo(sp: SearchParams) {
  return Object.entries(sp).some(([k, v]) => k !== "ordem" && Boolean(v));
}
