import { describe, expect, it } from "vitest";
import { compareHref, parseEntities } from "./compare";
import { isNavActive, MAX_NAV_CHILDREN, NAV } from "./navigation";
import { isProtected } from "./route-access";
import { TOOLS } from "./tools";

const active = (pathname: string) =>
  NAV.filter((i) => isNavActive(pathname, i.matches)).map((i) => i.label);

describe("main menu", () => {
  it("has the main sections and nothing else", () => {
    expect(NAV.map((item) => item.label)).toEqual([
      "Painel",
      "Mercado",
      "Curtailment",
      "Notícias",
      "Previsões",
      "Ferramentas",
    ]);
  });

  it("keeps Mercado lit on prices and quality of supply", () => {
    for (const path of ["/mercado/pld", "/qualidade", "/qualidade/123"]) {
      expect(active(path), path).toEqual(["Mercado"]);
    }
  });

  it("keeps Curtailment lit on its hub, states, plants, the comparison and the reports", () => {
    for (const path of [
      "/curtailment",
      "/estados",
      "/estados/ba",
      "/usinas",
      "/usinas/cumaru-i",
      "/relatorios/x",
    ]) {
      expect(active(path), path).toEqual(["Curtailment"]);
    }
  });

  it("lists the maps in the Painel group and keeps Painel lit on every map layer", () => {
    const painel = NAV.find((item) => item.label === "Painel");
    expect(painel?.children?.map((c) => c.href)).toEqual([
      "/painel",
      "/mapas",
      "/sistema",
      "/agua",
    ]);
    for (const path of ["/mapas", "/mapas/estados"]) {
      expect(active(path), path).toEqual(["Painel"]);
    }
  });

  it("lights Notícias on the list, the acts and a single item", () => {
    for (const path of ["/noticias", "/noticias/atos", "/noticias/12"]) {
      expect(active(path), path).toEqual(["Notícias"]);
    }
  });

  it("lights exactly one section elsewhere", () => {
    expect(active("/painel")).toEqual(["Painel"]);
    expect(active("/sistema")).toEqual(["Painel"]);
    expect(active("/agua")).toEqual(["Painel"]);
    expect(active("/analises")).toEqual(["Curtailment"]);
    expect(active("/comparar")).toEqual(["Ferramentas"]);
    expect(active("/previsao")).toEqual(["Previsões"]);
    expect(active("/previsoes")).toEqual(["Previsões"]);
    expect(active("/relatorios/curtailment-2026-09")).toEqual(["Curtailment"]);
    expect(active("/metodologia")).toEqual([]);
    expect(active("/comparar-usinas")).toEqual([]);
  });

  it("links members-area routes the middleware protects, except the open pages and the free tools", () => {
    const open = ["/painel", "/noticias", "/previsoes", "/ferramentas"];
    for (const item of NAV) {
      expect(isProtected(item.href), item.href).toBe(!open.includes(item.href));
    }
  });

  it("lights the area of every page listed in its dropdown", () => {
    for (const item of NAV) {
      for (const child of item.children ?? []) {
        expect(isNavActive(child.href, item.matches), child.href).toBe(true);
      }
    }
  });
});

describe("compareHref", () => {
  it("starts a comparison that the compare page can read back", () => {
    const refs = [
      { kind: "state", id: "BA" },
      { kind: "plant", id: "cumaru-i-x" },
      { kind: "subsystem", id: "NE" },
    ] as const;
    for (const ref of refs) {
      const query = new URL(compareHref(ref), "http://x").searchParams.get("itens");
      expect(parseEntities(query)).toEqual([ref]);
    }
  });
});

describe("areas and tools", () => {
  it("lists the same tools in the Ferramentas menu and on the tools page", () => {
    const menu = NAV.find((item) => item.label === "Ferramentas")?.children?.map((c) => c.href);
    expect(menu).toEqual(["/ferramentas/plotador", "/comparar"]);
    expect(TOOLS.map((tool) => tool.href)).toEqual(menu);
  });

  it("keeps Análises inside the Curtailment area, not in the tools", () => {
    const curtailment = NAV.find((item) => item.label === "Curtailment");
    expect(curtailment?.children?.map((c) => c.href)).toContain("/analises");
    expect(TOOLS.map((tool) => tool.href)).not.toContain("/analises");
  });

  it("marks the tools that need an account", () => {
    const members = TOOLS.filter((tool) => tool.members).map((tool) => tool.href);
    expect(members).toEqual(["/comparar"]);
    for (const href of members) expect(isProtected(href)).toBe(true);
  });
});

describe("menu structure", () => {
  it("has six groups, five to read and one to use", () => {
    expect(NAV.map((item) => item.label)).toEqual([
      "Painel",
      "Mercado",
      "Curtailment",
      "Notícias",
      "Previsões",
      "Ferramentas",
    ]);
  });

  it("lists the pages of each group as agreed", () => {
    const pages = Object.fromEntries(NAV.map((i) => [i.label, i.children?.map((c) => c.href)]));
    expect(pages).toEqual({
      Painel: ["/painel", "/mapas", "/sistema", "/agua"],
      Mercado: ["/mercado/pld", "/mercado/livre", "/tarifas", "/qualidade", "/bandeira"],
      Curtailment: ["/curtailment", "/estados", "/usinas", "/analises", "/relatorios"],
      Notícias: ["/noticias", "/noticias/atos", "/noticias/assinar"],
      Previsões: ["/previsoes", "/previsao"],
      Ferramentas: ["/ferramentas/plotador", "/comparar"],
    });
  });

  it("puts no page in two groups", () => {
    const hrefs = NAV.flatMap((item) => (item.children ?? []).map((child) => child.href));
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("keeps every group short", () => {
    for (const item of NAV) {
      expect(item.children?.length ?? 0, item.label).toBeLessThanOrEqual(MAX_NAV_CHILDREN);
    }
  });

  it("gives every page a label of its own, so two overviews are never confused", () => {
    const labels = NAV.flatMap((item) => (item.children ?? []).map((child) => child.label));
    const duplicated = labels.filter((label, index) => labels.indexOf(label) !== index);
    // The news list is called Notícias inside the Notícias group, as the group itself.
    expect(duplicated).toEqual([]);
  });

  it("lights the group of every page listed in it, and only that group", () => {
    for (const item of NAV) {
      for (const child of item.children ?? []) {
        expect(isNavActive(child.href, item.matches), child.href).toBe(true);
        expect(active(child.href), child.href).toEqual([item.label]);
      }
    }
  });

  it("lights Notícias on the acts and on the e-mail sign-up", () => {
    for (const path of ["/noticias/atos", "/noticias/assinar", "/noticias/12"]) {
      expect(active(path), path).toEqual(["Notícias"]);
    }
  });

  it("keeps the reports in Curtailment and its account rule unchanged", () => {
    expect(active("/relatorios/curtailment-2026-09")).toEqual(["Curtailment"]);
    expect(isProtected("/relatorios")).toBe(true);
    expect(isProtected("/noticias")).toBe(false);
  });
});
