const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const num = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });

export function formatarPreco(valor: number | null) {
  return valor == null ? "Sem preço" : brl.format(valor);
}

export function formatarArea(m2: number | null) {
  return m2 == null ? "—" : `${num.format(m2)} m²`;
}

export function formatarNumero(n: number | null) {
  return n == null ? "" : num.format(n);
}

export function plural(n: number, um: string, varios: string) {
  return `${n} ${n === 1 ? um : varios}`;
}
