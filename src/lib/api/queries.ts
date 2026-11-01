import "server-only";
import { apiTry, withQuery } from "./client";
import type {
  AggregateSource,
  BalanceResponse,
  InterchangeResponse,
  ReservoirListResponse,
  SpilledEnergyResponse,
  ThermalDispatchResponse,
  CurtailmentSummary,
  ForecastModelMeta,
  ForecastResponse,
  ForecastScope,
  GroupRankingResponse,
  HourlyProfileResponse,
  GenerationMixResponse,
  HydroSubsystemsResponse,
  MarketConsumptionResponse,
  PlantGenerationResponse,
  MonthsResponse,
  NewsItemDetail,
  NewsListResponse,
  NewsSourceListResponse,
  PlantDetailResponse,
  PlantKind,
  PlantListResponse,
  PldGranularity,
  PldResponse,
  ReliabilityDetailResponse,
  ReliabilityResponse,
  RegulatoryActDetail,
  RegulatoryActListResponse,
  Report,
  ReportListResponse,
  Source,
  GeoStatesResponse,
  LineCollection,
  PlantGeoCollection,
  SubstationCollection,
  ReservoirCollection,
  StateCurtailmentResponse,
  Subsystem,
  SubsystemCurtailmentResponse,
  TariffFlagsResponse,
} from "./types";

export function getSubsystemCurtailment(
  source: AggregateSource = "total",
  start?: string,
  end?: string,
) {
  return apiTry<SubsystemCurtailmentResponse>(
    withQuery("/v1/curtailment/subsystems", { source, start, end }),
    { tags: ["curtailment"] },
  );
}

export function getCurtailmentSummary(
  scope: string,
  start?: string,
  end?: string,
  source: AggregateSource = "total",
) {
  return apiTry<CurtailmentSummary>(
    withQuery("/v1/curtailment/summary", { scope, source, start, end }),
    { tags: ["curtailment", "plants"] },
  );
}

export function getGroupRanking(
  group: "operators" | "connection-points",
  options: { source?: AggregateSource; start?: string; end?: string; limit?: number } = {},
) {
  return apiTry<GroupRankingResponse>(withQuery(`/v1/rankings/${group}`, options), {
    tags: ["curtailment", "plants"],
  });
}

export function getHourlyProfile(
  scope: string,
  source: AggregateSource = "total",
  start?: string,
  end?: string,
) {
  return apiTry<HourlyProfileResponse>(
    withQuery("/v1/curtailment/hourly", { scope, source, start, end }),
    { tags: ["curtailment"] },
  );
}

export function getStateCurtailment(
  state: string,
  source: AggregateSource = "total",
  month?: string,
) {
  return apiTry<StateCurtailmentResponse>(
    withQuery(`/v1/curtailment/states/${encodeURIComponent(state)}`, { source, month }),
    { tags: ["curtailment", "plants"] },
  );
}

export function getGeoStatesCurtailment(source: AggregateSource = "total", month?: string) {
  return apiTry<GeoStatesResponse>(withQuery("/v1/geo/states/curtailment", { source, month }), {
    tags: ["curtailment"],
  });
}

export function getGeoReservoirs(options: { date?: string; subsystem?: string } = {}) {
  return apiTry<ReservoirCollection>(withQuery("/v1/geo/reservoirs", options), SYSTEM_OPTIONS);
}

export function getGeoSubstations(options: { voltage_min?: number; state?: string } = {}) {
  return apiTry<SubstationCollection>(withQuery("/v1/geo/substations", options), SYSTEM_OPTIONS);
}

export function getGeoLines(options: { voltage_min?: number; state?: string } = {}) {
  return apiTry<LineCollection>(withQuery("/v1/geo/lines", options), SYSTEM_OPTIONS);
}

export function getGeoPlants(
  options: { month?: string; source?: Source; state?: string; slug?: string } = {},
) {
  return apiTry<PlantGeoCollection>(withQuery("/v1/geo/plants", options), {
    tags: ["curtailment", "plants"],
  });
}

export interface PlantFilters {
  search?: string;
  state?: string;
  source?: Source;
  kind?: PlantKind;
  page?: number;
  pageSize?: number;
}

export function getPlants({ pageSize, ...filters }: PlantFilters = {}) {
  return apiTry<PlantListResponse>(withQuery("/v1/plants", { ...filters, page_size: pageSize }), {
    tags: ["plants"],
  });
}

export function getPlant(slug: string) {
  return apiTry<PlantDetailResponse>(`/v1/plants/${encodeURIComponent(slug)}`, {
    tags: ["plants", "curtailment"],
  });
}

export function getMonths() {
  return apiTry<MonthsResponse>("/v1/months", { tags: ["curtailment"] });
}

export function getReports() {
  return apiTry<ReportListResponse>("/v1/reports", { tags: ["reports"] });
}

export function getReport(slug: string) {
  return apiTry<Report>(`/v1/reports/${encodeURIComponent(slug)}`, {
    tags: ["reports"],
  });
}

// The forecast is published in batches (at most daily), so a short fixed cache is enough.
const FORECAST_REVALIDATE_SECONDS = 600;

export function getForecast(scope: string, source: Source = "wind", days = 7) {
  return apiTry<ForecastResponse>(withQuery("/v1/forecast", { scope, source, days }), {
    tags: ["forecast"],
    revalidate: FORECAST_REVALIDATE_SECONDS,
  });
}

export function getForecastScopes() {
  return apiTry<ForecastScope[]>("/v1/forecast/scopes", {
    tags: ["forecast"],
    revalidate: FORECAST_REVALIDATE_SECONDS,
  });
}

export function getForecastModel() {
  return apiTry<ForecastModelMeta>("/v1/forecast/model", {
    tags: ["forecast"],
    revalidate: FORECAST_REVALIDATE_SECONDS,
  });
}

