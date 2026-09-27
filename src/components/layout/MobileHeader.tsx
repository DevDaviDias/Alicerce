"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export function MobileHeader() {
  const { usuario } = useAuth();

  const iniciais = (usuario?.displayName || usuario?.email || "?")
    .charAt(0)
    .toUpperCase();

  return (
    <header
      className="md:hidden sticky top-0 z-30 bg-base/95 backdrop-blur border-b border-border flex items-center justify-between px-5 py-3.5"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <span className="font-display text-lg">Alicerce</span>
      <Link href="/perfil" className="shrink-0">
        {usuario?.photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={usuario.photoURL}
            alt=""
            className="w-8 h-8 rounded-full object-cover border border-border"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-moss-dark flex items-center justify-center text-xs font-medium">
            {iniciais}
          </div>
        )}
      </Link>
    </header>
  );
}
