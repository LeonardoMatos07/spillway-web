import { FORECAST_MODEL_NAME } from "@/lib/forecast";

/** "evaluating": the page is open (calculator, history, scoreboard) but no lead passed the test yet. */
export type ForecastStatus = "available" | "evaluating" | "soon";

export interface ForecastEntry {
  /** Stable key; also how the hub finds the model metadata of a forecast. */
  key: "curtailment" | "bandeira" | "afluencia";
  /** Address of the forecast page. It never changes; "soon" ones are not linked anywhere yet. */
  href: string;
  title: string;
  /** What it predicts, in one sentence. */
  predicts: string;
  /** How far ahead it looks. */
  horizon: string;
  /** Name of the model family, when there is one. */
  model?: string;
  status: ForecastStatus;
  /** True when the forecast page needs a free account (the hub itself is open). */
  members: boolean;
}

/**
 * Every forecast of the site, in the order they are shown. The menu and the /previsoes hub are
 * built from this list: to add a forecast, append an entry here and create its route; to open
 * a "soon" one, set its status to "available".
 */
export const FORECASTS: readonly ForecastEntry[] = [
  {
    key: "curtailment",
    href: "/previsao",
    title: "Curtailment",
    predicts: "Risco de corte de geração eólica e solar, por região.",
    horizon: "Próximos 7 dias, hora a hora",
    model: FORECAST_MODEL_NAME,
    status: "available",
    members: true,
  },
  {
    key: "bandeira",
    href: "/bandeira",
    title: "Bandeira tarifária",
    predicts: "Qual bandeira (verde, amarela ou vermelha) deve valer nos próximos meses.",
    horizon: "Próximo mês, com 21, 14, 7 e 3 dias de antecedência",
    status: "evaluating",
    members: false,
  },
  {
    key: "afluencia",
    href: "/agua/previsao",
    title: "Afluência (ENA)",
    predicts: "Quanta água deve chegar aos reservatórios de cada subsistema.",
    horizon: "Próximas semanas",
    status: "soon",
    members: false,
  },
];

export function availableForecasts(): ForecastEntry[] {
  return FORECASTS.filter((forecast) => forecast.status === "available");
}
