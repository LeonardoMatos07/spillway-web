"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { MapAttribution } from "@/components/maps/map-attribution";
import { MapView } from "@/components/maps/map-view";
import type { PointsCollection, PointsMapProps } from "@/components/maps/points-map";
import { SortableTable, type Column } from "@/components/maps/sortable-table";
import type { PlantGeoCollection, PlantGeoFeature, Source, UnlocatedPlant } from "@/lib/api/types";
import {
  formatEnergy,
  formatLongMonth,
  formatNumber,
  formatPercent,
  formatSource,
} from "@/lib/format";
import { STATES } from "@/lib/geo";
import { CURTAILMENT_LABELS, CURTAILMENT_LIMITS, spreadCoincident } from "@/lib/maps";

const loadEngine = () => import("@/components/maps/points-map");
const COLOR_VARS = ["--map-c0", "--map-c1", "--map-c2", "--map-c3", "--map-c4"];

export interface PlantsFilters {
  month: string | null;
  source: Source | "";
  state: string;
}

export function PlantsMapPanel({
  initial,
  months,
  initialFilters,
}: {
  initial: PlantGeoCollection;
  /** Months with data, newest first. */
  months: string[];
  initialFilters: PlantsFilters;
}) {
  const [data, setData] = useState(initial);
  const [filters, setFilters] = useState(initialFilters);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cache = useRef(new Map<string, PlantGeoCollection>());

  const load = useCallback(async (next: PlantsFilters) => {
    const key = `${next.month ?? ""}|${next.source}|${next.state}`;
    let result = cache.current.get(key);
    if (!result) {
      setLoading(true);
      setError(null);
      try {
        const qs = new URLSearchParams();
        if (next.month) qs.set("mes", next.month);
        if (next.source) qs.set("fonte", next.source);
        if (next.state) qs.set("uf", next.state);
        const response = await fetch(`/api/mapas/usinas?${qs}`);
        if (!response.ok) throw new Error(String(response.status));
        result = (await response.json()) as PlantGeoCollection;
        cache.current.set(key, result);
      } catch {
        setError("Não foi possível carregar este filtro. Tente de novo.");
        setLoading(false);
        return;
      }
      setLoading(false);
    }
    setFilters(next);
    setData(result);
    setSelected(null);
    const params = new URLSearchParams(window.location.search);
    for (const [name, value] of [
      ["mes", next.month],
      ["fonte", next.source],
      ["uf", next.state],
    ] as const) {
      if (value) params.set(name, value);
      else params.delete(name);
    }
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, []);

  const features = data.features;
  const placed = useMemo(
    () =>
      spreadCoincident(
        features.map((f) => ({
          id: f.properties.id,
          lon: f.geometry.coordinates[0],
          lat: f.geometry.coordinates[1],
        })),
      ),
    [features],
  );
  const points = useMemo<PointsCollection>(
    () => ({
      type: "FeatureCollection",
      features: features.map((f) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: placed.get(f.properties.id) ?? f.geometry.coordinates,
        },
        properties: {
          id: f.properties.id,
          capacity_mw: f.properties.capacity_mw,
          curtailment_pct: f.properties.curtailment_pct,
          official: f.properties.location_precision === "official" ? 1 : 0,
        },
      })),
    }),
    [features, placed],
  );
  const maxCapacity = Math.max(1, ...features.map((f) => f.properties.capacity_mw ?? 0));
  const chosen = features.find((f) => f.properties.id === selected)?.properties;
  const monthLabel = data.meta.as_of ? formatLongMonth(data.meta.as_of.slice(0, 7)) : "sem mês";
  const hasOfficial = features.some((f) => f.properties.location_precision === "official");
  const summary = `${features.length} usinas com posição no mapa em ${monthLabel}; ${data.unlocated.length} sem localização. A posição é a da subestação de conexão, aproximada.`;

  const columns: Column<PlantGeoFeature>[] = [
    {
      key: "name",
      label: "Usina",
      firstDirection: "asc",
      sortValue: (r) => r.properties.name,
      render: (r) => (
        <button
          type="button"
          className="text-ink hover:text-accent text-left font-medium hover:underline"
          onClick={() => setSelected(r.properties.id)}
        >
          {r.properties.name}
        </button>
      ),
    },
    {
      key: "uf",
      label: "UF",
      firstDirection: "asc",
      sortValue: (r) => r.properties.state,
      render: (r) => r.properties.state,
    },
    {
      key: "pct",
      label: "% de corte",
      align: "right",
      sortValue: (r) => r.properties.curtailment_pct,
      render: (r) => formatPercent(r.properties.curtailment_pct, 1, 1),
    },
    {
      key: "mwh",
      label: "Energia cortada",
      align: "right",
      secondary: true,
      sortValue: (r) => r.properties.curtailed_mwh,
      render: (r) => formatEnergy(r.properties.curtailed_mwh),
    },
    {
      key: "mw",
      label: "Capacidade (MW)",
      align: "right",
      secondary: true,
      sortValue: (r) => r.properties.capacity_mw,
      render: (r) => formatNumber(r.properties.capacity_mw, 0),
    },
    {
      key: "precision",
      label: "Posição",
      secondary: true,
      render: (r) => (r.properties.location_precision === "official" ? "oficial" : "aproximada"),
    },
  ];

  const mapProps: PointsMapProps = {
    label: "Usinas eólicas e solares: tamanho pela capacidade, cor pelo percentual cortado",
    points,
    idProperty: "id",
    radiusProperty: "capacity_mw",
    radiusMax: maxCapacity,
    radiusRange: [3, 14],
    colorProperty: "curtailment_pct",
    colorLimits: CURTAILMENT_LIMITS,
    colorVars: COLOR_VARS,
    ringProperty: "official",
    selected,
    onSelect: setSelected,
  };

  const unlocatedColumns: Column<UnlocatedPlant>[] = [
    {
      key: "name",
      label: "Usina",
      firstDirection: "asc",
      sortValue: (r) => r.name,
      render: (r) => (
        <Link
          className="text-ink hover:text-accent font-medium hover:underline"
          href={`/usinas/${r.slug}`}
        >
          {r.name}
        </Link>
      ),
    },
    {
      key: "uf",
      label: "UF",
      sortValue: (r) => r.state,
      firstDirection: "asc",
      render: (r) => r.state,
    },
    {
      key: "cp",
      label: "Ponto de conexão",
      secondary: true,
      sortValue: (r) => r.connection_point ?? "",
      firstDirection: "asc",
      render: (r) => r.connection_point ?? "-",
    },
    {
      key: "src",
      label: "Fonte",
      secondary: true,
      render: (r) => formatSource(r.source),
    },
  ];

  return (
    <div>
      <form
        className="border-grid bg-surface flex flex-wrap items-end gap-x-4 gap-y-3 rounded-2xl border p-4"
        onSubmit={(event) => event.preventDefault()}
        aria-label="Filtros do mapa"
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-ink-2 font-medium">Mês</span>
          <select
            className="border-line bg-surface min-h-10 rounded-lg border px-2"
            value={filters.month ?? data.meta.as_of?.slice(0, 7) ?? ""}
            disabled={loading}
            onChange={(event) => void load({ ...filters, month: event.target.value })}
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {formatLongMonth(m)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-ink-2 font-medium">Fonte</span>
          <select
            className="border-line bg-surface min-h-10 rounded-lg border px-2"
            value={filters.source}
            disabled={loading}
            onChange={(event) =>
              void load({ ...filters, source: event.target.value as Source | "" })
            }
          >
            <option value="">Eólica e solar</option>
            <option value="wind">Eólica</option>
            <option value="solar">Solar</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-ink-2 font-medium">Estado</span>
          <select
            className="border-line bg-surface min-h-10 rounded-lg border px-2"
            value={filters.state}
            disabled={loading}
            onChange={(event) => void load({ ...filters, state: event.target.value })}
          >
            <option value="">Todos</option>
            {STATES.map((s) => (
              <option key={s.state} value={s.state}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      </form>
      {error ? (
        <p role="alert" className="text-danger mt-3 text-sm">
          {error}
        </p>
      ) : null}
      <p role="status" aria-live="polite" className="sr-only">
        {summary}
      </p>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <figure className="border-grid bg-surface shadow-card rounded-2xl border p-3">
          <figcaption className="text-ink px-1 pb-2 text-sm font-semibold">
            % de corte por usina, {monthLabel} (posição aproximada pela subestação)
          </figcaption>
          <div className={loading ? "opacity-70 transition-opacity" : undefined}>
            <MapView
              label="Usinas eólicas e solares do Brasil"
              load={loadEngine}
              props={mapProps}
              aspect="4 / 3"
              requires="webgl"
              fallback="O seu navegador não conseguiu abrir o mapa (WebGL). Use a tabela abaixo, que tem os mesmos dados."
            />
          </div>
        </figure>
        <div className="space-y-4">
          <section aria-label="Legenda" className="border-grid bg-surface rounded-2xl border p-4">
            <h2 className="text-ink text-sm font-semibold">Legenda</h2>
            <p className="text-muted mt-1 text-xs">
              Cor: % de energia cortada no mês. Tamanho: capacidade da usina.
            </p>
            <ol className="mt-3 space-y-1.5 text-sm">
              {COLOR_VARS.map((name, i) => (
                <li key={name} className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="border-line inline-block size-4 shrink-0 rounded border"
                    style={{ background: `var(${name})` }}
                  />
                  <span className="tabular">{CURTAILMENT_LABELS[i]}</span>
                </li>
              ))}
              <li className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="border-line inline-block size-4 shrink-0 rounded border"
                  style={{ background: "var(--map-nodata)" }}
                />
                <span>Sem registro no mês</span>
              </li>
            </ol>
            <p className="text-ink-2 mt-3 text-xs leading-5">
              <strong>Posição aproximada pela subestação:</strong> o ponto é o da subestação de
              conexão, não o da usina. Usinas da mesma subestação são espalhadas ao redor dela só
              para não se esconderem.
              {hasOfficial
                ? " Círculo com contorno grosso: posição oficial, publicada pelo regulador."
                : ""}
            </p>
          </section>
          <section
            aria-label="Usina selecionada"
            className="border-grid bg-surface rounded-2xl border p-4"
          >
            <h2 className="text-ink text-sm font-semibold">Usina selecionada</h2>
            {chosen ? (
              <dl className="mt-2 space-y-1 text-sm">
                <dt className="text-ink font-semibold">{chosen.name}</dt>
                <dd>
                  {formatSource(chosen.source)} · {chosen.state}
                  <br />% de corte: {formatPercent(chosen.curtailment_pct, 1, 1)}
                  <br />
                  Energia cortada: {formatEnergy(chosen.curtailed_mwh)}
                  <br />
                  Capacidade: {formatNumber(chosen.capacity_mw, 0)} MW
                  <br />
                  Ponto de conexão: {chosen.connection_point ?? "-"}
                  <br />
                  Posição:{" "}
                  {chosen.location_precision === "official"
                    ? "oficial"
                    : "aproximada pela subestação de conexão"}
                </dd>
                <dd className="flex gap-4">
                  <Link className="text-accent underline" href={`/usinas/${chosen.slug}`}>
                    Ver a usina
                  </Link>
                  <button
                    type="button"
                    className="text-accent underline"
                    onClick={() => setSelected(null)}
                  >
                    Limpar seleção
                  </button>
                </dd>
              </dl>
            ) : (
              <p className="text-muted mt-2 text-sm">
                Toque ou clique em um círculo, ou escolha um nome na tabela.
              </p>
            )}
          </section>
        </div>
      </div>

      <p className="text-ink-2 mt-5 text-sm leading-6">{summary}</p>

      <section className="mt-6" aria-labelledby="plants-table-title">
        <h2 id="plants-table-title" className="text-ink text-lg font-semibold">
          Tabela das usinas
        </h2>
        <div className="mt-3">
          <SortableTable
            rows={features}
            columns={columns}
            rowKey={(r) => r.properties.id}
            caption="Usinas com posição: percentual cortado, energia cortada, capacidade e tipo de posição. Ordene pelos cabeçalhos."
            initialSort={{ key: "pct", desc: true }}
            selectedKey={selected}
          />
        </div>
      </section>

      <section className="mt-6" aria-labelledby="unlocated-title">
        <details className="border-grid bg-surface rounded-2xl border p-4">
          <summary id="unlocated-title" className="text-ink cursor-pointer text-sm font-semibold">
            Sem localização ({data.unlocated.length})
          </summary>
          <p className="text-muted mt-2 mb-3 text-xs">
            Usinas cujo ponto de conexão não foi identificado entre as subestações do cadastro do
            ONS (ou aponta para mais de um lugar). Elas não aparecem no mapa, mas estão na busca de
            usinas.
          </p>
          {data.unlocated.length > 0 ? (
            <SortableTable
              rows={data.unlocated}
              columns={unlocatedColumns}
              rowKey={(r) => r.id}
              caption="Usinas sem localização no mapa."
              initialSort={{ key: "name", desc: false }}
              pageSize={50}
            />
          ) : null}
        </details>
      </section>

      <ul className="text-muted mt-4 list-disc space-y-1 pl-5 text-xs">
        {data.meta.warnings.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>
      <MapAttribution dataset="Curtailment de usinas eólicas e solares" />
    </div>
  );
}
