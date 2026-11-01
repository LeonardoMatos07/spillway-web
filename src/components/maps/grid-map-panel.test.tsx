import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GridMapPanel, type GridData } from "./grid-map-panel";

const meta = (omitted: number, warnings: string[] = []) => ({
  source_name: "ONS",
  source_url: "https://dados.ons.org.br/",
  license: "x",
  as_of: null,
  updated_at: null,
  warnings,
  total: 3,
  omitted,
});

const data: GridData = {
  voltageMin: 230,
  substations: {
    type: "FeatureCollection",
    meta: meta(1),
    features: [
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [-40, -10] },
        properties: {
          station_id: "A5",
          substation_id: "A",
          name: "ALFA",
          voltage_kv: 500,
          subsystem: "NE",
          state: "BA",
          main_agent: "CHESF",
        },
      },
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [-37, -8] },
        properties: {
          station_id: "B2",
          substation_id: "B",
          name: "BETA",
          voltage_kv: 230,
          subsystem: "NE",
          state: "PE",
          main_agent: null,
        },
      },
    ],
  },
  lines: {
    type: "FeatureCollection",
    meta: meta(2, ["Esquemático: segmento reto entre as subestações."]),
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            [-40, -10],
            [-37, -8],
          ],
        },
        properties: {
          equipment_code: "L1",
          name: "LT 500 kV ALFA / BETA",
          voltage_kv: 500,
          length_km: 100,
          from_substation: "ALFA",
          to_substation: "BETA",
          from_state: "BA",
          to_state: "PE",
          geometry_kind: "schematic",
        },
      },
    ],
  },
};

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("GridMapPanel", () => {
  it("says the lines are schematic and lists what was left out", () => {
    render(<GridMapPanel initial={data} />);
    expect(screen.getAllByText(/segmentos retos|segmento reto|linha reta/i).length).toBeGreaterThan(
      0,
    );
    expect(screen.getByText(/1 subestações sem posição publicada e/)).toBeInTheDocument();
    expect(
      screen.getByText("Esquemático: segmento reto entre as subestações."),
    ).toBeInTheDocument();
  });

  it("has both tables and switches between them", () => {
    render(<GridMapPanel initial={data} />);
    expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(3);
    fireEvent.click(screen.getByRole("button", { name: /Linhas \(1\)/ }));
    expect(screen.getByText("LT 500 kV ALFA / BETA")).toBeInTheDocument();
  });

  it("shows the selected substation and the lines tied to it", () => {
    render(<GridMapPanel initial={data} />);
    fireEvent.click(screen.getByRole("button", { name: "ALFA" }));
    expect(screen.getByText(/Linhas ligadas a ela no mapa: 1/)).toBeInTheDocument();
  });

  it("fetches another minimum voltage once and keeps it", async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({ ...data, voltageMin: 0 }),
    }));
    vi.stubGlobal("fetch", fetchMock);
    render(<GridMapPanel initial={data} />);
    const select = screen.getByLabelText("Tensão mínima");
    fireEvent.change(select, { target: { value: "0" } });
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(select).toHaveValue("0"));
    fireEvent.change(select, { target: { value: "230" } });
    fireEvent.change(select, { target: { value: "0" } });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
