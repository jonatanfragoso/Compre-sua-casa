"use client";

import { useActionState } from "react";
import { entrar, type FormState } from "../actions";

export function FormLogin() {
  const [state, action, entrando] = useActionState<FormState, FormData>(entrar, {});
  return (
    <form action={action} className="space-y-3">
      <input name="senha" type="password" required autoFocus className="campo" placeholder="Senha" />
      {state.erro && <p className="text-sm text-red-600">{state.erro}</p>}
      <button className="btn-primario w-full" disabled={entrando}>
        {entrando ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
