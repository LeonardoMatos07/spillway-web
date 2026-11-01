import type { AggregateSource, GeoStateCurtailment } from "@/lib/api/types";
import { findState } from "@/lib/geo";
import { formatBRL, formatBRLCompact, formatPercent } from "@/lib/format";

/** One route per map layer under /mapas; only the open layer loads its code and data. */
export const MAP_LAYERS = [
  {
    key: "estados",
    href: "/mapas/estados",
    label: "Estados",
    /** Needs an account, like /estados (same data). */
    account: true,
  },
  {
    key: "reservatorios",
    href: "/mapas/reservatorios",
    label: "Reservatórios",
    account: false,
  },
  {
    key: "rede",
    href: "/mapas/rede",
    label: "Rede",
    account: false,
  },
  {
    key: "usinas",
    href: "/mapas/usinas",
    label: "Usinas",
    /** Needs an account, like /usinas (same data). */
    account: true,
  },
] as const;

export type MapLayerKey = (typeof MAP_LAYERS)[number]["key"];

export const STATE_METRICS = {
  pct: {
    label: "% de corte",
    unit: "% da energia que as usinas gerariam",
    short: (item: GeoStateCurtailment) => formatPercent(item.curtailment_pct, 1, 1),
    value: (item: GeoStateCurtailment) => item.curtailment_pct,
    format: (value: number) => formatPercent(value, 1, 1),
  },
  brl: {
    label: "Perda estimada (R$)",
    unit: "reais",
    short: (item: GeoStateCurtailment) => formatBRLCompact(item.estimated_loss_brl),
    value: (item: GeoStateCurtailment) => item.estimated_loss_brl,
    format: (value: number) => formatBRL(value),
  },
} as const;

export type StateMetric = keyof typeof STATE_METRICS;

export const MAP_SOURCES: readonly { key: AggregateSource; label: string }[] = [
  { key: "total", label: "Eólica e solar" },
  { key: "wind", label: "Eólica" },
  { key: "solar", label: "Solar" },
];

const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

export interface StatesMapParams {
  mes: string | null;
  fonte: AggregateSource;
  metrica: StateMetric;
}

export function parseStatesMapParams(
  params: Record<string, string | string[] | undefined> | URLSearchParams,
): StatesMapParams {
  const get = (name: string): string | null => {
    const value = params instanceof URLSearchParams ? params.get(name) : params[name];
    const first = Array.isArray(value) ? value[0] : value;
    return first ?? null;
  };
  const mes = get("mes");
  const fonte = get("fonte");
  const metrica = get("metrica");
  return {
    mes: mes && MONTH_RE.test(mes) ? mes : null,
    fonte: fonte === "wind" || fonte === "solar" ? fonte : "total",
    metrica: metrica === "brl" ? "brl" : "pct",
  };
}

/** Number of color classes of the choropleth (class 0 is the lowest, but still has data). */
export const CLASS_COUNT = 5;

/**
 * Upper limits of the first four classes: squares of the share of the maximum, so that the many
 * low values are not all lumped into one color while one state stands out.
 */
export function classLimits(max: number): number[] {
  if (!(max > 0)) return [];
  return [1, 2, 3, 4].map((i) => max * (i / CLASS_COUNT) ** 2);
}

export function classIndex(value: number | null, limits: number[]): number | null {
  if (value === null || !Number.isFinite(value)) return null;
  const index = limits.findIndex((limit) => value <= limit);
  return index === -1 ? limits.length : index;
}

export interface RankedState {
  state: string;
  name: string;
  item: GeoStateCurtailment;
  value: number | null;
}

export function rankStates(items: GeoStateCurtailment[], metric: StateMetric): RankedState[] {
  const read = STATE_METRICS[metric].value;
  return items
    .map((item) => ({
      state: item.state,
      name: findState(item.state)?.name ?? item.state,
      item,
      value: read(item),
    }))
    .sort(
      (a, b) =>
        (b.value ?? Number.NEGATIVE_INFINITY) - (a.value ?? Number.NEGATIVE_INFINITY) ||
        a.name.localeCompare(b.name, "pt-BR"),
    );
}

