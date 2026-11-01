import { AccountInvite } from "@/components/maps/account-invite";
import { PlantsMapSection } from "@/components/maps/plants-map-section";
import { PageHeader } from "@/components/ui";
import { getCurrentMember } from "@/lib/members";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Mapa das usinas eólicas e solares",
  description:
    "Mapa das usinas eólicas e solares com o percentual de energia cortada no mês, na posição aproximada da subestação de conexão, com tabela equivalente.",
  path: "/mapas/usinas",
  noIndex: true,
});

export default async function PlantsMapPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  if (!(await getCurrentMember())) {
    return (
      <AccountInvite
        title="Usinas, no mapa"
        what="o mapa das usinas eólicas e solares, com o corte de cada uma"
        next="/mapas/usinas"
      />
    );
  }
  return (
    <>
      <PageHeader title="Usinas, no mapa">
        <p>
          Cada círculo é uma usina eólica ou solar: o tamanho é a capacidade e a cor é o quanto da
          energia foi cortada no mês. A tabela abaixo do mapa traz os mesmos números.
        </p>
      </PageHeader>
      <PlantsMapSection searchParams={sp} />
    </>
  );
}
