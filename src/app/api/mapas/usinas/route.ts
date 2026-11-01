import { NextResponse, type NextRequest } from "next/server";
import { getGeoPlants } from "@/lib/api/queries";
import { findState } from "@/lib/geo";
import { getSessionToken } from "@/lib/members";

export const dynamic = "force-dynamic";

const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

/** Plants map for a month, source and state. Same rule as /usinas: a session cookie. */
export async function GET(request: NextRequest) {
  if (!(await getSessionToken())) {
    return NextResponse.json({ detail: "Entre na sua conta para ver o mapa." }, { status: 401 });
  }
  const params = request.nextUrl.searchParams;
  const month = params.get("mes");
  const fonte = params.get("fonte");
  const result = await getGeoPlants({
    month: month && MONTH_RE.test(month) ? month : undefined,
    source: fonte === "wind" || fonte === "solar" ? fonte : undefined,
    state: findState(params.get("uf"))?.state,
  });
  if (!result.ok) {
    const status = result.error.isNotFound ? 404 : result.error.isUnavailable ? 502 : 400;
    return NextResponse.json({ detail: "Não foi possível carregar o mapa." }, { status });
  }
  return NextResponse.json(result.data, { headers: { "Cache-Control": "private, no-store" } });
}
