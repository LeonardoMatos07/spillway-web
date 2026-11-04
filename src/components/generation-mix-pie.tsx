"use client";

import { useState } from "react";
import type { GenerationMixPoint, GenerationSource } from "@/lib/api/types";
import { formatGWh, formatLongMonth, formatPercent } from "@/lib/format";
import { normalizeMonth } from "@/lib/series";
import { SOURCE_FILL, SOURCE_LABELS } from "@/lib/system";

// Ring geometry in the SVG viewBox: arcs are strokes of a circle drawn with pathLength=100.
const MID_RADIUS = 84;
const RING_WIDTH = 32;
const GAP = 0.6;
const LABEL_MIN_SHARE = 0.08;

// White text on the dark fills, dark text on the yellow one: both stay readable in light and dark.
const LABEL_COLOR: Record<GenerationSource, string> = {
  hydro: "#ffffff",
  wind: "#ffffff",
  thermal: "#ffffff",
  solar: "#1f2937",
};

/**
 * Brazilian electricity mix (share of generation by source) as a donut with the total in the
 * centre, direct labels on the large slices and cards with the numbers. Hovering or focusing a
 * card (or a slice) highlights it; the same data is available as a table.
 */
export function GenerationMixPie({ points }: { points: GenerationMixPoint[] }) {
  const [active, setActive] = useState<GenerationSource | null>(null);

  const rows = points
    .filter((point) => point.subsystem === "SIN")
    .map((point) => ({ ...point, month: normalizeMonth(point.month) }));
  const month = rows
    .map((row) => row.month)
    .sort()
    .at(-1);
  const slices = rows
    .filter((row) => row.month === month && row.energy_mwh > 0)
    .sort((a, b) => b.energy_mwh - a.energy_mwh);
  const total = slices.reduce((sum, row) => sum + row.energy_mwh, 0);
  if (!month || total <= 0) return null;

  let cursor = 0;
  const arcs = slices.map((row) => {
    const share = row.energy_mwh / total;
    const start = cursor;
    cursor += share;
    return { ...row, share, start, mid: start + share / 2 };
  });
  const highlighted = arcs.find((arc) => arc.source === active);
  const summary = arcs
    .map((arc) => `${SOURCE_LABELS[arc.source]} ${formatPercent(arc.share * 100)}`)
    .join(", ");

  // Sized by the width of its own box (container queries): the same component sits in a wide
  // block on the home page and in a half-width card on the painel.
  return (
    <div className="@container">
      <div className="grid items-center gap-6 @2xl:grid-cols-[minmax(0,300px)_1fr] @2xl:gap-10">
        <div className="relative mx-auto w-full max-w-[260px] @2xl:max-w-[300px]">
          <svg
            viewBox="-104 -104 208 208"
            role="img"
            aria-label={`Matriz elétrica brasileira em ${formatLongMonth(month)}: ${summary}`}
            className="w-full"
          >
            <circle
              r={MID_RADIUS}
              fill="none"
              stroke="var(--color-surface-2)"
              strokeWidth={RING_WIDTH}
            />
            <g transform="rotate(-90)">
              {arcs.map((arc, index) => {
                const dash = Math.max(arc.share * 100 - (arcs.length > 1 ? GAP : 0), 0.1);
                const dimmed = active !== null && active !== arc.source;
                return (
                  <circle
                    key={arc.source}
                    r={MID_RADIUS}
                    fill="none"
                    pathLength={100}
                    stroke={SOURCE_FILL[arc.source]}
                    strokeWidth={active === arc.source ? RING_WIDTH + 6 : RING_WIDTH}
                    className="donut-arc"
                    style={{
                      strokeDasharray: `${dash} ${100 - dash}`,
                      strokeDashoffset: -(arc.start * 100 + (arcs.length > 1 ? GAP / 2 : 0)),
                      opacity: dimmed ? 0.3 : 1,
                      animationDelay: `${index * 0.12}s`,
                      transition: "opacity .2s, stroke-width .2s",
                    }}
                    onMouseEnter={() => setActive(arc.source)}
                    onMouseLeave={() => setActive(null)}
                  />
                );
              })}
            </g>
            {arcs.map((arc) => {
              if (arc.share < LABEL_MIN_SHARE) return null;
              const angle = arc.mid * 2 * Math.PI;
              return (
                <text
                  key={`label-${arc.source}`}
                  x={MID_RADIUS * Math.sin(angle)}
                  y={-MID_RADIUS * Math.cos(angle)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={10}
                  fontWeight={700}
                  fill={LABEL_COLOR[arc.source]}
                  style={{ opacity: active !== null && active !== arc.source ? 0.3 : 1 }}
                  aria-hidden="true"
                >
                  {formatPercent(arc.share * 100, 0)}
                </text>
              );
            })}
          </svg>
          <div
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-12 text-center"
            aria-hidden="true"
          >
            <span className="text-ink-2 text-xs leading-tight">
              {highlighted ? SOURCE_LABELS[highlighted.source] : "Geração total"}
            </span>
            <span className="font-display tabular text-xl leading-tight font-bold sm:text-2xl">
              {formatGWh(highlighted ? highlighted.energy_mwh : total, 0)}
            </span>
            <span className="text-muted text-xs leading-tight">
              {highlighted ? formatPercent(highlighted.share * 100) : formatLongMonth(month)}
            </span>
          </div>
        </div>

        <ul className="grid gap-3 @[18rem]:grid-cols-2">
          {arcs.map((arc) => (
            <li key={arc.source}>
              <div
                tabIndex={0}
                onMouseEnter={() => setActive(arc.source)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(arc.source)}
                onBlur={() => setActive(null)}
                className={`border-grid bg-surface focus-visible:outline-accent rounded-xl border p-3.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  active === arc.source ? "border-accent bg-surface-2" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="size-3 shrink-0 rounded-full"
                    style={{ background: SOURCE_FILL[arc.source] }}
                  />
                  <span className="text-ink-2 text-sm font-medium">
                    {SOURCE_LABELS[arc.source]}
                  </span>
                </div>
                <p className="font-display tabular mt-1 text-3xl leading-none font-bold tracking-tight">
                  {formatPercent(arc.share * 100)}
                </p>
                <p className="tabular text-ink-2 mt-1 text-sm">{formatGWh(arc.energy_mwh, 0)}</p>
                <div
                  className="bg-surface-2 mt-2 h-1.5 overflow-hidden rounded-full"
                  aria-hidden="true"
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(arc.share * 100).toFixed(1)}%`,
                      background: SOURCE_FILL[arc.source],
                    }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <details className="mt-4 text-sm">
        <summary className="text-accent cursor-pointer underline">Ver dados em tabela</summary>
        <div className="border-grid mt-2 overflow-x-auto rounded border">
          <table className="tabular w-full border-collapse text-left">
            <caption className="sr-only">
              Geração do SIN por fonte em {formatLongMonth(month)}
            </caption>
            <thead>
              <tr>
                <th scope="col" className="px-3 py-2 font-semibold">
                  Fonte
                </th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">
                  Geração
                </th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">
                  Participação
                </th>
              </tr>
            </thead>
            <tbody>
              {arcs.map((arc) => (
                <tr key={arc.source} className="border-grid border-t">
                  <th scope="row" className="px-3 py-1.5 font-normal">
                    {SOURCE_LABELS[arc.source]}
                  </th>
                  <td className="px-3 py-1.5 text-right">{formatGWh(arc.energy_mwh, 0)}</td>
                  <td className="px-3 py-1.5 text-right">{formatPercent(arc.share * 100)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
