"use client";

import { useMemo, useState } from "react";
import { Field, inputClass } from "@/components/form-fields";
import { Card } from "@/components/ui";
import type { FlagRuleResponse } from "@/lib/api/types";
import {
  applyGfom,
  computeBands,
  flagColor,
  flagFromTrigger,
  flagLabel,
  pickVersion,
  whatMustChange,
} from "@/lib/flag";
import { formatBRL, formatNumber } from "@/lib/format";

function parse(value: string): number | null {
  const n = Number(value.replace(",", "."));
  return value.trim() !== "" && Number.isFinite(n) ? n : null;
}

function show(value: number | null | undefined, digits = 2): string {
  return value === null || value === undefined ? "" : String(Number(value.toFixed(digits)));
}

/** Calculator of the rule in the browser. It never calls the API after the page loads. */
export function FlagSimulator({ rule }: { rule: FlagRuleResponse }) {
  const latestVersion = pickVersion(rule.versions, rule.latest_rule_version).name;
  const [version, setVersion] = useState(latestVersion);
  const [pldMin, setPldMin] = useState(show(rule.pld_min_brl_per_mwh));
  const [pldMax, setPldMax] = useState(show(rule.pld_max_brl_per_mwh));
  const [gsf, setGsf] = useState(show(rule.gsf));
  const [trigger, setTrigger] = useState(show(rule.pld_trigger_brl_per_mwh));
  const [gfom, setGfom] = useState("0");

  const result = useMemo(() => {
    const spec = rule.versions.find((v) => v.name === version);
    const min = parse(pldMin);
    const max = parse(pldMax);
    const g = parse(gsf);
    const t = parse(trigger);
    const d = parse(gfom) ?? 0;
    if (!spec || min === null || max === null || g === null || t === null) {
      return { error: "Preencha todos os campos com números." as const };
    }
    if (min > max) return { error: "O PLD mínimo não pode passar do máximo." as const };
    if (g < 0) return { error: "O GSF não pode ser negativo." as const };
    const bands = computeBands(min, max, roundGsf(g), spec);
    const base = flagFromTrigger(bands, t);
    const composed = spec.gfom ? applyGfom(base, d, rule.gfom) : base;
    return { bands, base, composed, change: whatMustChange(bands, t), spec };
  }, [version, pldMin, pldMax, gsf, trigger, gfom, rule]);

  return (
    <Card className="p-5 sm:p-6">
      <form onSubmit={(e) => e.preventDefault()} aria-label="Calculadora da bandeira">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field id="flag-version" label="Versão da regra" hint="C vale desde abril de 2024.">
            <select
              id="flag-version"
              className={inputClass}
              value={version}
              onChange={(e) => setVersion(e.target.value)}
            >
              {rule.versions.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name}
                  {v.effective_from ? ` (desde ${v.effective_from.slice(0, 7)})` : ""}
                </option>
              ))}
            </select>
          </Field>
          <Field id="flag-pldmin" label="PLD mínimo (R$/MWh)">
            <input
              id="flag-pldmin"
              className={inputClass}
              inputMode="decimal"
              value={pldMin}
              onChange={(e) => setPldMin(e.target.value)}
            />
          </Field>
          <Field id="flag-pldmax" label="PLD máximo (R$/MWh)">
            <input
              id="flag-pldmax"
              className={inputClass}
              inputMode="decimal"
              value={pldMax}
              onChange={(e) => setPldMax(e.target.value)}
            />
          </Field>
          <Field
            id="flag-gsf"
            label="GSF da bandeira"
            hint="Geração hidrelétrica prevista dividida pela garantia física, com 2 casas."
          >
            <input
              id="flag-gsf"
              className={inputClass}
              inputMode="decimal"
              value={gsf}
              onChange={(e) => setGsf(e.target.value)}
            />
          </Field>
          <Field id="flag-trigger" label="PLD gatilho (R$/MWh)">
            <input
              id="flag-trigger"
              className={inputClass}
              inputMode="decimal"
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
            />
          </Field>
          <Field
            id="flag-gfom"
            label="Despacho térmico fora da ordem de mérito (MWm)"
            hint="Só conta na versão C. 0 se não houver."
          >
            <input
              id="flag-gfom"
              className={inputClass}
              inputMode="decimal"
              value={gfom}
              onChange={(e) => setGfom(e.target.value)}
            />
          </Field>
        </div>
      </form>

      <div aria-live="polite" className="mt-6">
        {"error" in result ? (
          <p className="text-danger text-sm">{result.error}</p>
        ) : (
          <>
            <p className="text-lg font-semibold">
              Bandeira:{" "}
              <span
                className="inline-flex items-center gap-2 rounded-full border px-3 py-0.5"
                style={{ borderColor: flagColor(result.composed) }}
              >
                <span
                  aria-hidden="true"
                  className="inline-block size-3 rounded-full"
                  style={{ backgroundColor: flagColor(result.composed) }}
                />
                {flagLabel(result.composed)}
              </span>
              {result.composed !== result.base ? (
                <span className="text-muted ml-2 text-sm font-normal">
                  (a faixa do gatilho seria {flagLabel(result.base)}; o despacho térmico elevou)
                </span>
              ) : null}
            </p>
            <table className="tabular mt-4 w-full max-w-xl text-sm">
              <caption className="sr-only">Faixas de PLD de cada bandeira</caption>
              <thead className="text-ink-2 text-left">
                <tr>
                  <th scope="col" className="py-1.5 font-medium">
                    Cor
                  </th>
                  <th scope="col" className="py-1.5 font-medium">
                    Faixa do PLD gatilho (R$/MWh)
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows(result.bands).map(([name, lower, upper]) => (
                  <tr key={name} className="border-grid border-t">
                    <th scope="row" className="py-1.5 text-left font-medium">
                      {flagLabel(name)}
                    </th>
                    <td className="py-1.5">
                      {lower >= upper && name !== "Verde"
                        ? "sem faixa (o teto do PLD vem antes)"
                        : `${formatBRL(lower)} a ${formatBRL(upper)}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-ink-2 mt-4 text-sm leading-6">{explain(result.change, gsf)}</p>
            <p className="text-muted mt-2 text-xs">
              Constantes da versão {result.spec.name}: {result.spec.status}.
            </p>
          </>
        )}
      </div>
    </Card>
  );
}

function roundGsf(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function rows(bands: ReturnType<typeof computeBands>): [string, number, number][] {
  return [
    ["Verde", bands.pldMin, bands.greenUpper],
    ["Amarela", bands.greenUpper + 0.01, bands.yellowUpper],
    ["Vermelha P1", bands.yellowUpper + 0.01, bands.red1Upper],
    ["Vermelha P2", bands.red1Upper + 0.01, bands.pldMax],
  ];
}

function explain(change: ReturnType<typeof whatMustChange>, gsf: string): string {
  const parts: string[] = [];
  if (change.up) {
    parts.push(
      `Para virar ${flagLabel(change.up.flag)}, o PLD gatilho teria de passar de R$ ${formatNumber(change.up.triggerAbove, 2, 2)}.`,
    );
  }
  if (change.down) {
    parts.push(
      `Para voltar a ${flagLabel(change.down.flag)}, teria de ficar em R$ ${formatNumber(change.down.triggerAtOrBelow, 2, 2)} ou menos.`,
    );
  }
  if (!parts.length) parts.push("Com este GSF não há outra cor ao alcance do PLD gatilho.");
  parts.push(`As faixas mudam com o GSF (agora ${gsf}): mais água, faixas mais largas.`);
  return parts.join(" ");
}
