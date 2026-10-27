# Como colocar o site no ar (passo a passo)

Este guia é para você ter o **seu próprio site** de casas, hospedado de graça na
Vercel, com o seu próprio banco de dados e fotos. Ninguém além de você (e quem
souber a senha) vê os dados.

Leva uns 15 minutos e só precisa ser feito uma vez.

Você vai precisar de:

- Uma conta no **GitHub** (github.com), onde fica o código.
- Uma conta na **Vercel** (vercel.com), onde o site roda. Você cria entrando com o GitHub.

---

## Parte 1 — Copiar o projeto para o seu GitHub (fork)

1. Crie uma conta em **github.com** (se ainda não tiver) e entre nela.
2. Abra o projeto: **https://github.com/jonatanfragoso/Compre-sua-casa**
3. Clique no botão **Fork** (lá em cima, à direita).
4. Na tela seguinte, não mude nada e clique em **Create fork**.

Pronto: agora existe uma cópia em `github.com/SEU-USUARIO/Compre-sua-casa`.

---

## Parte 2 — Criar o site na Vercel

1. Acesse **vercel.com/signup**.
2. Escolha o plano **Hobby** (gratuito), digite seu nome e clique em
   **Continue with GitHub**. Autorize o acesso.
3. No painel da Vercel, clique em **Add New…** → **Project**.
4. Na lista "Import Git Repository", ache **Compre-sua-casa** e clique em **Import**.
   - Se ele não aparecer, clique em **Adjust GitHub App Permissions**, dê acesso
     ao repositório **Compre-sua-casa** e volte.
5. Não mude nenhuma configuração. Clique em **Deploy**.
6. Espere terminar (1 a 2 minutos). Vai aparecer uma tela de parabéns. Clique em
   **Continue to Dashboard**.

> O site já existe, mas **ainda não funciona**: falta conectar o banco de dados e o
> lugar das fotos. É o que vem agora.

---

## Parte 3 — Conectar o banco de dados (onde as casas ficam salvas)

1. Dentro do projeto na Vercel, clique na aba **Storage**.
2. Clique em **Create Database** (ou **Create**).
3. Escolha **Neon** (Serverless Postgres) e clique em **Continue**.
4. Aceite os termos, se pedir. Nas opções:
   - **Region**: deixe **Washington, D.C., USA (East)** (`iad1`/`us-east-1`), que é
     a mesma região onde o site roda.
   - **Plan**: **Free**.
5. Clique em **Continue** / **Create**, dê um nome (ex.: `casas-db`) e confirme.
6. Se aparecer a tela **Connect Project**, confira que o projeto
   **compre-sua-casa** está selecionado com todos os ambientes marcados
   (Development, Preview, Production) e clique em **Connect**.

A tabela das casas é criada sozinha na primeira vez que o site abrir. Você não
precisa mexer em nada no banco.

---

## Parte 4 — Conectar o armazenamento de fotos

1. Ainda na aba **Storage**, clique em **Create Database** / **Create** de novo.
2. Escolha **Blob** e clique em **Continue**.
3. Dê um nome (ex.: `fotos-casas`).
4. Em **Access**, escolha **Public**. ⚠️ Isso é importante: com "Private" as fotos
   não aparecem. (Os endereços das fotos são aleatórios e impossíveis de adivinhar.)
5. Clique em **Create** e, na tela **Connect Project**, conecte ao projeto
   **compre-sua-casa** com todos os ambientes marcados.

---

## Parte 5 — Criar a senha do site

Sem isso, qualquer pessoa que descobrir o endereço poderia ver e mexer nas casas.

1. No projeto, vá em **Settings** → **Environment Variables**.
2. Preencha:
   - **Key**: `APP_PASSWORD`
   - **Value**: a senha que vocês vão usar (ex.: `casanova2026`)
3. Deixe todos os ambientes marcados e clique em **Save**.

---

## Parte 6 — Publicar de novo para aplicar tudo

As mudanças das partes 3 a 5 só valem depois de publicar de novo:

1. Vá na aba **Deployments**.
2. No primeiro item da lista, clique nos **três pontinhos (⋯)** → **Redeploy** →
   **Redeploy**.
3. Quando terminar, clique em **Visit** (ou na aba **Overview**, no endereço
   `compre-sua-casa-xxxx.vercel.app`).
4. Digite a senha e pronto! 🎉

Dica: no celular, abra o site e use **"Adicionar à tela de início"** para ficar
como um app.

---

## Como receber atualizações

Quando o Jonatan avisar que tem novidade:

1. Entre em `github.com/SEU-USUARIO/Compre-sua-casa`.
2. Logo acima da lista de arquivos aparece "This branch is X commits behind".
   Clique em **Sync fork** → **Update branch**.
3. Só isso. A Vercel percebe a mudança e publica a versão nova sozinha em 1–2
   minutos. Suas casas e fotos **não são apagadas**.

> Não edite arquivos no seu fork pelo GitHub: se editar, o "Sync fork" pode pedir
> para descartar suas mudanças.

---

## Problemas comuns

| O que aconteceu | Como resolver |
|---|---|
| Aparece "Algo deu errado" | Confira as partes 3 e 4 (banco e Blob conectados ao projeto) e faça o **Redeploy** (parte 6). |
| As fotos não sobem | Confira se o Blob foi conectado ao projeto e fez o Redeploy. |
| As fotos sobem mas não aparecem | O Blob foi criado como **Private**. Apague-o em Storage, crie outro como **Public** (parte 4) e faça Redeploy. |
| Esqueci a senha | Settings → Environment Variables → `APP_PASSWORD` → editar → salvar → Redeploy. |
| Não pede senha | A variável `APP_PASSWORD` não foi criada ou faltou o Redeploy. |

## Custos

Tudo usa os planos gratuitos (Vercel Hobby, Neon Free e Vercel Blob), que sobram
para uso pessoal com algumas dezenas de casas e fotos. As fotos são reduzidas
automaticamente antes de subir, para economizar espaço.
