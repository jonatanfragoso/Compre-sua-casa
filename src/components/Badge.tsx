export function Badge({
  children,
  tom = "neutro",
}: {
  children: React.ReactNode;
  tom?: "neutro" | "verde" | "ambar" | "azul";
}) {
  const cores = {
    neutro: "bg-stone-100 text-stone-700",
    verde: "bg-emerald-50 text-emerald-800",
    ambar: "bg-amber-50 text-amber-800",
    azul: "bg-sky-50 text-sky-800",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cores[tom]}`}>
      {children}
    </span>
  );
}
