import type { components } from "./schema";
import type * as T from "./types";

type S = components["schemas"];
type Assert<Cond extends true> = Cond;
type Fits<A, B> = [A] extends [B]
  ? [keyof A] extends [keyof B]
    ? [keyof B] extends [keyof A]
      ? true
      : false
    : false
  : false;

export type ResponseChecks = [
  Assert<Fits<S["SubsystemCurtailmentResponse"], T.SubsystemCurtailmentResponse>>,
  Assert<Fits<S["StateCurtailmentResponse"], T.StateCurtailmentResponse>>,
  Assert<Fits<S["GeoStatesResponse"], T.GeoStatesResponse>>,
  Assert<Fits<S["GeoStatesMeta"], T.GeoStatesMeta>>,
  Assert<Fits<S["GeoStateCurtailment"], T.GeoStateCurtailment>>,
  Assert<Fits<S["ReservoirCollection"], T.ReservoirCollection>>,
  Assert<Fits<S["ReservoirFeature"], T.ReservoirFeature>>,
  Assert<Fits<S["ReservoirProperties"], T.ReservoirProperties>>,
  Assert<Fits<S["GeoMeta"], T.GeoMeta>>,
  Assert<Fits<S["GeoPoint"], T.GeoPoint>>,
  Assert<Fits<S["SubstationCollection"], T.SubstationCollection>>,
  Assert<Fits<S["SubstationFeature"], T.SubstationFeature>>,
  Assert<Fits<S["SubstationProperties"], T.SubstationProperties>>,
  Assert<Fits<S["LineCollection"], T.LineCollection>>,
  Assert<Fits<S["LineFeature"], T.LineFeature>>,
  Assert<Fits<S["LineProperties"], T.LineProperties>>,
  Assert<Fits<S["GeoLine"], T.GeoLine>>,
  Assert<Fits<S["PlantListResponse"], T.PlantListResponse>>,
  Assert<Fits<S["PlantDetailResponse"], T.PlantDetailResponse>>,
  Assert<Fits<S["RankingResponse"], T.RankingResponse>>,
  Assert<Fits<S["MonthsResponse"], T.MonthsResponse>>,
  Assert<Fits<S["ReportListResponse"], T.ReportListResponse>>,
  Assert<Fits<S["Report"], T.Report>>,
  Assert<Fits<S["MessageResponse"], T.MessageResponse>>,
  Assert<Fits<S["ConfirmedResponse"], T.ConfirmedResponse>>,
  Assert<Fits<S["UnsubscribedResponse"], T.UnsubscribedResponse>>,
  Assert<Fits<S["LoadRunListResponse"], T.LoadRunListResponse>>,
  Assert<Fits<S["AdminReportListResponse"], T.AdminReportListResponse>>,
  Assert<Fits<S["RevalidateResponse"], T.RevalidateResponse>>,
  Assert<Fits<S["PlantCurtailment"], T.PlantMonthlyCurtailment>>,
  Assert<Fits<S["Plant"], T.Plant>>,
  Assert<Fits<S["RankedPlant"], T.RankedPlant>>,
  Assert<Fits<S["ForecastResponse"], T.ForecastResponse>>,
  Assert<Fits<S["ForecastPoint"], T.ForecastPoint>>,
  Assert<Fits<S["ForecastScope"], T.ForecastScope>>,
];

export type RequestChecks = [
  Assert<[T.NewsletterSignup] extends [S["NewsletterSignup"]] ? true : false>,
  Assert<[T.ReportInput] extends [S["ReportInput"]] ? true : false>,
  Assert<[T.RevalidateInput] extends [S["RevalidateInput"]] ? true : false>,
];
