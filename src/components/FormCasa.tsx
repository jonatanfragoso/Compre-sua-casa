"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { salvarCasa, type FormState } from "@/app/actions";
import type { Casa } from "@/lib/casas";
import { formatarNumero } from "@/lib/format";
import { UploadImagens } from "./UploadImagens";

export function FormCasa({ casa, bairros }: { casa?: Casa; bairros: string[] }) {
  const [state, action, salvando] = useActionState<FormState, FormData>(
    salvarCasa.bind(null, casa?.id ?? null),
    {},
  );
  const [imagens, setImagens] = useState<string[]>(casa?.imagens ?? []);
  const [enviando, setEnviando] = useState(false);

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="imagens" value={JSON.stringify(imagens)} />

      <Secao titulo="Fotos">
        <UploadImagens imagens={imagens} onChange={setImagens} onEnviando={setEnviando} />
      </Secao>

      <Secao titulo="Identificação">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo rotulo="Nome / apelido da casa *" className="sm:col-span-2">
            <input name="titulo" required defaultValue={casa?.titulo} placeholder="Ex.: Casa amarela da Rua das Flores" className="campo" />
          </Campo>
          <Campo rotulo="Bairro">
            <input name="bairro" list="bairros" defaultValue={casa?.bairro} className="campo" />
            <datalist id="bairros">
              {bairros.map((b) => (
                <option key={b} value={b} />
              ))}
            </datalist>
          </Campo>
          <Campo rotulo="Endereço">
            <input name="endereco" defaultValue={casa?.endereco} className="campo" />
          </Campo>
          <Campo rotulo="Valor (R$)">
            <input name="valor" inputMode="decimal" defaultValue={formatarNumero(casa?.valor ?? null)} placeholder="450.000" className="campo" />
          </Campo>
          <Campo rotulo="Tamanho do terreno (m²)">
            <input name="terreno_m2" inputMode="decimal" defaultValue={formatarNumero(casa?.terreno_m2 ?? null)} placeholder="300" className="campo" />
          </Campo>
        </div>
      </Secao>

      <Secao titulo="Cômodos">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Contador nome="quartos" rotulo="Quartos" valor={casa?.quartos} />
          <Contador nome="salas" rotulo="Salas" valor={casa?.salas} />
          <Contador nome="banheiros" rotulo="Banheiros" valor={casa?.banheiros} />
          <Contador nome="vagas" rotulo="Vagas de garagem" valor={casa?.vagas} />
        </div>
      </Secao>

      <Secao titulo="Características">
        <div className="grid gap-2 sm:grid-cols-2">
          <Opcao nome="churrasqueira" rotulo="Tem churrasqueira" marcado={casa?.churrasqueira} />
          <Opcao nome="piscina" rotulo="Tem piscina" marcado={casa?.piscina} />
          <Opcao nome="quintal_fundos" rotulo="Tem quintal atrás" marcado={casa?.quintal_fundos} />
          <Opcao nome="quintal_gramado" rotulo="Quintal com gramado" marcado={casa?.quintal_gramado} />
          <Opcao nome="precisa_reforma" rotulo="Precisa de reforma" marcado={casa?.precisa_reforma} />
        </div>
      </Secao>

      <Secao titulo="Negociação">
        <div className="grid gap-4 sm:grid-cols-2">
          <fieldset>
            <legend className="rotulo">Vendida por</legend>
            <div className="flex gap-2">
              {(["particular", "imobiliaria"] as const).map((o) => (
                <label key={o} className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm has-[:checked]:border-emerald-600 has-[:checked]:bg-emerald-50">
                  <input type="radio" name="origem" value={o} defaultChecked={(casa?.origem ?? "particular") === o} className="accent-emerald-700" />
                  {o === "particular" ? "Particular" : "Imobiliária"}
                </label>
              ))}
            </div>
          </fieldset>
          <Campo rotulo="Contato (corretor, telefone...)">
            <input name="contato" defaultValue={casa?.contato} className="campo" />
          </Campo>
          <Campo rotulo="Link do anúncio" className="sm:col-span-2">
            <input name="link" type="url" defaultValue={casa?.link} placeholder="https://" className="campo" />
          </Campo>
          <div className="grid gap-2 sm:col-span-2 sm:grid-cols-2">
            <Opcao nome="visitada" rotulo="Já visitamos" marcado={casa?.visitada} />
            <Opcao nome="favorita" rotulo="Favorita ❤" marcado={casa?.favorita} />
          </div>
        </div>
      </Secao>

      <Secao titulo="Observações">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo rotulo="👍 Prós">
            <textarea name="pros" rows={5} defaultValue={casa?.pros} className="campo" placeholder="O que gostamos..." />
          </Campo>
          <Campo rotulo="👎 Contras">
            <textarea name="contras" rows={5} defaultValue={casa?.contras} className="campo" placeholder="O que não gostamos..." />
          </Campo>
        </div>
      </Secao>

      {state.erro && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{state.erro}</p>
      )}

      <div className="sticky bottom-0 -mx-4 flex gap-2 border-t border-stone-200 bg-stone-50/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0">
        <button className="btn-primario flex-1 sm:flex-none" disabled={salvando || enviando}>
          {salvando ? "Salvando..." : enviando ? "Aguarde as fotos..." : "Salvar casa"}
        </button>
        <Link href={casa ? `/casas/${casa.id}` : "/"} className="btn-secundario">
          Cancelar
        </Link>
      </div>
    </form>
  );
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="mb-4 text-lg font-semibold">{titulo}</h2>
      {children}
    </section>
  );
}

function Campo({
  rotulo,
  children,
  className = "",
}: {
  rotulo: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="rotulo">{rotulo}</span>
      {children}
    </label>
  );
}

function Contador({ nome, rotulo, valor = 0 }: { nome: string; rotulo: string; valor?: number }) {
  const [n, setN] = useState(valor);
  const botao = "grid size-10 shrink-0 place-items-center rounded-lg border border-stone-300 bg-white text-lg font-semibold hover:bg-stone-100";
  return (
    <div>
      <span className="rotulo">{rotulo}</span>
      <div className="flex items-center gap-1">
        <button type="button" className={botao} onClick={() => setN((x) => Math.max(0, x - 1))} aria-label={`Menos ${rotulo}`}>
          −
        </button>
        <input
          name={nome}
          value={n}
          onChange={(e) => setN(Math.max(0, parseInt(e.target.value, 10) || 0))}
          inputMode="numeric"
          className="campo px-1 text-center"
          aria-label={rotulo}
        />
        <button type="button" className={botao} onClick={() => setN((x) => x + 1)} aria-label={`Mais ${rotulo}`}>
          +
        </button>
      </div>
    </div>
  );
}

function Opcao({ nome, rotulo, marcado }: { nome: string; rotulo: string; marcado?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm has-[:checked]:border-emerald-600 has-[:checked]:bg-emerald-50">
      <input type="checkbox" name={nome} defaultChecked={marcado} className="size-4 accent-emerald-700" />
      {rotulo}
    </label>
  );
}
