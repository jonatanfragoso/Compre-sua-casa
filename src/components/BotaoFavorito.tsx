import { favoritar } from "@/app/actions";

export function BotaoFavorito({
  id,
  favorita,
  className = "",
}: {
  id: number;
  favorita: boolean;
  className?: string;
}) {
  return (
    <form action={favoritar.bind(null, id)} className={className}>
      <button
        title={favorita ? "Remover dos favoritos" : "Marcar como favorita"}
        aria-label={favorita ? "Remover dos favoritos" : "Marcar como favorita"}
        className={`grid size-9 place-items-center rounded-full bg-white/90 shadow transition hover:scale-110 ${
          favorita ? "text-rose-600" : "text-stone-400 hover:text-rose-500"
        }`}
      >
        <svg viewBox="0 0 24 24" className="size-5" fill={favorita ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M12 21s-7.5-4.6-9.5-9.3C1.1 8.4 3.2 5 6.6 5c2 0 3.4 1.1 4.4 2.5C12 6.1 13.4 5 15.4 5c3.4 0 5.5 3.4 4.1 6.7C19.5 16.4 12 21 12 21z" />
        </svg>
      </button>
    </form>
  );
}
