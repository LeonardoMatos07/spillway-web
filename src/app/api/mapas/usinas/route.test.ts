import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const getSessionToken = vi.fn();
const getGeoPlants = vi.fn();
vi.mock("@/lib/members", () => ({ getSessionToken: () => getSessionToken() }));
vi.mock("@/lib/api/queries", () => ({
  getGeoPlants: (...args: unknown[]) => getGeoPlants(...args),
}));

import { GET } from "./route";

const request = (qs = "") =>
  ({ nextUrl: new URL(`http://localhost/api/mapas/usinas${qs}`) }) as Parameters<typeof GET>[0];

describe("GET /api/mapas/usinas", () => {
  beforeEach(() => vi.clearAllMocks());

  it("asks for an account, like /usinas", async () => {
    getSessionToken.mockResolvedValue(null);
    expect((await GET(request())).status).toBe(401);
    expect(getGeoPlants).not.toHaveBeenCalled();
  });

  it("passes only validated filters to the API", async () => {
    getSessionToken.mockResolvedValue("token");
    getGeoPlants.mockResolvedValue({ ok: true, data: { meta: {}, features: [], unlocated: [] } });
    await GET(request("?mes=2026-09&fonte=solar&uf=ba"));
    expect(getGeoPlants).toHaveBeenLastCalledWith({
      month: "2026-09",
      source: "solar",
      state: "BA",
    });
    await GET(request("?mes=x&fonte=coal&uf=XX"));
    expect(getGeoPlants).toHaveBeenLastCalledWith({
      month: undefined,
      source: undefined,
      state: undefined,
    });
  });
});
