import { ReservoirsMapPanel } from "@/components/maps/reservoirs-map-panel";
import { DataUnavailable, Notice, PageHeader } from "@/components/ui";
import { getGeoReservoirs } from "@/lib/api/queries";
import { pageMetadata } from "@/lib/metadata";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Mapa dos reservatórios",
  description:
    "Mapa dos reservatórios do Brasil: tamanho pelo volume útil e cor pela energia armazenada de cada dia, com tabela equivalente.",
  path: "/mapas/reservatorios",
});

export default async function ReservoirsMapPage() {
  const result = await getGeoReservoirs();
  return (
    <>
      <PageHeader title="Reservatórios, no mapa">
        <p>
          Onde ficam os reservatórios das usinas hidrelétricas e quanto cada um tem de energia
          armazenada. A tabela abaixo do mapa traz os mesmos números.
        </p>
      </PageHeader>
      {result.ok ? (
        <>
          <Notice>
            A posição é a publicada no cadastro do ONS, não o contorno do lago. Sem mapa-base: os
            limites dos estados dão a referência.
          </Notice>
          <div className="mt-5 pb-12">
            <ReservoirsMapPanel initial={result.data} />
          </div>
        </>
      ) : (
        <DataUnavailable />
      )}
    </>
  );
}
