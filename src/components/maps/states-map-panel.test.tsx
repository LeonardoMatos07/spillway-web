import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { StatesMapPanel } from "./states-map-panel";
import type { GeoStatesResponse } from "@/lib/api/types";

const data: GeoStatesResponse = {
  meta: {
    source_name: "ONS",
    source_url: "https://dados.ons.org.br/",
    license: "x",
    data_source: "total",
    month: "2026-09",
    months: ["2026-08", "2026-09"],
    updated_at: null,
    warnings: ["Valores por UF."],
    omitted: 26,
    omitted_states: ["SP"],
  },
  items: [
    {
      state: "BA",
      curtailment_pct: 10.5,
      curtailed_mwh: 100,
      verified_generation_mwh: 900,
      estimated_loss_brl: 1000,
      affected_plants: 3,
    },
  ],
};

beforeEach(() => {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
});
afterEach(() => vi.unstubAllGlobals());

describe("StatesMapPanel", () => {
  it("in full mode has the table and the play button", () => {
    render(<StatesMapPanel initial={data} initialMetric="pct" />);
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reproduzir meses" })).toBeInTheDocument();
  });

  it("in compact mode keeps the map and legend, drops the table and links to the layer", () => {
    render(<StatesMapPanel initial={data} initialMetric="pct" compact />);
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Reproduzir meses" })).not.toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Legenda" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Abrir em Mapas" })).toHaveAttribute(
      "href",
      "/mapas/estados",
    );
  });
});
