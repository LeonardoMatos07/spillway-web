import { describe, expect, it } from "vitest";
import { availableForecasts, FORECASTS } from "./forecasts";
import { NAV } from "./navigation";
import { isProtected } from "./route-access";
import { TOOLS } from "./tools";

describe("forecast list", () => {
  it("has one entry per address and key", () => {
    expect(new Set(FORECASTS.map((f) => f.href)).size).toBe(FORECASTS.length);
    expect(new Set(FORECASTS.map((f) => f.key)).size).toBe(FORECASTS.length);
  });

  it("keeps the existing address of the curtailment forecast", () => {
    expect(FORECASTS.find((f) => f.key === "curtailment")?.href).toBe("/previsao");
  });

  it("names a model for every forecast that is available", () => {
    for (const forecast of availableForecasts()) {
      expect(forecast.model, forecast.title).toBeTruthy();
    }
  });

  it("lists in the menu the hub and the available forecasts, never the ones coming soon", () => {
    const group = NAV.find((item) => item.label === "Previsões");
    expect(group?.children?.map((c) => c.href)).toEqual([
      "/previsoes",
      ...availableForecasts().map((f) => f.href),
    ]);
    const soon = FORECASTS.filter((f) => f.status === "soon").map((f) => f.href);
    const menu = NAV.flatMap((item) => (item.children ?? []).map((c) => c.href));
    for (const href of soon) expect(menu).not.toContain(href);
  });

  it("keeps forecasts out of the tools and the hub open to everyone", () => {
    const tools = TOOLS.map((tool) => tool.href);
    for (const forecast of FORECASTS) expect(tools).not.toContain(forecast.href);
    expect(isProtected("/previsoes")).toBe(false);
    expect(isProtected("/previsao")).toBe(true);
  });
});

describe("forecast under evaluation", () => {
  it("keeps the flag forecast open but outside the forecasts menu until a lead is published", () => {
    const flag = FORECASTS.find((f) => f.key === "bandeira");
    expect(flag?.status).toBe("evaluating");
    expect(isProtected("/bandeira")).toBe(false);
    const forecastsMenu = NAV.find((item) => item.label === "Previsões");
    expect(forecastsMenu?.children?.map((c) => c.href)).not.toContain("/bandeira");
    const market = NAV.find((item) => item.label === "Mercado");
    expect(market?.children?.map((c) => c.href)).toContain("/bandeira");
  });
});
