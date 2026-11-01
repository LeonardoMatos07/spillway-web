// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { EXAMPLES } from "@/lib/plotter/examples";
import { isProtected } from "@/lib/route-access";
import sitemap from "./sitemap";

vi.mock("@/lib/api/queries", () => ({
  getNews: vi.fn(async () => ({
    ok: true,
    data: {
      next_cursor: null,
      items: [
        {
          id: 7,
          has_editor_note: true,
          published_at: "2026-10-29T10:00:00Z",
          source_updated_at: null,
        },
        {
          id: 8,
          has_editor_note: false,
          published_at: "2026-10-29T10:00:00Z",
          source_updated_at: null,
        },
      ],
    },
  })),
}));

const BASE = "http://localhost:3000";

describe("sitemap", () => {
  it("lists only the pages that are open to anyone, and news pages that have a note", async () => {
    const urls = (await sitemap()).map((entry) => entry.url);

    expect(urls).toEqual(
      [
        "/",
        "/painel",
        "/sistema",
        "/agua",
        "/mapas/reservatorios",
        "/mapas/rede",
        "/metodologia",
        "/cadastro",
        "/previsoes",
        "/bandeira",
        "/ferramentas",
        "/ferramentas/plotador",
        ...EXAMPLES.map((example) => `/ferramentas/plotador/exemplos/${example.slug}`),
        "/privacidade",
        "/noticias",
        "/noticias/atos",
        "/noticias/fontes",
        "/noticias/7",
      ].map((path) => `${BASE}${path}`),
    );
    expect(urls).not.toContain(`${BASE}/noticias/8`);
    // the states layer needs an account (and a redirecting /mapas has nothing to index)
    expect(urls).not.toContain(`${BASE}/mapas/estados`);
    expect(urls).not.toContain(`${BASE}/mapas`);
  });

  it("never lists a page that needs an account", async () => {
    for (const entry of await sitemap()) {
      expect(isProtected(new URL(entry.url).pathname)).toBe(false);
    }
  });
});
