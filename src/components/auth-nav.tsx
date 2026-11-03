"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { logoutAction } from "@/lib/auth-actions";
import { refreshSession, useSession } from "@/lib/session-store";

export function AuthNav() {
  const session = useSession();
  const pathname = usePathname();

  useEffect(() => {
    void refreshSession();
  }, [pathname]);

  if (session === null) return <div className="h-9 w-40" aria-hidden />;

  if (session.member) {
    const firstName = session.member.name.split(" ")[0];
    return (
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/conta"
          className="text-ink-2 hover:text-ink hidden font-medium sm:inline"
          title={session.member.email}
        >
          Olá, {firstName}
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="border-line hover:border-accent hover:bg-accent-soft rounded-full border px-3 py-1.5 font-medium"
          >
            Sair
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-xs sm:gap-2 sm:text-sm">
      <Link href="/entrar" className="text-ink-2 hover:text-ink px-1.5 py-1.5 font-medium sm:px-2">
        Entrar
      </Link>
      <Link
        href="/cadastro"
        className="bg-accent text-on-accent rounded-full px-3 py-1.5 font-semibold whitespace-nowrap hover:opacity-90 sm:px-3.5"
      >
        Criar conta
      </Link>
    </div>
  );
}
