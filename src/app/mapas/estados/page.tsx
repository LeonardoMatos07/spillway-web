import { AccountInvite } from "@/components/maps/account-invite";
import { StatesMapPanel } from "@/components/maps/states-map-panel";
import { DataUnavailable, Notice, PageHeader } from "@/components/ui";
import { getGeoStatesCurtailment } from "@/lib/api/queries";
import { parseStatesMapParams } from "@/lib/maps";
import { getCurrentMember } from "@/lib/members";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Mapa do curtailment por estado",
  description:
    "Mapa do Brasil com o corte de energia eólica e solar em cada estado, mês a mês, com tabela equivalente.",
  path: "/mapas/estados",
  noIndex: true,
});

export default async function StatesMapPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = parseStatesMapParams(await searchParams);
  const member = await getCurrentMember();

  if (!member) {
    return (
      <AccountInvite
        title="Curtailment por estado, no mapa"
        what="o mapa do Brasil por mês, a tabela dos 27 estados e as páginas de cada estado e usina"
        next={`/mapas/estados${params.mes ? `?mes=${params.mes}` : ""}`}
      />
    );
  }

  const result = await getGeoStatesCurtailment(params.fonte, params.mes ?? undefined);

  return (
    <>
      <PageHeader title="Curtailment por estado, no mapa">
        <p>
          Quanto da energia eólica e solar foi cortada em cada estado, mês a mês. A tabela abaixo do
          mapa traz os mesmos números.
        </p>
      </PageHeader>
      {result.ok ? (
        <>
          <Notice>
            Os valores são os publicados pelo ONS somados por estado; estados sem usinas eólicas ou
            solares despachadas pelo ONS ficam sem cor.
          </Notice>
          <div className="mt-5 pb-12">
            <StatesMapPanel initial={result.data} initialMetric={params.metrica} />
          </div>
        </>
      ) : (
        <DataUnavailable />
      )}
    </>
  );
}
