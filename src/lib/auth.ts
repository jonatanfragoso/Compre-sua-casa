// Proteção simples por senha única. Se APP_PASSWORD não estiver definida,
// o app fica aberto (útil para rodar localmente).

export const AUTH_COOKIE = "casa_auth";

export function senhaConfigurada() {
  return Boolean(process.env.APP_PASSWORD);
}

export async function tokenEsperado(): Promise<string> {
  const data = new TextEncoder().encode(
    `compre-sua-casa:${process.env.APP_PASSWORD ?? ""}`,
  );
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}

export async function tokenValido(token: string | undefined) {
  if (!senhaConfigurada()) return true;
  return token === (await tokenEsperado());
}
