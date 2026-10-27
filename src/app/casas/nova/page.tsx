import { Suspense } from "react";
import { FormCasa } from "@/components/FormCasa";
import { listarBairros } from "@/lib/casas";

export default function NovaCasa() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold">Nova casa</h1>
      <Suspense fallback={<p className="text-stone-500">Carregando...</p>}>
        <Formulario />
      </Suspense>
    </div>
  );
}

async function Formulario() {
  return <FormCasa bairros={await listarBairros()} />;
}
