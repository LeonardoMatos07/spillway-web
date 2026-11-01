import { NextResponse, type NextRequest } from "next/server";
import { getGeoLines, getGeoSubstations } from "@/lib/api/queries";
import { parseVoltageMin } from "@/lib/maps";

export const dynamic = "force-dynamic";

/** Substations and lines of the grid map for a minimum voltage (open data, no account). */
export async function GET(request: NextRequest) {
  const voltageMin = parseVoltageMin(request.nextUrl.searchParams.get("tensao"));
  const [substations, lines] = await Promise.all([
    getGeoSubstations({ voltage_min: voltageMin }),
    getGeoLines({ voltage_min: voltageMin }),
  ]);
  if (!substations.ok || !lines.ok) {
    return NextResponse.json({ detail: "Não foi possível carregar o mapa." }, { status: 502 });
  }
  return NextResponse.json(
    { voltageMin, substations: substations.data, lines: lines.data },
    { headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" } },
  );
}
