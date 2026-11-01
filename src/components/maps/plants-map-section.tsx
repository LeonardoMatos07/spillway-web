import { PlantsMapPanel, type PlantsFilters } from "@/components/maps/plants-map-panel";
import { DataUnavailable, Notice } from "@/components/ui";
import { getGeoPlants, getMonths } from "@/lib/api/queries";
import { findState } from "@/lib/geo";

const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** The plants map with its notice, for /mapas/usinas and the Mapa view of /usinas (members only). */
export async function PlantsMapSection({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const mes = first(searchParams.mes);
  const fonte = first(searchParams.fonte);
  const filters: PlantsFilters = {
    month: mes && MONTH_RE.test(mes) ? mes : null,
    source: fonte === "wind" || fonte === "solar" ? fonte : "",
    state: findState(first(searchParams.uf))?.state ?? "",
  };
  const [result, months] = await Promise.all([
    getGeoPlants({
      month: filters.month ?? undefined,
      source: filters.source || undefined,
      state: filters.state || undefined,
    }),
    getMonths(),
  ]);
  if (!result.ok || !months.ok) return <DataUnavailable />;
  return (
    <>
      <Notice>
        A posição é aproximada: é a da subestação à qual a usina se conecta, não a da usina. Usinas
        que não conseguimos ligar a uma subestação ficam na lista &ldquo;sem localização&rdquo;.
      </Notice>
      <div className="mt-5 pb-12">
        <PlantsMapPanel
          initial={result.data}
          months={months.data.months}
          initialFilters={filters}
        />
      </div>
    </>
  );
}
