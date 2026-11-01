"use client";

import { useMemo, useState } from "react";
import { MapView } from "@/components/maps/map-view";
import type { PointsCollection, PointsMapProps } from "@/components/maps/points-map";
import type { PlantGeoFeature } from "@/lib/api/types";
import { CURTAILMENT_LIMITS } from "@/lib/maps";

const loadEngine = () => import("@/components/maps/points-map");
const COLOR_VARS = ["--map-c0", "--map-c1", "--map-c2", "--map-c3", "--map-c4"];

/** Small map of one plant, centered on the point where it is drawn (lazy, like every map). */
export function PlantMiniMap({ plant }: { plant: PlantGeoFeature }) {
  const [selected, setSelected] = useState<string | null>(null);
  const { properties, geometry } = plant;
  const points = useMemo<PointsCollection>(
    () => ({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry,
          properties: {
            id: properties.id,
            capacity_mw: properties.capacity_mw ?? 1,
            curtailment_pct: properties.curtailment_pct,
            official: properties.location_precision === "official" ? 1 : 0,
          },
        },
      ],
    }),
    [geometry, properties],
  );
  const mapProps: PointsMapProps = {
    label: `Posição de ${properties.name}`,
    points,
    idProperty: "id",
    radiusProperty: "capacity_mw",
    radiusMax: Math.max(1, properties.capacity_mw ?? 1),
    radiusRange: [8, 8],
    colorProperty: "curtailment_pct",
    colorLimits: CURTAILMENT_LIMITS,
    colorVars: COLOR_VARS,
    ringProperty: "official",
    focus: { center: geometry.coordinates, zoom: 6 },
    selected,
    onSelect: setSelected,
  };
  return (
    <MapView
      label={`Posição de ${properties.name}`}
      load={loadEngine}
      props={mapProps}
      aspect="16 / 9"
      requires="webgl"
      fallback="O seu navegador não conseguiu abrir o mapa (WebGL)."
    />
  );
}
