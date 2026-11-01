export type Source = "wind" | "solar";
export type AggregateSource = Source | "total";
export type Subsystem = "N" | "NE" | "S" | "SE";
export type SubsystemOrSin = Subsystem | "SIN";
export type PlantKind = "plant" | "cluster";
export type PriceBasis = "PLD" | "CMO" | "PLD_FILLED" | "CMO_FILLED";
export type LoadRunStatus = "running" | "success" | "failed";

export type Month = string;
export type Timestamp = string;

export interface CurtailmentAggregateBase {
  source: AggregateSource;
  month: Month;
  verified_generation_mwh: number;
  curtailed_mwh: number;
  curtailment_pct: number | null;
  curtailed_rel_mwh: number;
  curtailed_cnf_mwh: number;
  curtailed_ene_mwh: number;
  curtailed_other_mwh: number;
  estimated_loss_brl: number | null;
  affected_plants: number;
  updated_at: Timestamp;
}

export interface CurtailmentSummary {
  scope: string;
  source: AggregateSource;
  start: Month | null;
  end: Month | null;
  months: number;
  verified_generation_mwh: number;
  curtailed_mwh: number;
  curtailed_rel_mwh: number;
  curtailed_cnf_mwh: number;
  curtailed_ene_mwh: number;
  curtailed_other_mwh: number;
  curtailment_pct: number | null;
  estimated_loss_brl: number | null;
  affected_plants: number;
}

export interface StateMonthlyCurtailment extends CurtailmentAggregateBase {
  state: string;
}

export interface SubsystemMonthlyCurtailment extends CurtailmentAggregateBase {
  subsystem: SubsystemOrSin | (string & {});
}

export interface PlantMonthlyCurtailment {
  plant_id: string;
  month: Month;
  verified_generation_mwh: number;
  curtailed_mwh: number;
  curtailment_pct: number | null;
  curtailed_rel_mwh: number;
  curtailed_cnf_mwh: number;
  curtailed_ene_mwh: number;
  curtailed_other_mwh: number;
  estimated_loss_brl: number | null;
  price_basis: PriceBasis | (string & {}) | null;
  restricted_hours: number;
  state_avg_curtailment_pct: number | null;
  national_rank: number | null;
  state_rank: number | null;
  updated_at: Timestamp;
}

export interface PlantSummary {
  id: string;
  kind: PlantKind;
  name: string;
  slug: string;
  source: Source;
  state: string;
  subsystem: Subsystem | (string & {});
  capacity_mw: number | null;
}

export interface Plant extends PlantSummary {
  cluster_id: string | null;
  ceg: string | null;
  connection_point: string | null;
  operator: string | null;
  updated_at: Timestamp;
}

export interface RankedPlant extends PlantSummary {
  rank: number;
  curtailed_mwh: number;
  curtailment_pct: number | null;
  estimated_loss_brl: number | null;
}

export interface ReportSummary {
  month: Month;
  title: string;
  slug: string;
  summary: string | null;
  published_at: Timestamp | null;
}

export interface Report extends ReportSummary {
  content: string;
}

export interface LoadRun {
  id: number;
  dataset: string;
  period: Month | null;
  source_file: string | null;
  checksum: string | null;
  row_count: number | null;
  started_at: Timestamp;
  finished_at: Timestamp | null;
  status: LoadRunStatus;
  detail: string | null;
}

export interface SubsystemCurtailmentResponse {
  items: SubsystemMonthlyCurtailment[];
}

export interface StateCurtailmentResponse {
  series: StateMonthlyCurtailment[];
  ranking: RankedPlant[];
  ranking_month: Month | null;
}

export interface GeoStateCurtailment {
  state: string;
  curtailment_pct: number | null;
  curtailed_mwh: number;
  verified_generation_mwh: number;
  estimated_loss_brl: number | null;
  affected_plants: number;
}

export interface GeoStatesMeta {
  source_name: string;
  source_url: string;
  license: string;
  data_source: AggregateSource;
  month: Month | null;
  months: Month[];
  updated_at: Timestamp | null;
  warnings: string[];
  omitted: number;
  omitted_states: string[];
}

export interface GeoStatesResponse {
  meta: GeoStatesMeta;
  items: GeoStateCurtailment[];
}

/** Envelope of the GeoJSON map layers (`/v1/geo/*`). */
export interface GeoMeta {
  source_name: string;
  source_url: string;
  license: string;
  as_of: string | null;
  updated_at: Timestamp | null;
  warnings: string[];
  total: number;
  omitted: number;
}

export interface GeoPoint {
  type: "Point";
  coordinates: [number, number];
}

