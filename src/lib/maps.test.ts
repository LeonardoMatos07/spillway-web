import { describe, expect, it } from "vitest";
import type { GeoStateCurtailment } from "@/lib/api/types";
import { isProtected } from "@/lib/route-access";
import {
  CLASS_COUNT,
  classIndex,
  classLimits,
  MAP_LAYERS,
  parseStatesMapParams,
  parseVoltageMin,
  rankStates,
  spreadCoincident,
  voltageClass,
  storageClass,
  storageClassLabel,
  stepMonth,
  summarizeStates,
} from "./maps";

const item = (
  state: string,
  pct: number | null,
  brl: number | null = 1000,
): GeoStateCurtailment => ({
  state,
  curtailment_pct: pct,
  curtailed_mwh: 10,
  verified_generation_mwh: 100,
  estimated_loss_brl: brl,
  affected_plants: 2,
});

describe("parseStatesMapParams", () => {
  it("accepts a valid month, source and indicator and ignores the rest", () => {
    expect(parseStatesMapParams({ mes: "2026-09", fonte: "wind", metrica: "brl" })).toEqual({
      mes: "2026-09",
      fonte: "wind",
      metrica: "brl",
    });
    expect(parseStatesMapParams({ mes: "2026-13", fonte: "coal", metrica: "x" })).toEqual({
      mes: null,
      fonte: "total",
      metrica: "pct",
    });
    expect(parseStatesMapParams(new URLSearchParams("mes=2025-01&fonte=solar")).fonte).toBe(
      "solar",
    );
  });
});

describe("color classes", () => {
  it("has CLASS_COUNT - 1 limits that grow, and none without values", () => {
    const limits = classLimits(50);
    expect(limits).toHaveLength(CLASS_COUNT - 1);
    expect([...limits].sort((a, b) => a - b)).toEqual(limits);
    expect(limits.at(-1)).toBeLessThan(50);
    expect(classLimits(0)).toEqual([]);
  });

  it("puts a value in the first class that holds it, the maximum in the last, no data in none", () => {
    const limits = classLimits(50);
    expect(classIndex(0, limits)).toBe(0);
    expect(classIndex(50, limits)).toBe(CLASS_COUNT - 1);
    expect(classIndex(null, limits)).toBeNull();
  });
});

describe("ranking and summary", () => {
  const items = [item("BA", 10), item("RN", 30), item("CE", null), item("PI", 30)];

  it("sorts by value, then by name, with empty values last", () => {
    expect(rankStates(items, "pct").map((r) => r.state)).toEqual(["PI", "RN", "BA", "CE"]);
  });

  it("describes the top states in words", () => {
    const text = summarizeStates(rankStates(items, "pct"), "pct", "setembro de 2026", "Eólica");
    expect(text).toContain("3 estados com dados");
    expect(text).toContain("Piauí");
    expect(summarizeStates([], "pct", "setembro de 2026", "Eólica")).toMatch(/Sem dados/);
  });
});

describe("stepMonth", () => {
  it("moves along the months whatever the order of the list", () => {
    const months = ["2026-09", "2026-07", "2026-08"];
    expect(stepMonth(months, "2026-08", 1)).toBe("2026-09");
    expect(stepMonth(months, "2026-08", -1)).toBe("2026-07");
    expect(stepMonth(months, "2026-09", 1)).toBeNull();
    expect(stepMonth(months, null, 1)).toBeNull();
  });
});

describe("access", () => {
  it("keeps /mapas open and lets the states layer decide on its own (account invitation)", () => {
    expect(isProtected("/mapas")).toBe(false);
    expect(MAP_LAYERS.find((l) => l.key === "estados")?.account).toBe(true);
  });
});

describe("storage classes", () => {
  it("splits the EAR at 20, 40, 60 and 80 and keeps missing values apart", () => {
    expect(storageClass(5)).toBe(0);
    expect(storageClass(20)).toBe(1);
    expect(storageClass(79.9)).toBe(3);
    expect(storageClass(120)).toBe(4);
    expect(storageClass(-5)).toBe(0);
    expect(storageClass(null)).toBeNull();
    expect(storageClassLabel(0)).toBe("menos de 20%");
    expect(storageClassLabel(4)).toBe("80% ou mais");
  });
});

describe("voltage classes", () => {
  it("groups the voltages of the register in five classes", () => {
    expect(voltageClass(69)).toBe(0);
    expect(voltageClass(88)).toBe(0);
    expect(voltageClass(138)).toBe(1);
    expect(voltageClass(230)).toBe(2);
    expect(voltageClass(440)).toBe(3);
    expect(voltageClass(500)).toBe(4);
    expect(voltageClass(800)).toBe(4);
    expect(voltageClass(null)).toBeNull();
  });

  it("takes only the offered minimum voltages and defaults to the high ones", () => {
    expect(parseVoltageMin("0")).toBe(0);
    expect(parseVoltageMin("500")).toBe(500);
    expect(parseVoltageMin("77")).toBe(230);
    expect(parseVoltageMin(null)).toBe(230);
    expect(parseVoltageMin("x")).toBe(230);
  });
});

describe("spreadCoincident", () => {
  it("keeps a lone point where it is and separates the ones that share a substation", () => {
    const out = spreadCoincident([
      { id: "a", lon: -40, lat: -10 },
      { id: "b", lon: -41, lat: -11 },
      { id: "c", lon: -41, lat: -11 },
      { id: "d", lon: -41, lat: -11 },
    ]);
    expect(out.get("a")).toEqual([-40, -10]);
    const spread = ["b", "c", "d"].map((id) => out.get(id)!.join(","));
    expect(new Set(spread).size).toBe(3);
    for (const id of ["b", "c", "d"]) {
      const [lon, lat] = out.get(id)!;
      expect(Math.hypot(lon! + 41, lat! + 11)).toBeLessThan(0.1);
    }
  });
});
