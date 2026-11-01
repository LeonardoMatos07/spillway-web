"use client";

import {
  AttributionControl,
  Map as MapLibreMap,
  NavigationControl,
  type ExpressionSpecification,
  type GeoJSONSource,
  type MapLayerMouseEvent,
  type MapMouseEvent,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { FeatureCollection, Geometry, LineString, Point } from "geojson";
import { useEffect, useRef, useState } from "react";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import { BRAZIL_BOUNDS } from "@/lib/maps";

const STATES_URL = "/geo/brazil-states.2025.topo.json";

export type PointsCollection = FeatureCollection<Point, Record<string, unknown>>;
export type LinesCollection = FeatureCollection<LineString, Record<string, unknown>>;

export interface PointsMapProps {
  /** Alt text of the map: what it shows (the page also offers the same data as a table). */
  label: string;
  points: PointsCollection;
  /** Property that identifies a point and is reported on click. */
  idProperty: string;
  /** Radius ~ sqrt(value of `radiusProperty`), from `radiusRange[0]` to `[1]` px at `radiusMax`. */
  radiusProperty: string;
  radiusMax: number;
  radiusRange?: [number, number];
  /** Color classes: `property` value < limits[i] gets colors[i]; no value gets the "no data" color. */
  colorProperty: string;
  colorLimits: number[];
  /** Names of CSS custom properties, one per class (limits.length + 1). */
  colorVars: string[];
  lines?: LinesCollection;
  /** Points with this property equal to 1 get a thick ring (a precise position, not approximate). */
  ringProperty?: string;
  /** Start centered here instead of on the whole country (mini-map). */
  focus?: { center: [number, number]; zoom: number };
  /** Color the lines with the same classes and property as the points (e.g. voltage). */
  colorLines?: boolean;
  selected: string | null;
  onSelect: (id: string | null) => void;
}

function css(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#888888";
}

function colorExpression(
  property: string,
  limits: number[],
  colors: string[],
  noData: string,
): ExpressionSpecification {
  const value: ExpressionSpecification = ["to-number", ["get", property], -1e9];
  const steps: (string | number | ExpressionSpecification)[] = [];
  limits.forEach((limit, i) =>
    steps.push(limit, colors[i + 1] ?? colors[colors.length - 1] ?? noData),
  );
  return [
    "case",
    ["==", ["to-number", ["get", property], -1e9], -1e9],
    noData,
    ["step", value, colors[0] ?? noData, ...steps],
  ] as ExpressionSpecification;
}

/** Map of points (and optional lines) over the state outlines, with no basemap: MapLibre GL. */
export default function PointsMap(props: PointsMapProps) {
  const { points, lines, selected } = props;
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const latest = useRef(props);
  latest.current = props;
  const [ready, setReady] = useState(false);

  // Create the map once.
  useEffect(() => {
    const node = container.current;
    if (!node) return;
    const map = new MapLibreMap({
      container: node,
      style: {
        version: 8,
        sources: {},
        layers: [{ id: "background", type: "background", paint: { "background-color": "#fff" } }],
      },
      ...(latest.current.focus
        ? { center: latest.current.focus.center, zoom: latest.current.focus.zoom }
        : { bounds: BRAZIL_BOUNDS, fitBoundsOptions: { padding: 8 } }),
      maxBounds: [
        [-90, -45],
        [-20, 15],
      ],
      minZoom: 2,
      attributionControl: false,
      cooperativeGestures: true,
      dragRotate: false,
      pitchWithRotate: false,
      locale: {
        "CooperativeGesturesHandler.WindowsHelpText": "Use Ctrl + rolagem para ampliar o mapa",
        "CooperativeGesturesHandler.MacHelpText": "Use ⌘ + rolagem para ampliar o mapa",
        "CooperativeGesturesHandler.MobileHelpText": "Use dois dedos para mover o mapa",
      },
    });
    mapRef.current = map;
    map.touchZoomRotate.disableRotation();
    map.addControl(new NavigationControl({ showCompass: false }), "top-right");
    map.addControl(
      new AttributionControl({
        compact: true,
        customAttribution: "Limites: IBGE, Malha Territorial 2025",
      }),
      "bottom-left",
    );

    let disposed = false;
    map.on("load", async () => {
      const p = latest.current;
      let states: FeatureCollection<Geometry> | null = null;
      try {
        const topology = (await (await fetch(STATES_URL)).json()) as Topology;
        const layer = Object.values(topology.objects)[0] as GeometryCollection;
        states = feature(topology, layer) as FeatureCollection<Geometry>;
      } catch {
        states = null; // the points still work without the outlines
      }
      if (disposed) return;
      if (states) {
        map.addSource("states", { type: "geojson", data: states });
        map.addLayer({ id: "states-fill", type: "fill", source: "states", paint: {} });
        map.addLayer({ id: "states-line", type: "line", source: "states", paint: {} });
      }
      map.addSource("lines", {
        type: "geojson",
        data: p.lines ?? { type: "FeatureCollection", features: [] },
      });
      map.addLayer({
        id: "lines",
        type: "line",
        source: "lines",
        paint: { "line-width": 1.2, "line-opacity": 0.8 },
      });
      map.addSource("points", { type: "geojson", data: p.points, promoteId: p.idProperty });
      const [rMin, rMax] = p.radiusRange ?? [4, 22];
      map.addLayer({
        id: "points",
        type: "circle",
        source: "points",
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["sqrt", ["max", ["to-number", ["get", p.radiusProperty], 0], 0]],
            0,
            rMin,
            Math.sqrt(p.radiusMax),
            rMax,
          ],
          "circle-opacity": 0.9,
          "circle-stroke-width": p.ringProperty
            ? ["case", ["==", ["get", p.ringProperty], 1], 3, 1]
            : 1,
        },
      });
      map.addLayer({
        id: "points-selected",
        type: "circle",
        source: "points",
        filter: ["==", ["get", p.idProperty], ""],
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["sqrt", ["max", ["to-number", ["get", p.radiusProperty], 0], 0]],
            0,
            rMin + 3,
            Math.sqrt(p.radiusMax),
            rMax + 3,
          ],
          "circle-opacity": 0,
          "circle-stroke-width": 3,
        },
      });
      map.on("click", "points", (event: MapLayerMouseEvent) => {
        const id = event.features?.[0]?.properties?.[latest.current.idProperty];
        latest.current.onSelect(typeof id === "string" ? id : id === undefined ? null : String(id));
      });
      map.on("click", (event: MapMouseEvent) => {
        if (!map.queryRenderedFeatures(event.point, { layers: ["points"] }).length) {
          latest.current.onSelect(null);
        }
      });
      map.on("mouseenter", "points", () => (map.getCanvas().style.cursor = "pointer"));
      map.on("mouseleave", "points", () => (map.getCanvas().style.cursor = ""));
      setReady(true);
    });

    return () => {
      disposed = true;
      map.remove();
      mapRef.current = null;
      setReady(false);
    };
  }, []);

  // Colors follow the theme (CSS custom properties) and the classes of the layer.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const paint = () => {
      const p = latest.current;
      const colors = p.colorVars.map(css);
      const noData = css("--map-nodata");
      const surface = css("--color-surface");
      map.setPaintProperty("background", "background-color", surface);
      if (map.getLayer("states-fill")) {
        map.setPaintProperty("states-fill", "fill-color", css("--map-nodata"));
        map.setPaintProperty("states-line", "line-color", css("--color-line"));
      }
      map.setPaintProperty(
        "points",
        "circle-color",
        colorExpression(p.colorProperty, p.colorLimits, colors, noData),
      );
      map.setPaintProperty("points", "circle-stroke-color", css("--color-ink"));
      map.setPaintProperty("points-selected", "circle-stroke-color", css("--color-focus"));
      map.setPaintProperty(
        "lines",
        "line-color",
        p.colorLines
          ? colorExpression(p.colorProperty, p.colorLimits, colors, noData)
          : css("--color-ink-2"),
      );
    };
    paint();
    const observer = new MutationObserver(paint);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", paint);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", paint);
    };
  }, [ready, props.colorProperty, props.colorLimits, props.colorVars]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    (map.getSource("points") as GeoJSONSource | undefined)?.setData(points);
  }, [points, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    (map.getSource("lines") as GeoJSONSource | undefined)?.setData(
      lines ?? { type: "FeatureCollection", features: [] },
    );
  }, [lines, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    map.setFilter("points-selected", ["==", ["get", latest.current.idProperty], selected ?? ""]);
  }, [selected, ready]);

  function backToBrazil() {
    mapRef.current?.fitBounds(BRAZIL_BOUNDS, { padding: 8 });
  }

  return (
    <div className="relative h-[26rem] w-full sm:h-[32rem]">
      <div
        ref={container}
        role="application"
        aria-label={`${props.label}. Setas movem o mapa, + e - ampliam. A tabela abaixo traz os mesmos dados.`}
        className="h-full w-full overflow-hidden rounded-xl"
      />
      <button
        type="button"
        onClick={backToBrazil}
        className="border-line bg-surface text-ink hover:bg-surface-2 absolute bottom-8 left-2 min-h-9 rounded-lg border px-3 text-xs font-medium shadow"
      >
        Voltar ao Brasil
      </button>
    </div>
  );
}
