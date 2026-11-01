"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { MapAttribution } from "@/components/maps/map-attribution";
import { MapView } from "@/components/maps/map-view";
import type { PointsCollection, PointsMapProps } from "@/components/maps/points-map";
import { SortableTable, type Column } from "@/components/maps/sortable-table";
import type { ReservoirCollection, ReservoirFeature } from "@/lib/api/types";
import { formatDate, formatNumber, formatPercent } from "@/lib/format";
import { STORAGE_LIMITS, storageClassLabel } from "@/lib/maps";

const loadEngine = () => import("@/components/maps/points-map");
const COLOR_VARS = ["--map-c0", "--map-c1", "--map-c2", "--map-c3", "--map-c4"];
const SUBSYSTEMS = ["N", "NE", "S", "SE"];

export function ReservoirsMapPanel({ initial }: { initial: ReservoirCollection }) {
  const [data, setData] = useState(initial);
  const [subsystem, setSubsystem] = useState("");
  const [basin, setBasin] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const day = data.meta.as_of;
  const lastDay = useRef(initial.meta.as_of);

  const basins = useMemo(
    () =>
      [
        ...new Set(data.features.map((f) => f.properties.basin).filter((b): b is string => !!b)),
      ].sort((a, b) => a.localeCompare(b, "pt-BR")),
    [data],
  );
  const shown = useMemo(
    () =>
      data.features.filter(
        (f) =>
          (!subsystem || f.properties.subsystem === subsystem) &&
          (!basin || f.properties.basin === basin),
      ),
    [data, subsystem, basin],
  );
  const collection = useMemo<PointsCollection>(
    () => ({
      type: "FeatureCollection",
      features: shown.map((f) => ({
        type: "Feature",
        geometry: f.geometry,
        properties: {
          id: f.properties.slug,
          storage_pct: f.properties.storage_pct,
          useful_volume_hm3: f.properties.useful_volume_hm3,
        },
      })),
    }),
    [shown],
  );
  const maxVolume = Math.max(1, ...shown.map((f) => f.properties.useful_volume_hm3 ?? 0));
  const chosen = shown.find((f) => f.properties.slug === selected)?.properties;

  const load = useCallback(async (next: string) => {
    if (!next || next === lastDay.current) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/mapas/reservatorios?data=${encodeURIComponent(next)}`);
      if (response.status === 404) {
        setError("Não há dados de reservatórios neste dia. Escolha outra data.");
        return;
      }
      if (!response.ok) throw new Error(String(response.status));
      setData((await response.json()) as ReservoirCollection);
      lastDay.current = next;
    } catch {
      setError("Não foi possível carregar este dia. Tente de novo.");
    } finally {
      setLoading(false);
    }
  }, []);

  const withValue = shown.filter((f) => f.properties.storage_pct !== null);
  const fullest = [...withValue].sort(
    (a, b) => (b.properties.storage_pct ?? 0) - (a.properties.storage_pct ?? 0),
  )[0];
  const emptiest = [...withValue].sort(
    (a, b) => (a.properties.storage_pct ?? 0) - (b.properties.storage_pct ?? 0),
  )[0];
  const summary = day
    ? `${shown.length} reservatórios no mapa em ${formatDate(`${day}T12:00:00-03:00`)}.` +
      (fullest && emptiest
        ? ` Mais cheio: ${fullest.properties.name} (${formatPercent(fullest.properties.storage_pct, 1)}). Mais vazio: ${emptiest.properties.name} (${formatPercent(emptiest.properties.storage_pct, 1)}).`
        : "")
    : "Sem dados de reservatórios.";

  const columns: Column<ReservoirFeature>[] = [
    {
      key: "name",
      label: "Reservatório",
      firstDirection: "asc",
      sortValue: (r) => r.properties.name,
      render: (r) => (
        <button
          type="button"
          className="text-ink hover:text-accent text-left font-medium hover:underline"
          onClick={() => setSelected(r.properties.slug)}
        >
          {r.properties.name}
        </button>
      ),
    },
    {
      key: "storage",
      label: "EAR",
      align: "right",
      sortValue: (r) => r.properties.storage_pct,
      render: (r) => formatPercent(r.properties.storage_pct, 1),
    },
    {
      key: "volume",
      label: "Volume útil (hm³)",
      align: "right",
      sortValue: (r) => r.properties.useful_volume_hm3,
      render: (r) => formatNumber(r.properties.useful_volume_hm3, 0),
    },
    {
      key: "sub",
      label: "Subsistema",
      secondary: true,
      firstDirection: "asc",
      sortValue: (r) => r.properties.subsystem ?? "",
      render: (r) => r.properties.subsystem ?? "-",
    },
    {
      key: "basin",
      label: "Bacia",
      secondary: true,
      firstDirection: "asc",
      sortValue: (r) => r.properties.basin ?? "",
      render: (r) => r.properties.basin ?? "-",
    },
  ];

  const mapProps: PointsMapProps = {
    label: "Reservatórios: tamanho pelo volume útil, cor pela energia armazenada",
    points: collection,
    idProperty: "id",
    radiusProperty: "useful_volume_hm3",
    radiusMax: maxVolume,
    colorProperty: "storage_pct",
    colorLimits: STORAGE_LIMITS,
    colorVars: COLOR_VARS,
    selected,
    onSelect: setSelected,
  };

  return (
    <div>
      <form
        className="border-grid bg-surface flex flex-wrap items-end gap-x-4 gap-y-3 rounded-2xl border p-4"
        onSubmit={(event) => event.preventDefault()}
        aria-label="Filtros do mapa"
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-ink-2 font-medium">Dia</span>
          <input
            type="date"
            className="border-line bg-surface min-h-10 rounded-lg border px-2"
            value={day ?? ""}
            max={initial.meta.as_of ?? undefined}
            disabled={loading}
            onChange={(event) => void load(event.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-ink-2 font-medium">Subsistema</span>
          <select
            className="border-line bg-surface min-h-10 rounded-lg border px-2"
            value={subsystem}
            onChange={(event) => setSubsystem(event.target.value)}
          >
            <option value="">Todos</option>
            {SUBSYSTEMS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-ink-2 font-medium">Bacia</span>
          <select
            className="border-line bg-surface min-h-10 max-w-56 rounded-lg border px-2"
            value={basin}
            onChange={(event) => setBasin(event.target.value)}
          >
            <option value="">Todas</option>
            {basins.map((b) => (
              <option key={b} value={b}>
                {b}
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
            Energia armazenada por reservatório
            {day ? `, ${formatDate(`${day}T12:00:00-03:00`)}` : ""}
          </figcaption>
          <div className={loading ? "opacity-70 transition-opacity" : undefined}>
            <MapView
              label="Reservatórios do Brasil"
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
              Cor: energia armazenada (EAR) do dia. Tamanho: volume útil do reservatório.
            </p>
            <ol className="mt-3 space-y-1.5 text-sm">
              {COLOR_VARS.map((name, i) => (
                <li key={name} className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="border-line inline-block size-4 shrink-0 rounded border"
                    style={{ background: `var(${name})` }}
                  />
                  <span className="tabular">{storageClassLabel(i)}</span>
                </li>
              ))}
              <li className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="border-line inline-block size-4 shrink-0 rounded border"
                  style={{ background: "var(--map-nodata)" }}
                />
                <span>Sem medida no dia</span>
              </li>
            </ol>
          </section>
          <section
            aria-label="Reservatório selecionado"
            className="border-grid bg-surface rounded-2xl border p-4"
          >
            <h2 className="text-ink text-sm font-semibold">Reservatório selecionado</h2>
            {chosen ? (
              <dl className="mt-2 space-y-1 text-sm">
                <dt className="text-ink font-semibold">{chosen.name}</dt>
                <dd>
                  EAR: {formatPercent(chosen.storage_pct, 1)}
                  <br />
                  Volume útil: {formatNumber(chosen.useful_volume_hm3, 0)} hm³
                  <br />
                  Bacia: {chosen.basin ?? "-"}
                  <br />
                  Rio: {chosen.river ?? "-"}
                  <br />
                  Subsistema: {chosen.subsystem ?? "-"}
                </dd>
                {chosen.plant_name ? <dd>Usina: {chosen.plant_name}</dd> : null}
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
                Toque ou clique em um círculo, ou escolha um nome na tabela.
              </p>
            )}
          </section>
        </div>
      </div>

      <p className="text-ink-2 mt-5 text-sm leading-6">{summary}</p>

      <section className="mt-6" aria-labelledby="reservoirs-table-title">
        <h2 id="reservoirs-table-title" className="text-ink text-lg font-semibold">
          Tabela dos reservatórios
        </h2>
        <div className="mt-3">
          <SortableTable
            rows={shown}
            columns={columns}
            rowKey={(r) => r.properties.slug}
            caption="Reservatórios com posição: energia armazenada, volume útil, subsistema e bacia. Ordene pelos cabeçalhos."
            initialSort={{ key: "volume", desc: true }}
            selectedKey={selected}
          />
        </div>
        {data.meta.omitted > 0 ? (
          <p className="text-muted mt-2 text-xs">
            {data.meta.omitted} reservatórios do cadastro não têm posição publicada e ficam fora do
            mapa.
          </p>
        ) : null}
        <p className="mt-2 text-xs">
          <Link className="text-accent underline" href="/agua">
            Ver gráficos de armazenamento e afluência em Água
          </Link>
        </p>
      </section>

      <ul className="text-muted mt-4 list-disc space-y-1 pl-5 text-xs">
        {data.meta.warnings.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>
      <MapAttribution dataset="Reservatórios" />
    </div>
  );
}
