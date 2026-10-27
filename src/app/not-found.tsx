import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mt-16 text-center">
      <p className="text-lg font-medium">Casa não encontrada.</p>
      <Link href="/" className="mt-3 inline-block text-emerald-700 underline">
        Voltar para a lista
      </Link>
    </div>
  );
}
