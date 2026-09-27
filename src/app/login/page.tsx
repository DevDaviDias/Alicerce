"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { entrar, entrarComGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setEnviando(true);
    try {
      await entrar(email, senha);
      router.push("/dashboard");
    } catch {
      setErro("E-mail ou senha incorretos.");
    } finally {
      setEnviando(false);
    }
  }

  async function handleGoogle() {
    setErro("");
    try {
      await entrarComGoogle();
      router.push("/dashboard");
    } catch {
      setErro("Não foi possível entrar com o Google.");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-xl">
          Alicerce
        </Link>
        <h1 className="font-display text-2xl mt-8 mb-1">Entrar</h1>
        <p className="text-muted text-sm mb-8">
          Continue de onde você parou.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            required
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-surface border border-border rounded-md px-4 py-3 text-sm placeholder:text-muted focus:border-moss"
          />
          <input
            type="password"
            required
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="bg-surface border border-border rounded-md px-4 py-3 text-sm placeholder:text-muted focus:border-moss"
          />

          {erro && <p className="text-sm text-red-400">{erro}</p>}

          <button
            type="submit"
            disabled={enviando}
            className="bg-moss hover:bg-moss-light transition-colors rounded-md py-3 text-sm font-medium disabled:opacity-60"
          >
            {enviando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-border flex-1" />
          <span className="text-xs text-muted">ou</span>
          <div className="h-px bg-border flex-1" />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full border border-border rounded-md py-3 text-sm hover:bg-surface transition-colors"
        >
          Continuar com Google
        </button>

        <p className="text-sm text-muted mt-8">
          Ainda não tem conta?{" "}
          <Link href="/registro" className="text-ink underline">
            Criar conta
          </Link>
        </p>
      </div>
    </main>
  );
}
