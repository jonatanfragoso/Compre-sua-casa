import { neon } from "@neondatabase/serverless";

function getSql() {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (!url) {
    throw new Error(
      "Banco de dados não configurado: defina DATABASE_URL (veja o DEPLOY.md).",
    );
  }
  return neon(url);
}

let schemaReady: Promise<void> | null = null;

// Cria a tabela na primeira consulta, assim ninguém precisa rodar migração manual.
// Para adicionar colunas no futuro, acrescente um
// `ALTER TABLE casas ADD COLUMN IF NOT EXISTS ...` logo após o CREATE TABLE,
// para que bancos já existentes (como o do fork) sejam atualizados sozinhos.
async function ensureSchema() {
  schemaReady ??= (async () => {
    const sql = getSql();
    await sql`
      CREATE TABLE IF NOT EXISTS casas (
        id               SERIAL PRIMARY KEY,
        titulo           TEXT NOT NULL,
        bairro           TEXT NOT NULL DEFAULT '',
        endereco         TEXT NOT NULL DEFAULT '',
        valor            NUMERIC(14,2),
        quartos          INTEGER NOT NULL DEFAULT 0,
        salas            INTEGER NOT NULL DEFAULT 0,
        banheiros        INTEGER NOT NULL DEFAULT 0,
        vagas            INTEGER NOT NULL DEFAULT 0,
        terreno_m2       NUMERIC(10,2),
        churrasqueira    BOOLEAN NOT NULL DEFAULT FALSE,
        piscina          BOOLEAN NOT NULL DEFAULT FALSE,
        quintal_fundos   BOOLEAN NOT NULL DEFAULT FALSE,
        quintal_gramado  BOOLEAN NOT NULL DEFAULT FALSE,
        precisa_reforma  BOOLEAN NOT NULL DEFAULT FALSE,
        visitada         BOOLEAN NOT NULL DEFAULT FALSE,
        favorita         BOOLEAN NOT NULL DEFAULT FALSE,
        origem           TEXT NOT NULL DEFAULT 'particular',
        contato          TEXT NOT NULL DEFAULT '',
        link             TEXT NOT NULL DEFAULT '',
        pros             TEXT NOT NULL DEFAULT '',
        contras          TEXT NOT NULL DEFAULT '',
        imagens          TEXT[] NOT NULL DEFAULT '{}',
        criado_em        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        atualizado_em    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
  })().catch((err) => {
    schemaReady = null;
    throw err;
  });
  return schemaReady;
}

export async function db() {
  await ensureSchema();
  return getSql();
}
