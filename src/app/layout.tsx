import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import { sair } from "./actions";
import { senhaConfigurada } from "@/lib/auth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Compre sua casa",
  description: "Organize as casas que vocês estão avaliando para comprar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="grid size-8 place-items-center rounded-lg bg-emerald-700 text-white">
                <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
                  <path d="M12 3 2 11h3v9h5v-6h4v6h5v-9h3z" />
                </svg>
              </span>
              Compre sua casa
            </Link>
            <nav className="flex items-center gap-2">
              <Link href="/casas/nova" className="btn-primario">
                + Nova casa
              </Link>
              {senhaConfigurada() && (
                <form action={sair}>
                  <button className="btn text-stone-500 hover:text-stone-800">Sair</button>
                </form>
              )}
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