export interface ReservoirProperties {
  slug: string;
  name: string;
  plant_name: string | null;
  subsystem: string | null;
  basin: string | null;
  river: string | null;
  useful_volume_hm3: number | null;
  storage_pct: number | null;
  ena_storable_pct_mlt: number | null;
  day: string | null;
}

export interface ReservoirFeature {
  type: "Feature";
  geometry: GeoPoint;
  properties: ReservoirProperties;
}

export interface ReservoirCollection {
  type: "FeatureCollection";
  meta: GeoMeta;
  features: ReservoirFeature[];
}

export interface PlantListResponse {
  items: PlantSummary[];
  total: number;
  page: number;
  page_size: number;
}

export interface PlantDetailResponse {
  plant: Plant;
  cluster: PlantSummary | null;
  cluster_plants: PlantSummary[];
  series: PlantMonthlyCurtailment[];
}

export interface RankingResponse {
  month: Month | null;
  items: RankedPlant[];
}

export interface MonthsResponse {
  months: Month[];
}

export interface ReportListResponse {
  items: ReportSummary[];
}

export interface MessageResponse {
  message: string;
}

export interface NewsletterSignup {
  email: string;
  consent: true;
  source?: string;
}

export interface ConfirmedResponse {
  confirmed: boolean;
}

export interface UnsubscribedResponse {
  unsubscribed: boolean;
}

export interface LoadRunListResponse {
  items: LoadRun[];
}

