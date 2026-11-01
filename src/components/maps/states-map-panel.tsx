"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapAttribution } from "@/components/maps/map-attribution";
import { MapView } from "@/components/maps/map-view";
import type { StatesSvgProps } from "@/components/maps/states-svg";
import type { AggregateSource, GeoStatesResponse } from "@/lib/api/types";
import { formatEnergy, formatLongMonth } from "@/lib/format";
import { findState } from "@/lib/geo";
import {
  CLASS_COUNT,
  classLimits,
  MAP_SOURCES,
  rankStates,
  STATE_METRICS,
  stepMonth,
  summarizeStates,
  type RankedState,
  type StateMetric,
} from "@/lib/maps";

const PLAY_INTERVAL_MS = 1400;
// A literal import() so the bundler splits d3-geo and topojson-client out of this panel.
const loadEngine = () => import("@/components/maps/states-svg");

type SortKey = "name" | "pct" | "mwh" | "brl" | "plants";

const SORTERS: Record<SortKey, (r: RankedState) => number | string> = {
  name: (r) => r.name,
  pct: (r) => r.item.curtailment_pct ?? Number.NEGATIVE_INFINITY,
  mwh: (r) => r.item.curtailed_mwh,
  brl: (r) => r.item.estimated_loss_brl ?? Number.NEGATIVE_INFINITY,
  plants: (r) => r.item.affected_plants,
};

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function StatesMapPanel({
  initial,
  initialMetric,
  compact = false,
}: {
  initial: GeoStatesResponse;
  initialMetric: StateMetric;
  /** Embedded in /estados: the map and legend only (the page lists the states itself). */
  compact?: boolean;
}) {
  const [data, setData] = useState(initial);
  const [metric, setMetric] = useState<StateMetric>(initialMetric);
  const [active, setActive] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({ key: "pct", desc: true });
  const reducedMotion = useReducedMotion();
  const cache = useRef(new Map<string, GeoStatesResponse>());

  const { meta, items } = data;
  const source = meta.data_source;
  const sourceLabel = MAP_SOURCES.find((s) => s.key === source)?.label ?? source;
  const monthLabel = meta.month ? formatLongMonth(meta.month) : "mês sem dados";
  const config = STATE_METRICS[metric];

  const ranked = useMemo(() => rankStates(items, metric), [items, metric]);
  const max = Math.max(0, ...ranked.map((r) => r.value ?? 0));
  const limits = useMemo(() => classLimits(max), [max]);
  const summary = summarizeStates(ranked, metric, monthLabel, sourceLabel);

  const rows = useMemo(() => {
    const read = SORTERS[sort.key];
    return [...rankStates(items, "pct")].sort((a, b) => {
      const x = read(a);
      const y = read(b);
      const order =
        typeof x === "string" && typeof y === "string"
          ? x.localeCompare(y, "pt-BR")
          : Number(x) - Number(y);
      return sort.desc ? -order : order;
    });
  }, [items, sort]);

  const syncUrl = useCallback((month: string | null, fonte: AggregateSource, m: StateMetric) => {
    const params = new URLSearchParams();
    if (month) params.set("mes", month);
    if (fonte !== "total") params.set("fonte", fonte);
    if (m !== "pct") params.set("metrica", m);
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, []);

  const show = useCallback(
    async (fonte: AggregateSource, month: string | null): Promise<boolean> => {
      const key = `${fonte}|${month ?? "latest"}`;
      let next = cache.current.get(key);
      if (!next) {
        setLoading(true);
        setError(null);
        try {
          const qs = new URLSearchParams({ fonte });
          if (month) qs.set("mes", month);
          let response = await fetch(`/api/mapas/estados?${qs}`);
          // The month may not exist for this source: fall back to its latest month.
          if (response.status === 404 && month) {
            qs.delete("mes");
            response = await fetch(`/api/mapas/estados?${qs}`);
          }
          if (!response.ok) throw new Error(String(response.status));
          next = (await response.json()) as GeoStatesResponse;
          cache.current.set(key, next);
        } catch {
          setError("Não foi possível carregar este mês. Tente de novo.");
          setLoading(false);
          return false;
        }
        setLoading(false);
      }
      setData(next);
      setActive(null);
      syncUrl(next.meta.month, fonte, metric);
      return true;
    },
    [metric, syncUrl],
  );

  // Play: one month every PLAY_INTERVAL_MS, oldest to newest, stops at the last month.
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(async () => {
      const next = stepMonth(meta.months, meta.month, 1);
      if (next === null || !(await show(source, next))) setPlaying(false);
    }, PLAY_INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [playing, meta.months, meta.month, source, show]);

  useEffect(() => {
    if (reducedMotion) setPlaying(false);
  }, [reducedMotion]);

  function togglePlay() {
    if (playing) {
      setPlaying(false);
      return;
    }
    const oldest = [...meta.months].sort()[0];
    if (meta.month && stepMonth(meta.months, meta.month, 1) === null && oldest) {
      void show(source, oldest).then((ok) => ok && setPlaying(true));
    } else {
      setPlaying(true);
    }
  }

  function changeMetric(next: StateMetric) {
    setMetric(next);
    syncUrl(meta.month, source, next);
  }

  const monthsDesc = meta.months; // ascending, shown newest first
  const previous = stepMonth(meta.months, meta.month, -1);
  const following = stepMonth(meta.months, meta.month, 1);
  const hovered = active ? ranked.find((r) => r.state === active) : undefined;
  const missing = meta.omitted_states.map((uf) => findState(uf)?.name ?? uf);

  const mapProps: StatesSvgProps = { items, metric, limits, active, onActive: setActive };

  return (
    <div>
      <form
        className="border-grid bg-surface flex flex-wrap items-end gap-x-4 gap-y-3 rounded-2xl border p-4"
        onSubmit={(event) => event.preventDefault()}
        aria-label="Filtros do mapa"
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-ink-2 font-medium">Mês</span>
          <span className="flex items-center gap-1">
            <button
              type="button"
              className="border-line hover:bg-surface-2 min-h-10 min-w-10 rounded-lg border"
              onClick={() => previous && void show(source, previous)}
              disabled={!previous || loading}
              aria-label="Mês anterior"
            >
              ‹
            </button>
            <select
              className="border-line bg-surface min-h-10 rounded-lg border px-2"
              value={meta.month ?? ""}
              disabled={monthsDesc.length === 0 || loading}
              onChange={(event) => {
                setPlaying(false);
                void show(source, event.target.value);
              }}
            >
              {meta.month === null && <option value="">Sem dados</option>}
              {[...monthsDesc].reverse().map((m) => (
                <option key={m} value={m}>
                  {formatLongMonth(m)}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="border-line hover:bg-surface-2 min-h-10 min-w-10 rounded-lg border"
              onClick={() => following && void show(source, following)}
              disabled={!following || loading}
              aria-label="Próximo mês"
            >
              ›
            </button>
          </span>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-ink-2 font-medium">Fonte</span>
          <select
            className="border-line bg-surface min-h-10 rounded-lg border px-2"
            value={source}
            disabled={loading}
            onChange={(event) => {
              setPlaying(false);
              void show(event.target.value as AggregateSource, meta.month);
            }}
          >
            {MAP_SOURCES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-ink-2 font-medium">Indicador</span>
          <select
            className="border-line bg-surface min-h-10 rounded-lg border px-2"
            value={metric}
            onChange={(event) => changeMetric(event.target.value as StateMetric)}
          >
            {Object.entries(STATE_METRICS).map(([key, m]) => (
              <option key={key} value={key}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
        {compact ? null : (
          <div className="flex flex-col gap-1 text-sm">
            <button
              type="button"
              onClick={togglePlay}
              disabled={reducedMotion || meta.months.length < 2}
              className="bg-accent text-on-accent min-h-10 rounded-lg px-4 font-medium disabled:opacity-50"
              aria-pressed={playing}
            >
              {playing ? "Pausar" : "Reproduzir meses"}
            </button>
            {reducedMotion ? (
              <span className="text-muted text-xs">
                Reprodução desativada: seu sistema pede menos movimento. Use as setas do mês.
              </span>
            ) : null}
          </div>
        )}
      </form>

      <p role="status" aria-live="polite" className="sr-only">
        {loading ? "Carregando…" : summary}
      </p>
      {error ? (
        <p role="alert" className="text-danger mt-3 text-sm">
          {error}
        </p>
      ) : null}

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <figure className="border-grid bg-surface shadow-card rounded-2xl border p-3">
          <figcaption className="text-ink px-1 pb-2 text-sm font-semibold">
            {config.label} por estado, {monthLabel} ({sourceLabel})
          </figcaption>
          <div className={loading ? "opacity-70 transition-opacity" : undefined}>
            <MapView
              label={`${config.label} por estado em ${monthLabel}`}
              load={loadEngine}
              props={mapProps}
            />
          </div>
        </figure>

        <div className="space-y-4">
          <section aria-label="Legenda" className="border-grid bg-surface rounded-2xl border p-4">
            <h2 className="text-ink text-sm font-semibold">Legenda</h2>
            <p className="text-muted mt-1 text-xs">
              {config.label}: {config.unit}.
            </p>
            <ol className="mt-3 space-y-1.5 text-sm">
              {Array.from({ length: CLASS_COUNT }, (_, i) => {
                const lower = i === 0 ? 0 : (limits[i - 1] ?? 0);
                const upper = i < limits.length ? limits[i] : max;
                return (
                  <li key={i} className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="border-line inline-block size-4 shrink-0 rounded border"
                      style={{ background: `var(--map-c${i})` }}
                    />
                    <span className="tabular">
                      {max > 0
                        ? `${config.format(lower)} a ${config.format(upper ?? max)}`
                        : "sem valores"}
                    </span>
                  </li>
                );
              })}
              <li className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="border-line inline-block size-4 shrink-0 rounded border"
                  style={{ background: "var(--map-nodata)" }}
                />
                <span>Sem dados</span>
              </li>
            </ol>
            <p className="text-muted mt-3 text-xs">
              As faixas crescem em ritmo quadrático para separar os estados de corte baixo.
            </p>
          </section>

          {compact ? null : (
            <section
              aria-label="Estado em destaque"
              className="border-grid bg-surface rounded-2xl border p-4"
            >
              <h2 className="text-ink text-sm font-semibold">Estado em destaque</h2>
              {hovered ? (
                <dl className="mt-2 space-y-1 text-sm">
                  <dt className="text-ink font-semibold">{hovered.name}</dt>
                  <dd>
                    % de corte: {STATE_METRICS.pct.short(hovered.item)}
                    <br />
                    Energia cortada: {formatEnergy(hovered.item.curtailed_mwh)}
                    <br />
                    Perda estimada: {STATE_METRICS.brl.short(hovered.item)}
                    <br />
                    Usinas afetadas: {hovered.item.affected_plants}
                  </dd>
                  <dd>
                    <Link
                      className="text-accent underline"
                      href={`/estados/${hovered.state.toLowerCase()}`}
                    >
                      Ver {hovered.name}
                    </Link>
                  </dd>
                </dl>
              ) : (
                <p className="text-muted mt-2 text-sm">
                  Passe o mouse, toque ou use Tab sobre um estado. Clicar abre a página dele.
                </p>
              )}
            </section>
          )}
        </div>
      </div>

      <p className="text-ink-2 mt-5 text-sm leading-6">{summary}</p>

      {compact ? null : (
        <section className="mt-6" aria-labelledby="states-table-title">
          <h2 id="states-table-title" className="text-ink text-lg font-semibold">
            Tabela dos valores
          </h2>
          <div className="border-grid bg-surface shadow-card mt-3 rounded-2xl border">
            <table className="tabular w-full text-left text-sm">
              <caption className="sr-only">
                Curtailment por estado em {monthLabel} ({sourceLabel}). Ordene pelos cabeçalhos.
              </caption>
              <thead>
                <tr className="border-grid bg-surface-2 text-ink-2 border-b text-xs tracking-wide uppercase">
                  {(
                    [
                      ["name", "Estado", "", "left"],
                      ["pct", "% de corte", "", "right"],
                      ["mwh", "Energia cortada", "hidden sm:table-cell", "right"],
                      ["brl", "Perda estimada", "", "right"],
                      ["plants", "Usinas", "hidden sm:table-cell", "right"],
                    ] as const
                  ).map(([key, label, hide, align]) => (
                    <th
                      key={key}
                      scope="col"
                      aria-sort={
                        sort.key === key ? (sort.desc ? "descending" : "ascending") : "none"
                      }
                      className={`px-3 py-2 font-medium ${hide} ${align === "right" ? "text-right" : ""}`}
                    >
                      <button
                        type="button"
                        className="hover:text-ink uppercase"
                        onClick={() =>
                          setSort((s) => ({ key, desc: s.key === key ? !s.desc : key !== "name" }))
                        }
                      >
                        {label}
                        <span aria-hidden>{sort.key === key ? (sort.desc ? " ↓" : " ↑") : ""}</span>
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.state}
                    className="border-grid hover:bg-surface-2 border-b last:border-0"
                  >
                    <th scope="row" className="px-3 py-2 font-normal">
                      <Link
                        className="text-ink hover:text-accent font-medium hover:underline"
                        href={`/estados/${r.state.toLowerCase()}`}
                      >
                        {r.name}
                      </Link>
                    </th>
                    <td className="px-3 py-2 text-right">{STATE_METRICS.pct.short(r.item)}</td>
                    <td className="hidden px-3 py-2 text-right sm:table-cell">
                      {formatEnergy(r.item.curtailed_mwh)}
                    </td>
                    <td className="px-3 py-2 text-right">{STATE_METRICS.brl.short(r.item)}</td>
                    <td className="hidden px-3 py-2 text-right sm:table-cell">
                      {r.item.affected_plants}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {missing.length > 0 ? (
            <p className="text-muted mt-2 text-xs">
              Sem dados neste mês e fonte ({meta.omitted}): {missing.join(", ")}.
            </p>
          ) : null}
        </section>
      )}

      <ul className="text-muted mt-4 list-disc space-y-1 pl-5 text-xs">
        {meta.warnings.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>
      {compact ? (
        <p className="mt-3 text-sm">
          <Link className="text-accent underline" href="/mapas/estados">
            Abrir em Mapas
          </Link>{" "}
          (com a tabela, a reprodução mês a mês e outros indicadores)
        </p>
      ) : null}
      <MapAttribution dataset="restrição de operação de usinas eólicas e solares" />
    </div>
  );
}
