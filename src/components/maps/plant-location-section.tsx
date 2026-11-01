import Link from "next/link";
import { PlantMiniMap } from "@/components/maps/plant-mini-map";
import { Section } from "@/components/ui";
import { getGeoPlants } from "@/lib/api/queries";

/** "Onde fica" on a plant page: a mini-map, or an honest note when the plant has no position. */
export async function PlantLocationSection({ slug }: { slug: string }) {
  const result = await getGeoPlants({ slug });
  if (!result.ok) return null;
  const plant = result.data.features[0];
  const unlocated = result.data.unlocated[0];
  if (!plant && !unlocated) return null;

  return (
    <Section
      id="localizacao"
      title="Onde fica"
      description={
        plant
          ? plant.properties.location_precision === "official"
            ? "Posição oficial publicada pelo regulador."
            : "Posição aproximada: é a da subestação de conexão, não a da usina."
          : undefined
      }
    >
      {plant ? (
        <>
          <div className="max-w-2xl">
            <PlantMiniMap plant={plant} />
          </div>
          <p className="text-muted mt-3 text-xs">
            Ponto de conexão: {plant.properties.connection_point ?? "não informado"}.{" "}
            <Link className="text-accent underline" href="/mapas/usinas">
              Abrir em Mapas
            </Link>
          </p>
        </>
      ) : (
        <p className="text-ink-2 text-sm">
          Esta usina não tem posição no mapa: não identificamos a subestação do ponto de conexão
          {unlocated?.connection_point ? ` (${unlocated.connection_point})` : ""}.
        </p>
      )}
    </Section>
  );
}
