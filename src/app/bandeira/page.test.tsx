import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/api/client";

const queries = vi.hoisted(() => ({
  getFlagRule: vi.fn(),
  getFlagMonths: vi.fn(),
  getFlagForecast: vi.fn(),
  getFlagScoreboard: vi.fn(),
}));
vi.mock("@/lib/api/queries", () => queries);

import FlagPage from "./page";

const attribution = {
  text: "Fonte dos números da regra: CCEE, InfoBandeira Tarifária.",
  sources: ["CCEE InfoBandeira Tarifária"],
  legal_note: "É preciso parecer jurídico antes de qualquer uso comercial.",
};

const rule = {
  formula: "GSF = round(GH / GF, 2); limite = min(PLDmax, max(PLDmin, Lim / (1 - GSF)))",
  versions: [
    {
      name: "B",
      lim_green: 31.9275,
      lim_yellow: 69.059,
      lim_red1: 92.4683,
      gfom: false,
      effective_from: null,
      status: "adjusted, to be confirmed in Annex I of REH 3.306/2024",
    },
    {
      name: "C",
      lim_green: 27.4798,
      lim_yellow: 68.992,
      lim_red1: 95.0522,
      gfom: true,
      effective_from: "2024-04-01",
      status: "adjusted, to be confirmed in Annex I of REH 3.306/2024",
    },
  ],
  gfom: [
    {
      original: "Verde",
      steps: [
        { up_to_mwm: 6962, flag: "Verde" },
        { up_to_mwm: 11362, flag: "Amarela" },
      ],
    },
  ],
  latest_month: "2026-08-01",
  latest_rule_version: "C",
  pld_min_brl_per_mwh: 57.31,
  pld_max_brl_per_mwh: 785.27,
  gsf: 0.72,
  pld_trigger_brl_per_mwh: 128.67,
  flag: "Amarela",
  green_upper_brl_per_mwh: 98.14,
  yellow_upper_brl_per_mwh: 246.4,
  red1_upper_brl_per_mwh: 339.47,
  attribution,
};

const months = {
  attribution,
  items: [
    {
      month: "2026-08-01",
      rule_version: "C",
      pld_min_brl_per_mwh: 57.31,
      pld_max_brl_per_mwh: 785.27,
      gh_mwmed: 37885,
      gf_mwmed: 52911,
      gsf: 0.72,
      pld_trigger_brl_per_mwh: 128.67,
      gfom_mwmed: 0,
      green_upper_brl_per_mwh: 98.14,
      yellow_upper_brl_per_mwh: 246.4,
      red1_upper_brl_per_mwh: 339.47,
      flag: "Amarela",
      bulletin_number: 100,
      bulletin_url: "https://www.ccee.org.br/documents/x.pdf",
      bulletin_published_on: "2026-08-06",
      revised_on: null,
    },
  ],
};

const notPublished = {
  published: false,
  target_month: null,
  official_flag: null,
  latest_official_month: "2026-10-01",
  latest_official_flag: "Verde",
  runs: [],
  notice: "Previsão em avaliação: ainda não há prazo que tenha passado no critério de publicação.",
  disclaimer: "Previsão estatística, não é a decisão da ANEEL nem aconselhamento financeiro.",
  attribution,
};

const published = {
  ...notPublished,
  published: true,
  target_month: "2026-11-01",
  runs: [
    {
      lead_days: 14,
      generated_at: "2026-10-15T12:00:00Z",
      data_through: "2026-10-14",
      model_version: "ridge-20261015",
      rule_version: "C",
      trigger_p10_brl_per_mwh: 80,
      trigger_p50_brl_per_mwh: 120,
      trigger_p90_brl_per_mwh: 240,
      probabilities: [
        { flag: "Verde", prob: 0.3, band_lower_brl_per_mwh: 57.31, band_upper_brl_per_mwh: 98.14 },
        {
          flag: "Amarela",
          prob: 0.6,
          band_lower_brl_per_mwh: 98.15,
          band_upper_brl_per_mwh: 246.4,
        },
        {
          flag: "Vermelha P1",
          prob: 0.1,
          band_lower_brl_per_mwh: 246.41,
          band_upper_brl_per_mwh: 339.47,
        },
        {
          flag: "Vermelha P2",
          prob: 0,
          band_lower_brl_per_mwh: 339.48,
          band_upper_brl_per_mwh: 785.27,
        },
      ],
    },
  ],
};

