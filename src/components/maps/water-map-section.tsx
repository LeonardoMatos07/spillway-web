"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import type { ReservoirCollection } from "@/lib/api/types";

// Only downloaded when the map view is opened.
const ReservoirsMapPanel = dynamic(
  () => import("@/components/maps/reservoirs-map-panel").then((m) => m.ReservoirsMapPanel),
  { ssr: false },
);

type View = "grafico" | "mapa";

/**
 * Água: chart view (server-rendered children) or map view, switched with ?vista=mapa. The map is
 * only mounted, and its data only fetched, when the map view is open.
 */
export function WaterViewSwitch({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>("grafico");

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("vista") === "mapa") setView("mapa");
  }, []);

  function choose(next: View) {
    setView(next);
    const url = new URL(window.location.href);
    if (next === "mapa") url.searchParams.set("vista", "mapa");
    else url.searchParams.delete("vista");
    window.history.replaceState(null, "", url);
  }

  return (
    <>
      <div
        role="group"
        aria-label="Forma de ver a água"
        className="border-grid mt-6 inline-flex gap-1 rounded-full border bg-[var(--color-surface)] p-1 text-sm font-medium"
      >
        {(
          [
            ["grafico", "Gráfico"],
            ["mapa", "Mapa"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            aria-pressed={view === key}
            onClick={() => choose(key)}
            className={`min-h-9 rounded-full px-4 ${
              view === key ? "bg-accent text-on-accent" : "text-ink-2 hover:bg-surface-2"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div hidden={view !== "grafico"}>{children}</div>
      {view === "mapa" ? <WaterMap /> : null}
    </>
  );
}

function WaterMap() {
  const [data, setData] = useState<ReservoirCollection | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/mapas/reservatorios")
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("api"))))
      .then((json: ReservoirCollection) => !cancelled && setData(json))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) {
    return (
      <p role="status" className="text-ink-2 mt-6 text-sm">
        Não foi possível carregar o mapa agora. Use a vista em gráfico.
      </p>
    );
  }
  if (!data) {
    return <div className="bg-surface-2 mt-6 h-96 animate-pulse rounded-2xl" aria-busy="true" />;
  }
  return (
    <div className="mt-6 pb-12">
      <ReservoirsMapPanel initial={data} />
      <p className="mt-3 text-sm">
        <Link className="text-accent underline" href="/mapas/reservatorios">
          Abrir em Mapas
        </Link>
      </p>
    </div>
  );
}
