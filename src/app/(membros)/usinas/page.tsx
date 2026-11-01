import Link from "next/link";
import { ExploreTabs } from "@/components/explore-tabs";
import { PlantsMapSection } from "@/components/maps/plants-map-section";
import { Badge, Container, DataUnavailable, PageHeader } from "@/components/ui";
import { getPlants, type PlantFilters } from "@/lib/api/queries";
import type { Source } from "@/lib/api/types";
import { formatSource, formatNumber } from "@/lib/format";
import { STATES, findState, subsystemName } from "@/lib/geo";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Buscar usinas eólicas e solares",
  description:
    "Encontre uma usina ou conjunto eólico ou solar e veja quanta energia foi cortada pelo ONS, mês a mês.",
  path: "/usinas",
});

const PAGE_SIZE = 20;

const URL_SOURCE: Record<string, Source> = { eolica: "wind", solar: "solar" };
const SOURCE_IN_URL: Record<Source, string> = { wind: "eolica", solar: "solar" };

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseFilters(sp: SearchParams): Required<Pick<PlantFilters, "page">> & PlantFilters {
  const search = first(sp.busca)?.trim().slice(0, 100) || undefined;
  const state = findState(first(sp.uf))?.state;
  const source = URL_SOURCE[first(sp.fonte) ?? ""];
  const page = Math.max(1, Math.min(10_000, Number.parseInt(first(sp.pagina) ?? "1", 10) || 1));
  return { search, state, source, page };
}

function pageHref(filters: PlantFilters, page: number) {
  const params = new URLSearchParams();
  if (filters.search) params.set("busca", filters.search);
  if (filters.state) params.set("uf", filters.state);
  if (filters.source) params.set("fonte", SOURCE_IN_URL[filters.source]);
  if (page > 1) params.set("pagina", String(page));
  const qs = params.toString();
  return qs ? `/usinas?${qs}` : "/usinas";
}

export default async function PlantsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const mapView = first(sp.vista) === "mapa";
  // The list is the default (and the only view for a phone user who never asks for the map).
  const result = mapView ? null : await getPlants({ ...filters, pageSize: PAGE_SIZE });

  const inputClass = "w-full rounded-md border border-line bg-surface px-3 py-2 text-base";

  return (
    <Container>
      <ExploreTabs active="usinas" />
      <PageHeader title="Usinas e conjuntos">
        <p>
          Busque pelo nome. Conjuntos reúnem várias usinas ligadas ao mesmo ponto da rede — o ONS
          publica o corte por conjunto, e nós o distribuímos entre as usinas.
        </p>
      </PageHeader>

      <nav aria-label="Forma de ver as usinas" className="mb-5">
        <ul className="border-grid inline-flex gap-1 rounded-full border bg-[var(--color-surface)] p-1 text-sm font-medium">
          {(
            [
              ["lista", "Lista", "/usinas"],
              ["mapa", "Mapa", "/usinas?vista=mapa"],
            ] as const
          ).map(([key, label, href]) => {
            const current = (key === "mapa") === mapView;
            return (
              <li key={key}>
                <Link
                  href={href}
                  aria-current={current ? "page" : undefined}
                  className={`block rounded-full px-4 py-1.5 ${
                    current
                      ? "bg-accent text-on-accent"
                      : "text-ink-2 hover:bg-surface-2 hover:text-ink"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {mapView ? <PlantsMapSection searchParams={sp} /> : null}

      {mapView ? null : (
        <>
          <form
            method="get"
            action="/usinas"
            role="search"
            className="grid grid-cols-1 gap-3 rounded-lg border border-[var(--color-grid)] bg-[var(--color-surface)] p-4 sm:grid-cols-[1fr_auto_auto_auto] sm:items-end"
          >
            <div>
              <label htmlFor="search" className="mb-1 block text-sm font-medium">
                Nome da usina
              </label>
              <input
                id="search"
                name="busca"
                type="search"
                defaultValue={filters.search}
                placeholder="Ex.: São Fernando"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="state" className="mb-1 block text-sm font-medium">
                Estado
              </label>
              <select
                id="state"
                name="uf"
                defaultValue={filters.state ?? ""}
                className={inputClass}
              >
                <option value="">Todos</option>
                {STATES.map((e) => (
                  <option key={e.state} value={e.state}>
                    {e.state} — {e.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="source" className="mb-1 block text-sm font-medium">
                Fonte
              </label>
              <select
                id="source"
                name="fonte"
                defaultValue={filters.source ? SOURCE_IN_URL[filters.source] : ""}
                className={inputClass}
              >
                <option value="">Todas</option>
                <option value="eolica">Eólica</option>
                <option value="solar">Solar</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-accent text-on-accent hover:bg-accent-strong rounded-md px-4 py-2 font-semibold"
            >
              Buscar
            </button>
          </form>

          <div className="mt-6">
            {!result || !result.ok ? (
              <DataUnavailable />
            ) : result.data.items.length === 0 ? (
              <DataUnavailable title="Nenhuma usina encontrada">
                Tente outro nome ou remova os filtros.
              </DataUnavailable>
            ) : (
              <>
                <p className="mb-3 text-sm text-[var(--color-ink-2)]" aria-live="polite">
                  {formatNumber(result.data.total, 0)}{" "}
                  {result.data.total === 1 ? "resultado" : "resultados"}
                </p>
                <ul className="divide-y divide-[var(--color-grid)] rounded-lg border border-[var(--color-grid)] bg-[var(--color-surface)]">
                  {result.data.items.map((u) => (
                    <li key={u.id} className="px-4 py-3">
                      <Link
                        href={`/usinas/${u.slug}`}
                        className="font-medium text-[var(--color-accent)] underline"
                      >
                        {u.name}
                      </Link>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[var(--color-ink-2)]">
                        <Badge>{u.kind === "cluster" ? "Conjunto" : "Usina"}</Badge>
                        <span>{formatSource(u.source)}</span>
                        <span aria-hidden>·</span>
                        <span>{u.state}</span>
                        <span aria-hidden>·</span>
                        <span>{subsystemName(u.subsystem)}</span>
                        {u.capacity_mw !== null ? (
                          <>
                            <span aria-hidden>·</span>
                            <span>{formatNumber(u.capacity_mw, 1)} MW</span>
                          </>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
                <Pagination
                  filters={filters}
                  page={result.data.page}
                  totalPages={Math.max(
                    1,
                    Math.ceil(result.data.total / (result.data.page_size || PAGE_SIZE)),
                  )}
                />
              </>
            )}
          </div>
        </>
      )}
    </Container>
  );
}

function Pagination({
  filters,
  page,
  totalPages,
}: {
  filters: PlantFilters;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;
  const linkClass =
    "rounded-md border border-line bg-surface px-3 py-1.5 text-sm hover:border-[var(--color-accent)]";
  return (
    <nav aria-label="Paginação" className="mt-4 flex items-center justify-between gap-3">
      {page > 1 ? (
        <Link href={pageHref(filters, page - 1)} className={linkClass} rel="prev">
          ← Anterior
        </Link>
      ) : (
        <span />
      )}
      <span className="text-sm text-[var(--color-ink-2)]">
        Página {formatNumber(page, 0)} de {formatNumber(totalPages, 0)}
      </span>
      {page < totalPages ? (
        <Link href={pageHref(filters, page + 1)} className={linkClass} rel="next">
          Próxima →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
