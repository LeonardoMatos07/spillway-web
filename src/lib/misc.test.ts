import { describe, expect, it } from "vitest";
import { validateNewsletterInput, visitorIpHeaders } from "./newsletter";
import { parseTags, safeCompare } from "./revalidate";
import { safeNextPath } from "./safe-path";
import {
  defaultPeriod,
  fillMonthGaps,
  filterByMonthRange,
  monthSpan,
  pickEnergyUnit,
  pivotByMonth,
  shiftMonth,
} from "./series";

describe("safeCompare", () => {
  it("compares strings of any length without throwing", () => {
    expect(safeCompare("abc", "abc")).toBe(true);
    expect(safeCompare("abc", "abcd")).toBe(false);
    expect(safeCompare("", "abc")).toBe(false);
  });
});

describe("parseTags", () => {
  it("defaults to every tag", () => {
    expect(parseTags(null)).toEqual({
      ok: true,
      tags: [
        "curtailment",
        "plants",
        "reports",
        "forecast",
        "news",
        "market",
        "reliability",
        "flag",
      ],
    });
    expect(parseTags({ tags: [] })).toEqual({
      ok: true,
      tags: [
        "curtailment",
        "plants",
        "reports",
        "forecast",
        "news",
        "market",
        "reliability",
        "flag",
      ],
    });
  });
  it("deduplicates and validates", () => {
    expect(parseTags({ tags: ["plants", "plants"] })).toEqual({ ok: true, tags: ["plants"] });
    expect(parseTags({ tags: "plants" }).ok).toBe(false);
    expect(parseTags([]).ok).toBe(false);
  });
});

describe("validateNewsletterInput", () => {
  it("requires a valid e-mail and explicit consent", () => {
    expect(validateNewsletterInput(" Ana@Example.com ", "on")).toEqual({
      ok: true,
      email: "ana@example.com",
    });
    expect(validateNewsletterInput("ana@example.com", null).ok).toBe(false);
    expect(validateNewsletterInput("not-an-email", "on").ok).toBe(false);
  });
});

describe("series helpers", () => {
  it("fills the months missing between the first and last row", () => {
    const filled = fillMonthGaps([
      { month: "2025-11", a: 1 },
      { month: "2026-02", a: 2 },
    ]);
    expect(filled).toEqual([
      { month: "2025-11", a: 1 },
      { month: "2025-12" },
      { month: "2026-01" },
      { month: "2026-02", a: 2 },
    ]);
    expect(fillMonthGaps([])).toEqual([]);
  });

  it("pivots long rows into one row per month", () => {
    const rows = pivotByMonth(
      [
        { month: "2026-02", source: "solar", v: 2 },
        { month: "2026-01", source: "wind", v: 1 },
        { month: "2026-02", source: "wind", v: 3 },
      ],
      (r) => r.source,
      (r) => r.v,
    );
    expect(rows).toEqual([
      { month: "2026-01", wind: 1 },
      { month: "2026-02", solar: 2, wind: 3 },
    ]);
  });
  it("shifts months across year boundaries and counts the span", () => {
    expect(shiftMonth("2026-03", -11)).toBe("2025-04");
    expect(shiftMonth("2026-01", -1)).toBe("2025-12");
    expect(shiftMonth("2025-12", 1)).toBe("2026-01");
    expect(monthSpan("2021-10", "2026-09")).toBe(60);
    expect(monthSpan("2026-09", "2026-09")).toBe(1);
  });

  it("filters rows by an inclusive month range", () => {
    const rows = [{ month: "2026-01" }, { month: "2026-02" }, { month: "2026-03" }];
    expect(filterByMonthRange(rows, "2026-02", "2026-03")).toEqual([
      { month: "2026-02" },
      { month: "2026-03" },
    ]);
    expect(filterByMonthRange(rows, null, "2026-01")).toEqual([{ month: "2026-01" }]);
    expect(filterByMonthRange(rows)).toEqual(rows);
    expect(filterByMonthRange(rows, "2027-01", null)).toEqual([]);
  });

  it("picks GWh only for large values", () => {
    expect(pickEnergyUnit(50_000).unit).toBe("GWh");
    expect(pickEnergyUnit(500).unit).toBe("MWh");
  });
});

describe("visitorIpHeaders", () => {
  const reader = (values: Record<string, string>) => ({
    get: (name: string) => values[name] ?? null,
  });

  it("sends the visitor IP with the shared secret", () => {
    expect(visitorIpHeaders(reader({ "x-real-ip": "203.0.113.7" }), "s3cret")).toEqual({
      "X-Web-Api-Secret": "s3cret",
      "X-Client-IP": "203.0.113.7",
    });
  });

  it("falls back to the left-most X-Forwarded-For entry", () => {
    const h = reader({ "x-forwarded-for": "198.51.100.2, 10.0.0.1" });
    expect(visitorIpHeaders(h, "s3cret")["X-Client-IP"]).toBe("198.51.100.2");
  });

  it("only forwards X-Forwarded-For without a secret", () => {
    const h = reader({ "x-forwarded-for": "198.51.100.2", "x-real-ip": "198.51.100.2" });
    expect(visitorIpHeaders(h, undefined)).toEqual({ "X-Forwarded-For": "198.51.100.2" });
    expect(visitorIpHeaders(reader({}), "")).toEqual({});
  });
});

describe("safeNextPath", () => {
  it("keeps internal paths and rejects anything that could leave the site", () => {
    expect(safeNextPath("/comparar?itens=e%3ABA")).toBe("/comparar?itens=e%3ABA");
    expect(safeNextPath("https://evil.example")).toBe("/painel");
    expect(safeNextPath("//evil.example")).toBe("/painel");
    expect(safeNextPath("/" + String.fromCharCode(92) + "evil.example")).toBe("/painel");
    expect(safeNextPath(undefined)).toBe("/painel");
    expect(safeNextPath("relative")).toBe("/painel");
    expect(safeNextPath("nope", "/conta")).toBe("/conta");
  });
});

describe("defaultPeriod", () => {
  it("starts twelve months before the last month, never before the first", () => {
    expect(defaultPeriod("2021-10", "2026-09")).toEqual({ start: "2025-10", end: "2026-09" });
    expect(defaultPeriod("2026-03", "2026-09")).toEqual({ start: "2026-03", end: "2026-09" });
  });
});