// News: the pipeline collects hourly and moderation revalidates the "news" tag at once.
const NEWS_REVALIDATE_SECONDS = 600;

export function getNews(query: {
  topic?: string;
  source?: string;
  q?: string;
  cursor?: string;
  limit?: number;
}) {
  return apiTry<NewsListResponse>(withQuery("/v1/news", query), {
    tags: ["news"],
    revalidate: NEWS_REVALIDATE_SECONDS,
  });
}

export function getNewsItem(id: number) {
  return apiTry<NewsItemDetail>(`/v1/news/${id}`, {
    tags: ["news"],
    revalidate: NEWS_REVALIDATE_SECONDS,
  });
}

export function getNewsSources() {
  return apiTry<NewsSourceListResponse>("/v1/news/sources", {
    tags: ["news"],
    revalidate: NEWS_REVALIDATE_SECONDS,
  });
}

export function getRegulatoryActs(query: {
  organ?: string;
  topic?: string;
  cursor?: string;
  limit?: number;
}) {
  return apiTry<RegulatoryActListResponse>(withQuery("/v1/regulatory-acts", query), {
    tags: ["news"],
    revalidate: NEWS_REVALIDATE_SECONDS,
  });
}

export function getRegulatoryAct(id: number) {
  return apiTry<RegulatoryActDetail>(`/v1/regulatory-acts/${id}`, {
    tags: ["news"],
    revalidate: NEWS_REVALIDATE_SECONDS,
  });
}

// Prices change at most daily and DEC/FEC monthly, so a longer fixed cache is fine; the pipelines
// also revalidate the "market" and "reliability" tags after each load.
const MARKET_REVALIDATE_SECONDS = 3600;

export function getPld(
  granularity: PldGranularity,
  range: { from?: string; to?: string } = {},
  subsystem?: Subsystem,
) {
  return apiTry<PldResponse>(
    withQuery("/v1/market/pld", { granularity, subsystem, from: range.from, to: range.to }),
    { tags: ["market"], revalidate: MARKET_REVALIDATE_SECONDS },
  );
}

export function getGenerationMix(filter: { subsystem?: string; from?: string; to?: string } = {}) {
  return apiTry<GenerationMixResponse>(withQuery("/v1/system/generation", filter), {
    tags: ["curtailment"],
    revalidate: MARKET_REVALIDATE_SECONDS,
  });
}

export function getHydroSubsystems(subsystem: Subsystem, from: string, to: string) {
  return apiTry<HydroSubsystemsResponse>(
    withQuery("/v1/hydro/subsystems", { subsystem, from, to }),
    { tags: ["curtailment"], revalidate: MARKET_REVALIDATE_SECONDS },
  );
}

export function getReliability(year?: number) {
  return apiTry<ReliabilityResponse>(withQuery("/v1/reliability", { year }), {
    tags: ["reliability"],
    revalidate: MARKET_REVALIDATE_SECONDS,
  });
}

export function getReliabilityDetail(cnpj: string, year?: number) {
  return apiTry<ReliabilityDetailResponse>(
    withQuery(`/v1/reliability/${encodeURIComponent(cnpj)}`, { year }),
    { tags: ["reliability"], revalidate: MARKET_REVALIDATE_SECONDS },
  );
}

export function getTariffFlags(from?: string) {
  return apiTry<TariffFlagsResponse>(withQuery("/v1/tariffs/flags", { from }), {
    tags: ["market"],
    revalidate: MARKET_REVALIDATE_SECONDS,
  });
}

export function getMarketConsumption() {
  return apiTry<MarketConsumptionResponse>("/v1/market/consumption", {
    tags: ["market"],
    revalidate: MARKET_REVALIDATE_SECONDS,
  });
}

const SYSTEM_OPTIONS = { tags: ["curtailment" as const], revalidate: MARKET_REVALIDATE_SECONDS };

/** Hourly balance (hydro, thermal, wind, solar, load, interchange) per subsystem; the API defaults to the last 7 days. */
export function getBalance(filter: { from?: string; to?: string; subsystem?: string } = {}) {
  return apiTry<BalanceResponse>(withQuery("/v1/system/balance", filter), SYSTEM_OPTIONS);
}

/** Months (YYYY-MM) in from/to. */
export function getInterchange(
  scope: "national" | "international" = "national",
  range: { from?: string; to?: string } = {},
) {
  return apiTry<InterchangeResponse>(
    withQuery("/v1/system/interchange", { scope, ...range }),
    SYSTEM_OPTIONS,
  );
}

/** Months (YYYY-MM) in from/to. */
export function getThermalDispatch(
  filter: { from?: string; to?: string; subsystem?: string } = {},
) {
  return apiTry<ThermalDispatchResponse>(
    withQuery("/v1/system/thermal-dispatch", filter),
    SYSTEM_OPTIONS,
  );
}

export function getReservoirs(subsystem?: string) {
  return apiTry<ReservoirListResponse>(
    withQuery("/v1/hydro/reservoirs", { subsystem }),
    SYSTEM_OPTIONS,
  );
}

export function getSpilledEnergy(
  filter: { limit?: number; month?: string; subsystem?: string } = {},
) {
  return apiTry<SpilledEnergyResponse>(
    withQuery("/v1/hydro/spilled-energy", { limit: 200, ...filter }),
    SYSTEM_OPTIONS,
  );
}

/** Monthly generation and capacity factor of any power plant (hydro, thermal, nuclear, wind, solar). */
export function getPlantGeneration(slug: string) {
  return apiTry<PlantGenerationResponse>(
    `/v1/plants/${encodeURIComponent(slug)}/generation`,
    SYSTEM_OPTIONS,
  );
}
