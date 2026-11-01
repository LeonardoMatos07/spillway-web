import { NextResponse, type NextRequest } from "next/server";
import { getGeoReservoirs } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Reservoirs map for one day (open data, no account needed). */
export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("data");
  const day = raw && DAY_RE.test(raw) ? raw : undefined;
  const result = await getGeoReservoirs({ date: day });
  if (!result.ok) {
    const status = result.error.isNotFound ? 404 : result.error.isUnavailable ? 502 : 400;
    return NextResponse.json({ detail: "Não foi possível carregar o mapa." }, { status });
  }
  return NextResponse.json(result.data, {
    headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" },
  });
}