const emptyScoreboard = { items: [], summary: [], notice: "Ainda não há previsões publicadas." };

function mock(forecast: unknown, scoreboard: unknown = emptyScoreboard) {
  queries.getFlagRule.mockResolvedValue({ ok: true, data: rule });
  queries.getFlagMonths.mockResolvedValue({ ok: true, data: months });
  queries.getFlagForecast.mockResolvedValue({ ok: true, data: forecast });
  queries.getFlagScoreboard.mockResolvedValue({ ok: true, data: scoreboard });
}

describe("bandeira page", () => {
  beforeEach(() => Object.values(queries).forEach((fn) => fn.mockReset()));

  it("opens with calculator, history and scoreboard when no lead is published", async () => {
    mock(notPublished);
    render(await FlagPage());

    expect(screen.getByText("Previsão em avaliação")).toBeInTheDocument();
    expect(screen.getByRole("form", { name: "Calculadora da bandeira" })).toBeInTheDocument();
    expect(screen.getByText("nº 100")).toBeInTheDocument();
    expect(screen.getByText(/Ainda não há previsões publicadas/)).toBeInTheDocument();
    expect(screen.getAllByText(/não é a decisão da ANEEL/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/parecer jurídico/).length).toBeGreaterThan(0);
    expect(screen.getByText(/ainda não há prazo/)).toBeInTheDocument();
  });

  it("shows probabilities as a table with the colour name written out", async () => {
    mock(published, {
      items: [],
      summary: [{ lead_days: 14, n: 3, mean_brier: 0.31, hit_rate: 0.667 }],
      notice: "O placar começa no primeiro mês previsto.",
    });
    render(await FlagPage());

    expect(screen.queryByText("Previsão em avaliação")).not.toBeInTheDocument();
    expect(
      screen.getByRole("table", { name: "Probabilidade de cada bandeira" }),
    ).toBeInTheDocument();
    expect(screen.getByText("60%")).toBeInTheDocument();
    expect(screen.getByText("14 dias antes")).toBeInTheDocument();
  });

  it("recomputes the colour when the numbers change", async () => {
    mock(notPublished);
    render(await FlagPage());

    const bandeira = () => screen.getByText(/^Bandeira:/).textContent;
    expect(bandeira()).toContain("Amarela");
    fireEvent.change(screen.getByLabelText("PLD gatilho (R$/MWh)"), { target: { value: "300" } });
    expect(bandeira()).toContain("Vermelha 1");
    fireEvent.change(screen.getByLabelText("GSF da bandeira"), { target: { value: "1,02" } });
    expect(bandeira()).toContain("Verde");
    fireEvent.change(screen.getByLabelText("PLD mínimo (R$/MWh)"), { target: { value: "900" } });
    expect(screen.getByText("O PLD mínimo não pode passar do máximo.")).toBeInTheDocument();
  });

  it("says what must change for the last month", async () => {
    mock(notPublished);
    render(await FlagPage());
    expect(screen.getByText(/a bandeira passaria a Vermelha 1/)).toBeInTheDocument();
  });

  it("degrades to the unavailable notice when the API fails", async () => {
    const failure = { ok: false, error: new ApiError(0, "down") };
    for (const fn of Object.values(queries)) fn.mockResolvedValue(failure);
    render(await FlagPage());
    expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Dados indisponíveis no momento").length).toBeGreaterThan(0);
  });
});
