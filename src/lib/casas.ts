import { connection } from "next/server";
import { db } from "./db";

export type Origem = "particular" | "imobiliaria";

export type Casa = {
  id: number;
  titulo: string;
  bairro: string;
  endereco: string;
  valor: number | null;
  quartos: number;
  salas: number;
  banheiros: number;
  vagas: number;
  terreno_m2: number | null;
  churrasqueira: boolean;
  piscina: boolean;
  quintal_fundos: boolean;
  quintal_gramado: boolean;
  precisa_reforma: boolean;
  visitada: boolean;
  favorita: boolean;
  origem: Origem;
  contato: string;
  link: string;
  pros: string;
  contras: string;
  imagens: string[];
  criado_em: string;
  atualizado_em: string;
};

export type CasaInput = Omit<Casa, "id" | "criado_em" | "atualizado_em">;

export type Filtros = {
  q?: string;
  bairro?: string;
  precoMin?: number;
  precoMax?: number;
  quartos?: number;
  banheiros?: number;
  vagas?: number;
  terrenoMin?: number;
  churrasqueira?: boolean;
  piscina?: boolean;
  quintalFundos?: boolean;
  quintalGramado?: boolean;
  semReforma?: boolean;
  visitada?: "sim" | "nao";
  origem?: Origem;
  favorita?: boolean;
  ordem?: Ordem;
};

export const ORDENS = {
  recentes: "Mais recentes",
  preco_asc: "Menor preço",
  preco_desc: "Maior preço",
  terreno_desc: "Maior terreno",
  quartos_desc: "Mais quartos",
} as const;

export type Ordem = keyof typeof ORDENS;

const ORDER_BY: Record<Ordem, string> = {
  recentes: "criado_em DESC",
  preco_asc: "valor ASC NULLS LAST",
  preco_desc: "valor DESC NULLS LAST",
  terreno_desc: "terreno_m2 DESC NULLS LAST",
  quartos_desc: "quartos DESC",
};

function fromRow(row: Record<string, unknown>): Casa {
  return {
    ...(row as Casa),
    valor: row.valor == null ? null : Number(row.valor),
    terreno_m2: row.terreno_m2 == null ? null : Number(row.terreno_m2),
    criado_em: String(row.criado_em),
    atualizado_em: String(row.atualizado_em),
  };
}

export async function listarCasas(f: Filtros = {}): Promise<Casa[]> {
  await connection();
  const where: string[] = [];
  const params: unknown[] = [];
  const add = (cond: (p: string) => string, value: unknown) => {
    params.push(value);
    where.push(cond(`$${params.length}`));
  };

  if (f.q) {
    add(
      (p) =>
        `(titulo ILIKE ${p} OR bairro ILIKE ${p} OR endereco ILIKE ${p} OR pros ILIKE ${p} OR contras ILIKE ${p})`,
      `%${f.q}%`,
    );
  }
  if (f.bairro) add((p) => `bairro = ${p}`, f.bairro);
  if (f.precoMin != null) add((p) => `valor >= ${p}`, f.precoMin);
  if (f.precoMax != null) add((p) => `valor <= ${p}`, f.precoMax);
  if (f.quartos != null) add((p) => `quartos >= ${p}`, f.quartos);
  if (f.banheiros != null) add((p) => `banheiros >= ${p}`, f.banheiros);
  if (f.vagas != null) add((p) => `vagas >= ${p}`, f.vagas);
  if (f.terrenoMin != null) add((p) => `terreno_m2 >= ${p}`, f.terrenoMin);
  if (f.origem) add((p) => `origem = ${p}`, f.origem);
  if (f.visitada) add((p) => `visitada = ${p}`, f.visitada === "sim");
  if (f.churrasqueira) where.push("churrasqueira");
  if (f.piscina) where.push("piscina");
  if (f.quintalFundos) where.push("quintal_fundos");
  if (f.quintalGramado) where.push("quintal_gramado");
  if (f.semReforma) where.push("NOT precisa_reforma");
  if (f.favorita) where.push("favorita");

  const sql = await db();
  const rows = await sql.query(
    `SELECT * FROM casas
     ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
     ORDER BY favorita DESC, ${ORDER_BY[f.ordem ?? "recentes"]}, id DESC`,
    params,
  );
  return rows.map(fromRow);
}

export async function buscarCasa(id: number): Promise<Casa | null> {
  await connection();
  if (!Number.isInteger(id)) return null;
  const sql = await db();
  const rows = await sql`SELECT * FROM casas WHERE id = ${id}`;
  return rows[0] ? fromRow(rows[0]) : null;
}

export async function listarBairros(): Promise<string[]> {
  await connection();
  const sql = await db();
  const rows = await sql`
    SELECT DISTINCT bairro FROM casas WHERE bairro <> '' ORDER BY bairro
  `;
  return rows.map((r) => String(r.bairro));
}

export async function criarCasa(c: CasaInput): Promise<number> {
  const sql = await db();
  const rows = await sql`
    INSERT INTO casas (
      titulo, bairro, endereco, valor, quartos, salas, banheiros, vagas,
      terreno_m2, churrasqueira, piscina, quintal_fundos, quintal_gramado,
      precisa_reforma, visitada, favorita, origem, contato, link, pros,
      contras, imagens
    ) VALUES (
      ${c.titulo}, ${c.bairro}, ${c.endereco}, ${c.valor}, ${c.quartos},
      ${c.salas}, ${c.banheiros}, ${c.vagas}, ${c.terreno_m2},
      ${c.churrasqueira}, ${c.piscina}, ${c.quintal_fundos},
      ${c.quintal_gramado}, ${c.precisa_reforma}, ${c.visitada},
      ${c.favorita}, ${c.origem}, ${c.contato}, ${c.link}, ${c.pros},
      ${c.contras}, ${c.imagens}
    )
    RETURNING id
  `;
  return Number(rows[0].id);
}

export async function atualizarCasa(id: number, c: CasaInput) {
  const sql = await db();
  await sql`
    UPDATE casas SET
      titulo = ${c.titulo}, bairro = ${c.bairro}, endereco = ${c.endereco},
      valor = ${c.valor}, quartos = ${c.quartos}, salas = ${c.salas},
      banheiros = ${c.banheiros}, vagas = ${c.vagas},
      terreno_m2 = ${c.terreno_m2}, churrasqueira = ${c.churrasqueira},
      piscina = ${c.piscina}, quintal_fundos = ${c.quintal_fundos},
      quintal_gramado = ${c.quintal_gramado},
      precisa_reforma = ${c.precisa_reforma}, visitada = ${c.visitada},
      favorita = ${c.favorita}, origem = ${c.origem}, contato = ${c.contato},
      link = ${c.link}, pros = ${c.pros}, contras = ${c.contras},
      imagens = ${c.imagens}, atualizado_em = NOW()
    WHERE id = ${id}
  `;
}

export async function alternarFavorita(id: number) {
  const sql = await db();
  await sql`UPDATE casas SET favorita = NOT favorita WHERE id = ${id}`;
}

export async function excluirCasa(id: number): Promise<string[]> {
  const sql = await db();
  const rows = await sql`DELETE FROM casas WHERE id = ${id} RETURNING imagens`;
  return rows[0]?.imagens ?? [];
}
