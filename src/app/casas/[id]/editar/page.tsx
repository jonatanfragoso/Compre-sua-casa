import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FormCasa } from "@/components/FormCasa";
import { buscarCasa, listarBairros } from "@/lib/casas";

export default function EditarCasa({ params }: PageProps<"/casas/[id]/editar">) {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold">Editar casa</h1>
      <Suspense fallback={<p className="text-stone-500">Carregando...</p>}>
        <Formulario params={params} />
      </Suspense>
    </div>
  );
}

async function Formulario({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [casa, bairros] = await Promise.all([buscarCasa(Number(id)), listarBairros()]);
  if (!casa) notFound();
  return <FormCasa casa={casa} bairros={bairros} />;
}
