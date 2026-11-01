import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PlantsMapPanel } from "./plants-map-panel";
import type { PlantGeoCollection, PlantGeoFeature } from "@/lib/api/types";

const plant = (
  id: string,
  name: string,
  pct: number | null,
  precision: "substation" | "official" = "substation",
): PlantGeoFeature => ({
  type: "Feature",
  geometry: { type: "Point", coordinates: [-41.2, -10.5] },
  properties: {
    id,
    slug: id.toLowerCase(),
    name,
    source: "wind",
    state: "BA",
    subsystem: "NE",
    capacity_mw: 100,
    connection_point: "ALFA - 230 kV (A)",
    location_precision: precision,
    matched_on: "A2",
    month: "2026-09-01",
    curtailed_mwh: 500,
    curtailment_pct: pct,
    estimated_loss_brl: 1000,
  },
});

const data: PlantGeoCollection = {
  type: "FeatureCollection",
  meta: {
    source_name: "ONS",
    source_url: "https://dados.ons.org.br/",
    license: "x",
    as_of: "2026-09-01",
    updated_at: null,
    warnings: ["Posição aproximada pela subestação de conexão."],
    total: 3,
    omitted: 1,
  },
  features: [plant("P1", "Alpha I", 12.5), plant("P2", "Alpha II", 40, "official")],
  unlocated: [
    {
      id: "P3",
      slug: "p3",
      name: "Sem Posicao",
      source: "solar",
      state: "PI",
      capacity_mw: 50,
      connection_point: "NAOEXISTE230kVA",
      curtailed_mwh: null,
    },
  ],
};

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("PlantsMapPanel", () => {
  it("says the position is approximate and lists the plants without one", () => {
    render(
      <PlantsMapPanel
        initial={data}
        months={["2026-09", "2026-08"]}
        initialFilters={{ month: null, source: "", state: "" }}
      />,
    );
    expect(screen.getAllByText(/aproximada pela subestação/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Sem localização \(1\)/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sem Posicao" })).toHaveAttribute("href", "/usinas/p3");
    expect(screen.getByText(/Círculo com contorno grosso/)).toBeInTheDocument();
  });

  it("has a table with the same plants, sortable by the percentage cut", () => {
    render(
      <PlantsMapPanel
        initial={data}
        months={["2026-09"]}
        initialFilters={{ month: null, source: "", state: "" }}
      />,
    );
    const table = screen.getAllByRole("table")[0]!;
    const rows = within(table).getAllByRole("row");
    expect(rows).toHaveLength(3);
    expect(rows[1]).toHaveTextContent("Alpha II");
    fireEvent.click(screen.getByRole("button", { name: /^% de corte/ }));
    expect(screen.getByRole("columnheader", { name: /% de corte/ })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
  });

  it("asks the server for another source and keeps it in the URL", async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({ ...data, features: [] }),
    }));
    vi.stubGlobal("fetch", fetchMock);
    render(
      <PlantsMapPanel
        initial={data}
        months={["2026-09"]}
        initialFilters={{ month: null, source: "", state: "" }}
      />,
    );
    fireEvent.change(screen.getByLabelText("Fonte"), { target: { value: "solar" } });
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(String((fetchMock.mock.calls as unknown[][])[0]?.[0])).toContain("fonte=solar");
    await waitFor(() => expect(window.location.search).toContain("fonte=solar"));
    window.history.replaceState(null, "", "/");
  });
});
