"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { MapAttribution } from "@/components/maps/map-attribution";
import { MapView } from "@/components/maps/map-view";
import type {
  LinesCollection,
  PointsCollection,
  PointsMapProps,
} from "@/components/maps/points-map";
import { SortableTable, type Column } from "@/components/maps/sortable-table";
import type {
  LineCollection,
  LineFeature,
  SubstationCollection,
  SubstationFeature,
} from "@/lib/api/types";
import { formatNumber } from "@/lib/format";
import { VOLTAGE_LABELS, VOLTAGE_LIMITS, VOLTAGE_MIN_OPTIONS } from "@/lib/maps";

const loadEngine = () => import("@/components/maps/points-map");
const COLOR_VARS = ["--map-c0", "--map-c1", "--map-c2", "--map-c3", "--map-c4"];

export interface GridData {
  voltageMin: number;
  substations: SubstationCollection;
  lines: LineCollection;
}

type TableView = "substations" | "lines";

export function GridMapPanel({ initial }: { initial: GridData }) {
  const [data, setData] = useState(initial);
  const [selected, setSelected] = useState<string | null>(null);
  const [view, setView] = useState<TableView>("substations");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cache = useRef(new Map<number, GridData>([[initial.voltageMin, initial]]));

  const changeMin = useCallback(async (min: number) => {
    const known = cache.current.get(min);
    if (known) {
      setData(known);
      setSelected(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/mapas/rede?tensao=${min}`);
      if (!response.ok) throw new Error(String(response.status));
      const next = (await response.json()) as GridData;
      cache.current.set(min, next);
      setData(next);
      setSelected(null);
    } catch {
      setError("Não foi possível carregar esta tensão. Tente de novo.");
    } finally {
      setLoading(false);
    }
  }, []);

  const subs = data.substations.features;
  const lineFeatures = data.lines.features;

  const points = useMemo<PointsCollection>(
    () => ({
      type: "FeatureCollection",
      features: subs.map((f) => ({
        type: "Feature",
        geometry: f.geometry,
        properties: { id: f.properties.station_id, voltage_kv: f.properties.voltage_kv },
      })),
    }),
    [subs],
  );
  const lines = useMemo<LinesCollection>(
    () => ({
      type: "FeatureCollection",
      features: lineFeatures.map((f) => ({
        type: "Feature",
        geometry: f.geometry,
        properties: { voltage_kv: f.properties.voltage_kv },
      })),
    }),
    [lineFeatures],
  );

  const chosen = subs.find((f) => f.properties.station_id === selected)?.properties;
  const touching = chosen
    ? lineFeatures.filter(
        (l) =>
          l.properties.from_substation === chosen.name ||
          l.properties.to_substation === chosen.name,
      )
    : [];

  const summary = `${subs.length} subestações e ${lineFeatures.length} linhas no mapa, com tensão de ${
    VOLTAGE_MIN_OPTIONS.find((o) => o.value === data.voltageMin)?.label.toLowerCase() ?? ""
  }. As linhas são segmentos retos entre as subestações, não o traçado real.`;

  const subColumns: Column<SubstationFeature>[] = [
    {
      key: "name",
      label: "Subestação",
      firstDirection: "asc",
      sortValue: (r) => r.properties.name ?? "",
      render: (r) => (
        <button
          type="button"
          className="text-ink hover:text-accent text-left font-medium hover:underline"
          onClick={() => setSelected(r.properties.station_id)}
        >
          {r.properties.name ?? r.properties.station_id}
        </button>
      ),
    },
    {
      key: "kv",
      label: "Tensão (kV)",
      align: "right",
      sortValue: (r) => r.properties.voltage_kv,
      render: (r) => formatNumber(r.properties.voltage_kv, 0),
    },
    {
      key: "state",
      label: "UF",
      sortValue: (r) => r.properties.state ?? "",
      firstDirection: "asc",
      render: (r) => r.properties.state ?? "-",
    },
    {
      key: "agent",
      label: "Agente",
      secondary: true,
      sortValue: (r) => r.properties.main_agent ?? "",
      firstDirection: "asc",
      render: (r) => r.properties.main_agent ?? "-",
    },
  ];
  const lineColumns: Column<LineFeature>[] = [
    {
      key: "name",
      label: "Linha",
      firstDirection: "asc",
      sortValue: (r) => r.properties.name ?? "",
      render: (r) => r.properties.name ?? r.properties.equipment_code,
    },
    {
      key: "kv",
      label: "Tensão (kV)",
      align: "right",
      sortValue: (r) => r.properties.voltage_kv,
      render: (r) => formatNumber(r.properties.voltage_kv, 0),
    },
    {
      key: "km",
      label: "Extensão (km)",
      align: "right",
      secondary: true,
      sortValue: (r) => r.properties.length_km,
      render: (r) => formatNumber(r.properties.length_km, 0),
    },
  ];

  const mapProps: PointsMapProps = {
    label: "Rede de transmissão: subestações e linhas por tensão",
    points,
    lines,
    colorLines: true,
    idProperty: "id",
    radiusProperty: "voltage_kv",
    radiusMax: 800,
    radiusRange: [2.5, 6.5],
    colorProperty: "voltage_kv",
    colorLimits: VOLTAGE_LIMITS,
    colorVars: COLOR_VARS,
    selected,
    onSelect: setSelected,
  };

  return (
    <div>
      <form
        className="border-grid bg-surface flex flex-wrap items-end gap-4 rounded-2xl border p-4"
        onSubmit={(event) => event.preventDefault()}
        aria-label="Filtros do mapa"
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-ink-2 font-medium">Tensão mínima</span>
          <select
            className="border-line bg-surface min-h-10 rounded-lg border px-2"
            value={data.voltageMin}
            disabled={loading}
            onChange={(event) => void changeMin(Number(event.target.value))}
          >
            {VOLTAGE_MIN_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <p className="text-muted max-w-md text-xs">
          Tensões baixas somam milhares de pontos; o padrão mostra só as altas.
        </p>
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
            Rede de transmissão por tensão (linhas em linha reta, esquemáticas)
          </figcaption>
          <div className={loading ? "opacity-70 transition-opacity" : undefined}>
            <MapView
              label="Rede de transmissão do Brasil"
              load={loadEngine}
              props={mapProps}
              aspect="4 / 3"
              requires="webgl"
              fallback="O seu navegador não conseguiu abrir o mapa (WebGL). Use as tabelas abaixo, que têm os mesmos dados."
            />
          </div>
        </figure>
        <div className="space-y-4">
          <section aria-label="Legenda" className="border-grid bg-surface rounded-2xl border p-4">
            <h2 className="text-ink text-sm font-semibold">Legenda</h2>
            <p className="text-muted mt-1 text-xs">
              Cor e espessura: tensão. Círculos: subestações. Traços: linhas, em segmento reto entre
              as duas subestações (esquemático).
            </p>
            <ol className="mt-3 space-y-1.5 text-sm">
              {COLOR_VARS.map((name, i) => (
                <li key={name} className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="border-line inline-block size-4 shrink-0 rounded border"
                    style={{ background: `var(${name})` }}
                  />
                  <span>{VOLTAGE_LABELS[i]}</span>
                </li>
              ))}
            </ol>
          </section>
          <section
            aria-label="Subestação selecionada"
            className="border-grid bg-surface rounded-2xl border p-4"
          >
            <h2 className="text-ink text-sm font-semibold">Subestação selecionada</h2>
            {chosen ? (
              <dl className="mt-2 space-y-1 text-sm">
                <dt className="text-ink font-semibold">{chosen.name ?? chosen.station_id}</dt>
                <dd>
                  Tensão: {formatNumber(chosen.voltage_kv, 0)} kV
                  <br />
                  UF: {chosen.state ?? "-"}
                  <br />
                  Agente: {chosen.main_agent ?? "-"}
                  <br />
                  Subsistema: {chosen.subsystem ?? "-"}
                  <br />
                  Linhas ligadas a ela no mapa: {touching.length}
                </dd>
                <dd>
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
                Toque ou clique em uma subestação, ou escolha um nome na tabela.
              </p>
            )}
          </section>
        </div>
      </div>

      <p className="text-ink-2 mt-5 text-sm leading-6">{summary}</p>

      <section className="mt-6" aria-labelledby="grid-table-title">
        <h2 id="grid-table-title" className="text-ink text-lg font-semibold">
          Tabelas
        </h2>
        <div role="group" aria-label="Tabela" className="mt-3 inline-flex gap-1 text-sm">
          {(
            [
              ["substations", `Subestações (${subs.length})`],
              ["lines", `Linhas (${lineFeatures.length})`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={view === key}
              onClick={() => setView(key)}
              className={`min-h-9 rounded-full border px-4 ${
                view === key ? "bg-accent text-on-accent border-transparent" : "border-line"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="mt-3">
          {view === "substations" ? (
            <SortableTable
              rows={subs}
              columns={subColumns}
              rowKey={(r) => r.properties.station_id}
              caption="Subestações com posição: nome, tensão, UF e agente. Ordene pelos cabeçalhos."
              initialSort={{ key: "kv", desc: true }}
              selectedKey={selected}
            />
          ) : (
            <SortableTable
              rows={lineFeatures}
              columns={lineColumns}
              rowKey={(r) => r.properties.equipment_code}
              caption="Linhas de transmissão desenháveis: nome, tensão e extensão. Ordene pelos cabeçalhos."
              initialSort={{ key: "kv", desc: true }}
            />
          )}
        </div>
        {data.lines.meta.omitted > 0 || data.substations.meta.omitted > 0 ? (
          <p className="text-muted mt-2 text-xs">
            Ficam fora do mapa {data.substations.meta.omitted} subestações sem posição publicada e{" "}
            {data.lines.meta.omitted} linhas cuja subestação não tem posição ou cujo nome aponta
            para mais de um lugar.
          </p>
        ) : null}
      </section>

      <ul className="text-muted mt-4 list-disc space-y-1 pl-5 text-xs">
        {data.lines.meta.warnings.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>
      <MapAttribution dataset="Rede de transmissão (cadastro de subestações e linhas)" />
    </div>
  );
}
