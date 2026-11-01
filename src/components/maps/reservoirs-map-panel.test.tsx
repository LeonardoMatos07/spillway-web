import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ReservoirsMapPanel } from "./reservoirs-map-panel";
import type { ReservoirCollection } from "@/lib/api/types";

const feature = (
  slug: string,
  name: string,
  sub: string,
  basin: string,
  pct: number | null,
  volume: number,
): ReservoirCollection["features"][number] => ({
  type: "Feature",
  geometry: { type: "Point", coordinates: [-50, -20] },
  properties: {
    slug,
    name,
    plant_name: null,
    subsystem: sub,
    basin,
    river: null,
    useful_volume_hm3: volume,
    storage_pct: pct,
    ena_storable_pct_mlt: null,
    day: "2026-09-02",
  },
});

const data: ReservoirCollection = {
  type: "FeatureCollection",
  meta: {
    source_name: "ONS",
    source_url: "https://dados.ons.org.br/",
    license: "x",
    as_of: "2026-09-02",
    updated_at: null,
    warnings: ["Posição como publicada pelo ONS."],
    total: 4,
    omitted: 1,
  },
  features: [
    feature("a", "A. VERMELHA", "SE", "GRANDE", 29.5, 5856),
    feature("b", "SOBRADINHO", "NE", "SAO FRANCISCO", 61, 28669),
    feature("c", "SEM MEDIDA", "NE", "SAO FRANCISCO", null, 10),
  ],
};

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
});
afterEach(() => vi.restoreAllMocks());

describe("ReservoirsMapPanel", () => {
  it("offers the same data as a table and a text summary, and explains the omitted ones", () => {
    render(<ReservoirsMapPanel initial={data} />);
    const table = screen.getByRole("table");
    expect(within(table).getAllByRole("row")).toHaveLength(4);
    expect(screen.getAllByText(/Mais cheio: SOBRADINHO/).length).toBeGreaterThan(0);
    expect(screen.getByText(/1 reservatórios do cadastro não têm posição/)).toBeInTheDocument();
    expect(screen.getByText("Posição como publicada pelo ONS.")).toBeInTheDocument();
  });

  it("filters the table by subsystem", () => {
    render(<ReservoirsMapPanel initial={data} />);
    fireEvent.change(screen.getByLabelText("Subsistema"), { target: { value: "SE" } });
    expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(2);
  });

  it("sorts by a header and marks it with aria-sort", () => {
    render(<ReservoirsMapPanel initial={data} />);
    fireEvent.click(screen.getByRole("button", { name: /^EAR/ }));
    const header = screen.getByRole("columnheader", { name: /EAR/ });
    expect(header).toHaveAttribute("aria-sort", "descending");
    const first = within(screen.getByRole("table")).getAllByRole("row")[1];
    expect(first).toHaveTextContent("SOBRADINHO");
  });

  it("falls back to the table when the browser has no WebGL", async () => {
    render(<ReservoirsMapPanel initial={data} />);
    await waitFor(() => expect(screen.getByText(/WebGL/)).toBeInTheDocument());
  });
});
