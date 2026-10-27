# Compre sua casa

App para cadastrar e comparar casas à venda: características, preço, bairro,
fotos, prós e contras, com filtros de busca.

> **Vai instalar na sua conta da Vercel?** Siga o [DEPLOY.md](DEPLOY.md).

## Stack

- Next.js 16 (App Router, Server Actions, Cache Components) + Tailwind CSS 4
- Postgres serverless da [Neon](https://neon.tech) (`@neondatabase/serverless`)
- [Vercel Blob](https://vercel.com/docs/vercel-blob) para as fotos (upload direto do navegador)
- Proteção opcional por senha única (`APP_PASSWORD`), verificada em `src/proxy.ts`

A tabela `casas` é criada automaticamente na primeira requisição
([src/lib/db.ts](src/lib/db.ts)). Ao adicionar campos novos, inclua um
`ALTER TABLE casas ADD COLUMN IF NOT EXISTS ...` ali, para que os bancos de
quem já usa o app sejam atualizados sozinhos depois do sync do fork.

## Rodando localmente

1. `npm install`
2. Copie `.env.example` para `.env.local` e preencha:
   - `DATABASE_URL`: crie um banco grátis em neon.tech (ou um branch de dev
     do banco do projeto) e cole a connection string.
   - `BLOB_READ_WRITE_TOKEN`: necessário só para testar upload de fotos.
     Pegue em Vercel → Storage → seu Blob → `.env.local`.
     (Com um projeto Vercel linkado, `npx vercel env pull .env.local` traz tudo.)
3. `npm run dev` e abra http://localhost:3000

## Estrutura

```
src/
  proxy.ts               # exige login quando APP_PASSWORD está definida
  app/
    page.tsx             # lista + filtros
    actions.ts           # server actions (salvar, excluir, favoritar, login)
    api/upload/route.ts  # gera token para upload de fotos no Blob
    casas/nova/          # cadastro
    casas/[id]/          # detalhes e edição
  components/            # formulário, filtros, galeria, upload...
  lib/
    db.ts                # conexão e criação da tabela
    casas.ts             # consultas SQL
```