/** The text equivalent of the map, read by screen readers and shown under it. */
export function summarizeStates(
  ranked: RankedState[],
  metric: StateMetric,
  monthLabel: string,
  sourceLabel: string,
): string {
  const withValue = ranked.filter((r) => r.value !== null);
  const first = withValue[0];
  if (!first || first.value === null) {
    return `Sem dados de corte por estado em ${monthLabel}.`;
  }
  const format = STATE_METRICS[metric].format;
  const top = withValue
    .slice(0, 3)
    .map((r) => `${r.name} (${format(r.value ?? 0)})`)
    .join(", ");
  return `${sourceLabel}, ${monthLabel}: ${withValue.length} estados com dados. Maiores valores de ${STATE_METRICS[metric].label.toLowerCase()}: ${top}.`;
}

/** Month after (or before) `month` in the list of months with data, which is newest first. */
export function stepMonth(months: string[], month: string | null, delta: 1 | -1): string | null {
  const ascending = [...months].sort();
  const at = month === null ? -1 : ascending.indexOf(month);
  if (at === -1) return null;
  return ascending[at + delta] ?? null;
}

/** Brazil's bounding box [west, south, east, north], for "Voltar ao Brasil". */
export const BRAZIL_BOUNDS: [number, number, number, number] = [-74, -34, -28.8, 5.3];

/** Storage (EAR) classes of the reservoirs map: upper limits in %, five colors. */
export const STORAGE_LIMITS = [20, 40, 60, 80];

export function storageClass(pct: number | null): number | null {
  if (pct === null || !Number.isFinite(pct)) return null;
  const index = STORAGE_LIMITS.findIndex((limit) => pct < limit);
  return index === -1 ? STORAGE_LIMITS.length : index;
}

export function storageClassLabel(index: number): string {
  if (index === 0) return `menos de ${STORAGE_LIMITS[0]}%`;
  const last = STORAGE_LIMITS.length;
  if (index === last) return `${STORAGE_LIMITS[last - 1]}% ou mais`;
  return `${STORAGE_LIMITS[index - 1]}% a menos de ${STORAGE_LIMITS[index]}%`;
}

/** Transmission voltage classes (kV): upper limits of the first four, in the map-color order. */
export const VOLTAGE_LIMITS = [100, 200, 300, 480];
export const VOLTAGE_LABELS = ["69 a 88 kV", "138 kV", "230 kV", "345 a 440 kV", "500 kV ou mais"];
/** Minimum-voltage choices of the grid map; the default shows the high voltages only. */
export const VOLTAGE_MIN_OPTIONS = [
  { value: 500, label: "500 kV ou mais" },
  { value: 345, label: "345 kV ou mais" },
  { value: 230, label: "230 kV ou mais" },
  { value: 138, label: "138 kV ou mais" },
  { value: 0, label: "Todas as tensões" },
] as const;
export const DEFAULT_VOLTAGE_MIN = 230;

export function voltageClass(kv: number | null): number | null {
  if (kv === null || !Number.isFinite(kv)) return null;
  const index = VOLTAGE_LIMITS.findIndex((limit) => kv < limit);
  return index === -1 ? VOLTAGE_LIMITS.length : index;
}

export function parseVoltageMin(value: string | string[] | null | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return VOLTAGE_MIN_OPTIONS.some((o) => o.value === parsed) && raw !== undefined && raw !== null
    ? parsed
    : DEFAULT_VOLTAGE_MIN;
}

/** Curtailment (% of the energy a plant would have generated): upper limits of the first four classes. */
export const CURTAILMENT_LIMITS = [5, 15, 30, 50];
export const CURTAILMENT_LABELS = [
  "menos de 5%",
  "5% a menos de 15%",
  "15% a menos de 30%",
  "30% a menos de 50%",
  "50% ou mais",
];

export interface Placed {
  id: string;
  lon: number;
  lat: number;
}

/**
 * Plants that connect to the same substation share one coordinate. For drawing only, they are
 * spread on a small spiral around it (about 3 km per ring), so none hides another. The table and
 * the detail keep saying that the position is the substation's.
 */
export function spreadCoincident(points: Placed[], step = 0.03): Map<string, [number, number]> {
  const groups = new Map<string, Placed[]>();
  for (const p of points) {
    const key = `${p.lon.toFixed(5)},${p.lat.toFixed(5)}`;
    const group = groups.get(key);
    if (group) group.push(p);
    else groups.set(key, [p]);
  }
  const out = new Map<string, [number, number]>();
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (const group of groups.values()) {
    group.forEach((p, i) => {
      if (group.length === 1) return out.set(p.id, [p.lon, p.lat]);
      const radius = step * Math.sqrt(i + 0.5);
      out.set(p.id, [p.lon + radius * Math.cos(i * golden), p.lat + radius * Math.sin(i * golden)]);
    });
  }
  return out;
}