export interface AdminReport extends Report {
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface AdminReportListResponse {
  items: AdminReport[];
}

export interface ReportInput {
  month: Month;
  title: string;
  slug?: string;
  summary?: string | null;
  content: string;
  publish: boolean;
}

export interface RevalidateInput {
  tags?: CacheTag[];
}

export interface RevalidateResponse {
  tags: CacheTag[];
  cache_cleared: boolean;
  entries_removed: number;
  web_revalidated: boolean;
  detail: string | null;
}

export interface ApiErrorBody {
  detail: string | unknown;
}

export const CACHE_TAGS = [
  "curtailment",
  "plants",
  "reports",
  "forecast",
  "news",
  "market",
  "reliability",
] as const;
export type CacheTag = (typeof CACHE_TAGS)[number];

export type MemberRole =
  "researcher" | "student" | "professional" | "journalist" | "public_sector" | "investor" | "other";

export interface MemberProfile {
  id: string;
  email: string;
  name: string;
  role: MemberRole;
  organization: string | null;
  job_title: string | null;
  segment: string | null;
  institution: string | null;
  regions: string[];
  plants: string[];
  interests: string[];
  marketing_opt_in: boolean;
  created_at: Timestamp;
}

export interface LoginResponse {
  session_token: string;
  expires_at: Timestamp;
  member: MemberProfile;
}

export interface SignupPayload {
  email: string;
  password: string;
  name: string;
  role: MemberRole;
  organization?: string | null;
  job_title?: string | null;
  segment?: string | null;
  company_size?: string | null;
  institution?: string | null;
  study_level?: string | null;
  regions: string[];
  plants: string[];
  interests: string[];
  phone?: string | null;
  referral?: string | null;
  marketing_opt_in: boolean;
  consent: true;
  source?: string | null;
}

export interface RankedGroup {
  rank: number;
  name: string;
  state: string | null;
  plants: number;
  affected_plants: number;
  verified_generation_mwh: number;
  curtailed_mwh: number;
  curtailment_pct: number | null;
  estimated_loss_brl: number | null;
  compensable_mwh: number;
}

export interface GroupRankingResponse {
  group: "operator" | "connection_point";
  source: AggregateSource;
  start: Month | null;
  end: Month | null;
  items: RankedGroup[];
}

export type DayType = "weekday" | "weekend";

export interface HourlyPoint {
  day_type: DayType;
  hour: number;
  avg_curtailed_mwh: number;
  avg_generation_mwh: number;
  curtailment_pct: number | null;
}

export interface HourlyProfileResponse {
  scope: string;
  source: AggregateSource;
  start: Month | null;
  end: Month | null;
  months: number;
  points: HourlyPoint[];
}

export interface UsageTotals {
  events: number;
  page_views: number;
  members_active: number;
  visitors: number;
  sessions: number;
  new_members: number;
}

export interface UsageSummary {
  start: Timestamp;
  end: Timestamp;
  days: number;
  include_bots: boolean;
  totals: UsageTotals;
  daily: { day: string; page_views: number; interactions: number; members: number }[];
  sections: { section: string; views: number; members: number }[];
  entities: { entity_type: string; entity_id: string; views: number; members: number }[];
  searches: { name: string; count: number }[];
  interactions: { name: string; count: number }[];
  compared: { name: string; count: number }[];
  funnel: { step: string; count: number }[];
  roles: { role: string | null; segment: string | null; members: number; events: number }[];
  active_leads: {
    member_id: string;
    name: string;
    email: string;
    organization: string | null;
    role: string;
    lead_tier: string;
    lead_score: number;
    events: number;
    last_seen: Timestamp | null;
  }[];
}

export interface SignupResponse {
  message: string;
  dev_code: string | null;
}

export type ForecastLevel = "baixo" | "medio" | "alto";

export interface ForecastPoint {
  ts: string;
  risk_probability: number;
  expected_curtailment_pct: number;
  level: ForecastLevel;
  applicable: boolean;
}

export interface ForecastResponse {
  scope: string;
  source: Source;
  risk_definition: string;
  origin_ts: string;
  valid_from: string;
  valid_to: string;
  generated_at: string;
  data_through: string;
  stale_days: number;
  model_version: string;
  model_trained_at: string;
  points: ForecastPoint[];
}

export interface ForecastScope {
  scope: string;
  source: Source;
}

/** Metrics of one model on the untouched test period. `mae_pp` is in percentage points. */
export interface ForecastModelMetrics {
  mae_pp: number;
  rmse_pp: number;
  roc_auc: number;
  pr_auc: number;
  brier: number;
  ece: number;
  brier_skill?: number;
}

export interface ForecastInterval {
  delta: number;
  ci_low: number;
  ci_high: number;
}

export interface ForecastCalibrationBin {
  mean_pred: number;
  obs: number;
  n: number;
}

export interface ForecastModelMeta {
  model_version: string;
  trained_at: string;
  data_period: Record<string, { start: string; end: string; n_series: number }>;
  n_series: number;
  n_rows: number;
  metrics: {
    test?: Record<string, ForecastModelMetrics>;
    test_bootstrap_vs_baseline?: Record<
      string,
      { abs_error?: ForecastInterval; brier?: ForecastInterval }
    >;
    test_start?: string;
    test_rows?: number;
    test_base_rate?: number;
  };
  calibration: { bins?: Record<string, ForecastCalibrationBin[]> };
  feature_importance: Record<string, number>;
  model_card: { limitations?: string[]; protocol?: string };
  last_run_at: string | null;
  last_data_through: string | null;
}

export type NewsStatus = "published" | "hidden" | "removed_on_request";

export interface RelatedLink {
  label: string;
  href: string;
}

export interface NewsSource {
  slug: string;
  publisher_name: string;
  homepage_url: string;
  fetch_method: string;
  license_code: string;
  license_url: string;
  license_verified_at: string | null;
  license_evidence_url: string | null;
  active: boolean;
}

export interface NewsSourceListResponse {
  items: NewsSource[];
}

export interface NewsItem {
  id: number;
  source: string;
  publisher_name: string;
  license_code: string;
  license_url: string;
  url: string;
  title: string;
  summary: string | null;
  published_at: string;
  source_updated_at: string | null;
  topics: string[];
  has_editor_note: boolean;
}

export interface NewsItemDetail extends NewsItem {
  editor_note: string | null;
  editor_note_by: string | null;
  editor_note_at: string | null;
  related_links: RelatedLink[];
}

export interface NewsListResponse {
  items: NewsItem[];
  next_cursor: string | null;
}

export interface AdminNewsItem extends NewsItemDetail {
  status: NewsStatus;
}

export interface AdminNewsList {
  items: AdminNewsItem[];
  next_cursor: string | null;
}

export interface RegulatoryAct {
  id: number;
  organ: string;
  act_type: string;
  act_number: string | null;
  act_date: string | null;
  title: string;
  summary: string | null;
  dou_date: string;
  dou_section: number | null;
  dou_edition: string | null;
  dou_page: string | null;
  dou_url: string;
  topics: string[];
}

export interface RegulatoryActDetail extends RegulatoryAct {
  body: string | null;
}

export interface RegulatoryActListResponse {
  items: RegulatoryAct[];
  next_cursor: string | null;
}

export interface DataSourceInfo {
  slug: string;
  publisher_name: string;
  dataset_name: string;
  dataset_url: string;
  license_code: string;
  license_url: string;
  license_verified_at: string;
  attribution_text: string;
  update_frequency: string;
}

export type PldGranularity = "hourly" | "daily" | "weekly" | "monthly";

export interface PldPoint {
  period: string;
  subsystem: Subsystem;
  pld_avg_brl_per_mwh: number;
  pld_min_brl_per_mwh: number | null;
  pld_max_brl_per_mwh: number | null;
  pld_std_brl_per_mwh: number | null;
  hours_at_floor: number | null;
  hours_at_cap: number | null;
  hours: number | null;
}

export interface PldResponse {
  granularity: PldGranularity;
  variant: "official" | "shadow";
  date_from: string;
  date_to: string;
  source: DataSourceInfo;
  points: PldPoint[];
}

export interface ReliabilityDistributor {
  cnpj: string;
  acronym: string;
  consumers: number;
  dec_hours: number;
  fec_count: number;
  dec_limit_hours: number | null;
  fec_limit_count: number | null;
  months_with_data: number;
  sets: number;
}

export interface ReliabilityResponse {
  year: number;
  years: number[];
  months_with_data: number;
  source: DataSourceInfo;
  items: ReliabilityDistributor[];
}

export interface ReliabilityMonthPoint {
  month: string;
  consumers: number;
  dec_hours: number;
  fec_count: number;
}

export interface ReliabilityDetailResponse {
  year: number;
  years: number[];
  distributor: ReliabilityDistributor;
  source: DataSourceInfo;
  points: ReliabilityMonthPoint[];
}

export interface HydroSubsystemPoint {
  day: string;
  subsystem: Subsystem;
  storage_pct: number | null;
  ena_storable_pct_mlt: number | null;
}

export interface HydroSubsystemsResponse {
  date_from: string;
  date_to: string;
  points: HydroSubsystemPoint[];
}

export type GenerationSource = "hydro" | "thermal" | "wind" | "solar";

export interface GenerationMixPoint {
  month: string;
  subsystem: SubsystemOrSin;
  source: GenerationSource;
  energy_mwh: number;
  avg_mw: number;
  peak_mw: number;
  share_pct: number | null;
}

export interface GenerationMixResponse {
  points: GenerationMixPoint[];
}

export interface TariffFlagPoint {
  month: string;
  flag: string;
  additional_brl_per_mwh: number;
}

export interface TariffFlagsResponse {
  source: DataSourceInfo;
  items: TariffFlagPoint[];
}

export interface MarketConsumptionPoint {
  month: string;
  regulated_mw_avg: number;
  free_mw_avg: number;
  free_share_pct: number;
}

export interface MarketAgentsPoint {
  month: string;
  agent_class: string;
  agents: number;
}

export interface MarketConsumptionResponse {
  source: DataSourceInfo;
  consumption: MarketConsumptionPoint[];
  agents: MarketAgentsPoint[];
}

export interface BalancePoint {
  hour: string;
  hour_utc: string;
  subsystem: Subsystem;
  hydro_mw_avg: number | null;
  thermal_mw_avg: number | null;
  wind_mw_avg: number | null;
  solar_mw_avg: number | null;
  load_mw_avg: number | null;
  net_interchange_mw_avg: number | null;
}

export interface BalanceResponse {
  date_from: string;
  date_to: string;
  points: BalancePoint[];
}

export interface InterchangePoint {
  month: string;
  origin: string;
  destination: string;
  scope: "national" | "international";
  energy_mwh: number;
  scheduled_energy_mwh: number | null;
  avg_mw: number;
  peak_mw: number;
  min_mw: number;
}

export interface InterchangeResponse {
  points: InterchangePoint[];
}

export interface ThermalDispatchPoint {
  month: string;
  reason: string;
  subsystem: string;
  plant_code: string | null;
  plant_name: string | null;
  plants: number;
  verified_mwh: number;
  programmed_mwh: number | null;
}

export interface ThermalDispatchResponse {
  points: ThermalDispatchPoint[];
}

export interface ReservoirSummary {
  id: string;
  name: string;
  slug: string;
  reservoir_type: string | null;
  plant_name: string | null;
  subsystem: string | null;
  basin: string | null;
  river: string | null;
  useful_volume_hm3: number | null;
  latest_day: string | null;
  storage_pct: number | null;
  ena_storable_pct_mlt: number | null;
}

export interface ReservoirListResponse {
  latest_day: string | null;
  items: ReservoirSummary[];
}

export interface SpilledEnergyPoint {
  month: string;
  plant_code: string;
  plant_name: string;
  subsystem: string | null;
  basin: string | null;
  river: string | null;
  agent: string | null;
  spilled_energy_mwh: number;
  spilled_turbinable_energy_mwh: number;
}

export interface SpilledEnergyResponse {
  points: SpilledEnergyPoint[];
}

export interface PowerPlantInfo {
  id: string;
  name: string;
  slug: string;
  source_type: string;
  fuel_type: string | null;
  state: string | null;
  subsystem: string | null;
  capacity_mw: number | null;
}

export interface PlantGenerationPoint {
  month: string;
  energy_mwh: number;
  avg_mw: number;
  peak_mw: number;
  capacity_factor: number | null;
}

export interface PlantGenerationResponse {
  plant: PowerPlantInfo;
  points: PlantGenerationPoint[];
}
