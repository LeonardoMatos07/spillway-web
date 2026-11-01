import Link from "next/link";
import { Card, PageHeader } from "@/components/ui";

/** Shown instead of a members-only map layer: an invitation, not a redirect. */
export function AccountInvite({
  title,
  what,
  next,
}: {
  title: string;
  /** What the account unlocks, finishing the sentence "Com a conta você vê ...". */
  what: string;
  /** Where to come back after signing in. */
  next: string;
}) {
  return (
    <>
      <PageHeader title={title}>
        <p>Esta camada usa os mesmos dados das páginas da área de contas gratuitas.</p>
      </PageHeader>
      <Card className="max-w-2xl p-6">
        <h2 className="text-ink text-lg font-semibold">Crie uma conta gratuita para ver o mapa</h2>
        <p className="text-ink-2 mt-2 text-sm leading-6">
          Com a conta você vê {what}. Leva um minuto e não custa nada.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/cadastro"
            className="bg-accent text-on-accent inline-flex min-h-11 items-center rounded-lg px-5 font-medium"
          >
            Criar conta gratuita
          </Link>
          <Link
            href={`/entrar?proximo=${encodeURIComponent(next)}`}
            className="border-line hover:bg-surface-2 inline-flex min-h-11 items-center rounded-lg border px-5 font-medium"
          >
            Já tenho conta: entrar
          </Link>
        </div>
      </Card>
    </>
  );
}
