import type { FlagGfomTable, FlagName, FlagRuleVersion } from "@/lib/api/types";

/**
 * Port of the tariff flag rule (spillway-forecast `flag_rule.py`), used by the simulator in the
 * browser. The constants come from /v1/flag/rule; they were adjusted on the bulletins and are
 * marked "a confirmar no Anexo I da REH 3.306/2024".
 */

export const FLAG_ORDER: readonly FlagName[] = ["Verde", "Amarela", "Vermelha P1", "Vermelha P2"];

/** Label shown to people; the API keeps the database names. */
export const FLAG_LABEL: Record<FlagName, string> = {
  Verde: "Verde",
  Amarela: "Amarela",
  "Vermelha P1": "Vermelha 1",
  "Vermelha P2": "Vermelha 2",
};

export function flagLabel(name: string | null | undefined): string {
  if (!name) return "—";
  if (name in FLAG_LABEL) return FLAG_LABEL[name as FlagName];
  return name;
}

/** Colours of the swatches (the name is always written next to them). */
export const FLAG_COLOR: Record<FlagName, string> = {
  Verde: "#2e8b57",
  Amarela: "#e0a800",
  "Vermelha P1": "#d9534f",
  "Vermelha P2": "#8b1a1a",
};

export function flagColor(name: string | null | undefined): string {
  return name && name in FLAG_COLOR ? FLAG_COLOR[name as FlagName] : "#888888";
}

function flagAt(index: number): FlagName {
  return FLAG_ORDER[index] ?? "Vermelha P2";
}

/** The version called `name`, or the newest one. */
export function pickVersion(versions: readonly FlagRuleVersion[], name?: string | null) {
  const found = versions.find((v) => v.name === name) ?? versions[versions.length - 1];
  if (!found) throw new Error("no rule version available");
  return found;
}

/** Round half up to the cent, on integer cents so 0.285 style values do not drift. */
export function roundCent(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function gsfBand(gh: number, gf: number): number {
  if (!(gf > 0)) throw new Error("GF must be positive");
  return roundCent(gh / gf);
}

export interface FlagBands {
  greenUpper: number;
  yellowUpper: number;
  red1Upper: number;
  pldMin: number;
  pldMax: number;
  gsf: number;
}

export function computeBands(
  pldMin: number,
  pldMax: number,
  gsf: number,
  rule: Pick<FlagRuleVersion, "lim_green" | "lim_yellow" | "lim_red1">,
): FlagBands {
  if (pldMin > pldMax) throw new Error("PLD min must not exceed PLD max");
  if (gsf < 0) throw new Error("GSF must not be negative");
  const edge = (lim: number) =>
    // GSF >= 1: the limit is unbounded, so it clamps to the PLD maximum.
    gsf >= 1 ? roundCent(pldMax) : roundCent(Math.min(pldMax, Math.max(pldMin, lim / (1 - gsf))));
  return {
    greenUpper: edge(rule.lim_green),
    yellowUpper: edge(rule.lim_yellow),
    red1Upper: edge(rule.lim_red1),
    pldMin,
    pldMax,
    gsf,
  };
}

export function flagFromTrigger(bands: FlagBands, trigger: number): FlagName {
  const p = roundCent(trigger);
  if (p <= bands.greenUpper) return "Verde";
  if (p <= bands.yellowUpper) return "Amarela";
  if (p <= bands.red1Upper) return "Vermelha P1";
  return "Vermelha P2";
}

/** Compose the colour with the out-of-merit thermal dispatch (GFOM, since 04/2024). */
export function applyGfom(
  flag: FlagName,
  dispatchMwm: number,
  tables: readonly FlagGfomTable[],
): FlagName {
  const table = tables.find((t) => t.original === flag);
  if (!table) return flag;
  for (const step of table.steps) {
    if (dispatchMwm <= step.up_to_mwm) return step.flag;
  }
  return "Vermelha P2";
}

export interface WhatMustChange {
  flag: FlagName;
  /** Next colour up, with the PLD trigger above which the colour changes. */
  up: { flag: FlagName; triggerAbove: number } | null;
  /** Colour below, with the PLD trigger at or below which the colour changes. */
  down: { flag: FlagName; triggerAtOrBelow: number } | null;
}

/** How far the trigger is from changing the colour, for the same GSF and limits. */
export function whatMustChange(bands: FlagBands, trigger: number): WhatMustChange {
  const flag = flagFromTrigger(bands, trigger);
  const edges: [FlagName, number][] = [
    ["Verde", bands.greenUpper],
    ["Amarela", bands.yellowUpper],
    ["Vermelha P1", bands.red1Upper],
  ];
  const i = Math.max(FLAG_ORDER.indexOf(flag), 0);
  const upEdge = edges[i];
  const downEdge = edges[i - 1];
  // Bands that sit at the PLD maximum are empty: skip to the next colour that can be reached.
  let up: WhatMustChange["up"] = null;
  if (upEdge && upEdge[1] < bands.pldMax) {
    up = { flag: flagAt(i + 1), triggerAbove: upEdge[1] };
  }
  const down: WhatMustChange["down"] = downEdge
    ? { flag: flagAt(i - 1), triggerAtOrBelow: downEdge[1] }
    : null;
  return { flag, up, down };
}
