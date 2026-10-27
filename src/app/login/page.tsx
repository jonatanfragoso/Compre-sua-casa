import { FormLogin } from "./FormLogin";

export default function Login() {
  return (
    <div className="mx-auto mt-16 max-w-sm rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-bold">Entrar</h1>
      <p className="mb-4 mt-1 text-sm text-stone-500">Digite a senha para ver as casas.</p>
      <FormLogin />
    </div>
  );
}
