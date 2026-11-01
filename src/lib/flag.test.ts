import { describe, expect, it } from "vitest";
import type { FlagGfomTable } from "@/lib/api/types";
import {
  applyGfom,
  computeBands,
  flagFromTrigger,
  flagLabel,
  gsfBand,
  roundCent,
  whatMustChange,
} from "./flag";

const RULE_B = { lim_green: 31.9275, lim_yellow: 69.059, lim_red1: 92.4683 };
const RULE_C = { lim_green: 27.4798, lim_yellow: 68.992, lim_red1: 95.0522 };

// The same bulletins as the Python engine tests (docs/flag-rule-reproduction.md).
const BULLETINS = [
  {
    rule: RULE_B,
    min: 55.7,
    max: 646.58,
    gsf: 0.83,
    trig: 55.7,
    edges: [187.81, 406.23, 543.93],
    flag: "Verde",
  },
  {
    rule: RULE_B,
    min: 69.04,
    max: 684.73,
    gsf: 0.74,
    trig: 69.04,
    edges: [122.8, 265.61, 355.65],
    flag: "Verde",
  },
  {
    rule: RULE_C,
    min: 61.07,
    max: 716.8,
    gsf: 0.65,
    trig: 254.18,
    edges: [78.51, 197.12, 271.58],
    flag: "Vermelha P1",
  },
  {
    rule: RULE_C,
    min: 58.6,
    max: 751.73,
    gsf: 0.94,
    trig: 208.03,
    edges: [458, 751.73, 751.73],
    flag: "Verde",
  },
  {
    rule: RULE_C,
    min: 58.6,
    max: 751.73,
    gsf: 0.84,
    trig: 304.02,
    edges: [171.75, 431.2, 594.08],
    flag: "Amarela",
  },
  {
    rule: RULE_C,
    min: 57.31,
    max: 785.27,
    gsf: 0.72,
    trig: 128.67,
    edges: [98.14, 246.4, 339.47],
    flag: "Amarela",
  },
  {
    rule: RULE_C,
    min: 57.31,
    max: 785.27,
    gsf: 0.95,
    trig: 183.05,
    edges: [549.6, 785.27, 785.27],
    flag: "Verde",
  },
] as const;

describe("flag rule port", () => {
  it.each(BULLETINS)("reproduces bulletin with GSF $gsf", (b) => {
    const bands = computeBands(b.min, b.max, b.gsf, b.rule);
    expect([bands.greenUpper, bands.yellowUpper, bands.red1Upper]).toEqual(b.edges);
    expect(flagFromTrigger(bands, b.trig)).toBe(b.flag);
  });

  it("rounds the GSF to two decimals", () => {
    expect(gsfBand(37885, 52911)).toBe(0.72);
    expect(roundCent(0.285)).toBe(0.29);
    expect(() => gsfBand(1, 0)).toThrow();
  });

  it("keeps the edges inclusive on the upper side", () => {
    const bands = computeBands(57.31, 785.27, 0.72, RULE_C);
    expect(flagFromTrigger(bands, 98.14)).toBe("Verde");
    expect(flagFromTrigger(bands, 98.15)).toBe("Amarela");
    expect(flagFromTrigger(bands, 339.47)).toBe("Vermelha P1");
    expect(flagFromTrigger(bands, 339.48)).toBe("Vermelha P2");
  });

  it("puts every edge at the PLD maximum when the GSF is 1 or more", () => {
    for (const gsf of [1, 1.03]) {
      const bands = computeBands(57.31, 785.27, gsf, RULE_C);
      expect([bands.greenUpper, bands.yellowUpper, bands.red1Upper]).toEqual([
        785.27, 785.27, 785.27,
      ]);
    }
  });

  it("rejects impossible inputs", () => {
    expect(() => computeBands(10, 5, 0.5, RULE_C)).toThrow();
    expect(() => computeBands(5, 10, -0.1, RULE_C)).toThrow();
  });

  it("composes the colour with the thermal dispatch", () => {
    const table: FlagGfomTable[] = [
      {
        original: "Verde",
        steps: [
          { up_to_mwm: 6962, flag: "Verde" },
          { up_to_mwm: 11362, flag: "Amarela" },
          { up_to_mwm: 14262, flag: "Vermelha P1" },
          { up_to_mwm: 16562, flag: "Vermelha P2" },
        ],
      },
    ];
    expect(applyGfom("Verde", 6962, table)).toBe("Verde");
    expect(applyGfom("Verde", 6963, table)).toBe("Amarela");
    expect(applyGfom("Verde", 99999, table)).toBe("Vermelha P2");
  });

  it("says what must change for the colour to change", () => {
    const bands = computeBands(57.31, 785.27, 0.72, RULE_C);
    const change = whatMustChange(bands, 128.67);
    expect(change.flag).toBe("Amarela");
    expect(change.up).toEqual({ flag: "Vermelha P1", triggerAbove: 246.4 });
    expect(change.down).toEqual({ flag: "Verde", triggerAtOrBelow: 98.14 });
    const allGreen = whatMustChange(computeBands(57.31, 785.27, 1.03, RULE_C), 300);
    expect(allGreen.flag).toBe("Verde");
    expect(allGreen.up).toBeNull();
  });

  it("writes the colour names for people", () => {
    expect(flagLabel("Vermelha P1")).toBe("Vermelha 1");
    expect(flagLabel(null)).toBe("—");
  });
});
