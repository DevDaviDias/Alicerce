import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-8 py-6 max-w-5xl mx-auto w-full">
        <span className="font-display text-xl tracking-tight">Alicerce</span>
        <nav className="flex gap-6 text-sm text-muted">
          <Link href="/login" className="hover:text-ink transition-colors">
            Entrar
          </Link>
          <Link
            href="/registro"
            className="px-4 py-2 rounded-md bg-moss text-ink hover:bg-moss-light transition-colors"
          >
            Começar
          </Link>
        </nav>
      </header>

      <section className="flex-1 flex items-center">
        <div className="max-w-5xl mx-auto px-8 py-20 grid md:grid-cols-[1.2fr_1fr] gap-16 items-center">
          <div>
            <h1 className="font-display text-5xl md:text-6xl leading-[1.05] mb-6">
              Quatro pilares.
              <br />
              Uma base sólida.
            </h1>
            <p className="text-muted text-lg max-w-md leading-relaxed mb-8">
              Treino, dinheiro, estudo e rotina — organizados num único lugar,
              sem enfeite. Você registra, o Alicerce mostra onde você está
              construindo e onde está rachando.
            </p>
            <Link
              href="/registro"
              className="inline-block px-6 py-3 rounded-md bg-bronze text-base font-medium hover:bg-bronze-light transition-colors"
            >
              Criar minha conta
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Treino", valor: "4/5", nota: "esta semana" },
              { label: "Estudo", valor: "12h", nota: "este mês" },
              { label: "Saldo", valor: "+R$ 340", nota: "este mês" },
              { label: "Sequência", valor: "18 dias", nota: "hábito diário" },
            ].map((item) => (
              <div
                key={item.label}
                className="border border-border rounded-lg p-5 bg-surface"
              >
                <p className="text-xs text-muted mb-2">{item.label}</p>
                <p className="font-display text-2xl mb-1">{item.valor}</p>
                <p className="text-xs text-muted">{item.nota}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-8 py-6 text-center text-xs text-muted">
        Alicerce — construído com Next.js e Firebase.
      </footer>
    </main>
  );
}
