import { GridMapPanel } from "@/components/maps/grid-map-panel";
import { DataUnavailable, Notice, PageHeader } from "@/components/ui";
import { getGeoLines, getGeoSubstations } from "@/lib/api/queries";
import { DEFAULT_VOLTAGE_MIN } from "@/lib/maps";
import { pageMetadata } from "@/lib/metadata";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Mapa da rede de transmissão",
  description:
    "Subestações e linhas de transmissão do Brasil por tensão, com filtro de tensão mínima e tabelas equivalentes. As linhas são esquemáticas, em segmento reto.",
  path: "/mapas/rede",
});

export default async function GridMapPage() {
  const [substations, lines] = await Promise.all([
    getGeoSubstations({ voltage_min: DEFAULT_VOLTAGE_MIN }),
    getGeoLines({ voltage_min: DEFAULT_VOLTAGE_MIN }),
  ]);
  return (
    <>
      <PageHeader title="Rede de transmissão, no mapa">
        <p>
          Onde estão as subestações e como a rede as liga, por nível de tensão. As tabelas abaixo do
          mapa trazem os mesmos dados.
        </p>
      </PageHeader>
      {substations.ok && lines.ok ? (
        <>
          <Notice>
            Esquemático: cada linha é desenhada em linha reta entre as duas subestações, não pelo
            traçado real. A posição das subestações é a publicada pelo ONS.
          </Notice>
          <div className="mt-5 pb-12">
            <GridMapPanel
              initial={{
                voltageMin: DEFAULT_VOLTAGE_MIN,
                substations: substations.data,
                lines: lines.data,
              }}
            />
          </div>
        </>
      ) : (
        <DataUnavailable />
      )}
    </>
  );
}
