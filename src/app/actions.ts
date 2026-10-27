"use server";

import { del } from "@vercel/blob";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  AUTH_COOKIE,
  senhaConfigurada,
  tokenEsperado,
  tokenValido,
} from "@/lib/auth";
import {
  alternarFavorita,
  atualizarCasa,
  buscarCasa,
  criarCasa,
  excluirCasa,
  type CasaInput,
} from "@/lib/casas";

export type FormState = { erro?: string };

async function exigirLogin() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!(await tokenValido(token))) redirect("/login");
}

function texto(fd: FormData, nome: string) {
  return String(fd.get(nome) ?? "").trim();
}

function inteiro(fd: FormData, nome: string) {
  const n = parseInt(texto(fd, nome), 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

// Aceita "450.000", "450000,50", "R$ 450.000,00" etc.
function decimal(fd: FormData, nome: string): number | null {
  let v = texto(fd, nome).replace(/[^\d.,]/g, "");
  if (!v) return null;
  if (v.includes(",")) v = v.replace(/\./g, "").replace(",", ".");
  else if (/^\d{1,3}(\.\d{3})+$/.test(v)) v = v.replace(/\./g, "");
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function lerCasa(fd: FormData): CasaInput {
  let imagens: string[] = [];
  try {
    const parsed = JSON.parse(texto(fd, "imagens") || "[]");
    if (Array.isArray(parsed)) imagens = parsed.filter((u) => typeof u === "string");
  } catch {}

  return {
    titulo: texto(fd, "titulo"),
    bairro: texto(fd, "bairro"),
    endereco: texto(fd, "endereco"),
    valor: decimal(fd, "valor"),
    quartos: inteiro(fd, "quartos"),
    salas: inteiro(fd, "salas"),
    banheiros: inteiro(fd, "banheiros"),
    vagas: inteiro(fd, "vagas"),
    terreno_m2: decimal(fd, "terreno_m2"),
    churrasqueira: fd.get("churrasqueira") === "on",
    piscina: fd.get("piscina") === "on",
    quintal_fundos: fd.get("quintal_fundos") === "on",
    quintal_gramado: fd.get("quintal_gramado") === "on",
    precisa_reforma: fd.get("precisa_reforma") === "on",
    visitada: fd.get("visitada") === "on",
    favorita: fd.get("favorita") === "on",
    origem: texto(fd, "origem") === "imobiliaria" ? "imobiliaria" : "particular",
    contato: texto(fd, "contato"),
    link: texto(fd, "link"),
    pros: texto(fd, "pros"),
    contras: texto(fd, "contras"),
    imagens,
  };
}

async function apagarImagens(urls: string[]) {
  if (!urls.length) return;
  try {
    await del(urls);
  } catch (err) {
    console.error("Falha ao apagar imagens do Blob", err);
  }
}

export async function salvarCasa(
  id: number | null,
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  await exigirLogin();
  const casa = lerCasa(fd);
  if (!casa.titulo) return { erro: "Dê um nome para a casa." };

  let destino: number;
  try {
    if (id == null) {
      destino = await criarCasa(casa);
    } else {
      const antiga = await buscarCasa(id);
      if (!antiga) return { erro: "Casa não encontrada." };
      await atualizarCasa(id, casa);
      await apagarImagens(antiga.imagens.filter((u) => !casa.imagens.includes(u)));
      destino = id;
    }
  } catch (err) {
    console.error(err);
    return { erro: "Não foi possível salvar. Tente novamente." };
  }

  revalidatePath("/", "layout");
  redirect(`/casas/${destino}`);
}

export async function removerCasa(id: number) {
  await exigirLogin();
  await apagarImagens(await excluirCasa(id));
  revalidatePath("/", "layout");
  redirect("/");
}

export async function favoritar(id: number) {
  await exigirLogin();
  await alternarFavorita(id);
  revalidatePath("/", "layout");
}

export async function entrar(_prev: FormState, fd: FormData): Promise<FormState> {
  if (!senhaConfigurada()) redirect("/");
  if (texto(fd, "senha") !== process.env.APP_PASSWORD) {
    return { erro: "Senha incorreta." };
  }
  (await cookies()).set(AUTH_COOKIE, await tokenEsperado(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  redirect("/");
}

export async function sair() {
  (await cookies()).delete(AUTH_COOKIE);
  redirect("/login");
}
