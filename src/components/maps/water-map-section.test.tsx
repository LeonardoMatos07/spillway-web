import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WaterViewSwitch } from "./water-map-section";

afterEach(() => {
  vi.restoreAllMocks();
  window.history.replaceState(null, "", "/");
});

describe("WaterViewSwitch", () => {
  it("starts on the charts and keeps ?vista=mapa in the URL when the map is chosen", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {})),
    );
    render(
      <WaterViewSwitch>
        <p>gráficos</p>
      </WaterViewSwitch>,
    );
    expect(screen.getByRole("button", { name: "Gráfico" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("gráficos").parentElement).not.toHaveAttribute("hidden");
    fireEvent.click(screen.getByRole("button", { name: "Mapa" }));
    expect(window.location.search).toBe("?vista=mapa");
    expect(screen.getByText("gráficos").parentElement).toHaveAttribute("hidden");
    fireEvent.click(screen.getByRole("button", { name: "Gráfico" }));
    expect(window.location.search).toBe("");
  });

  it("opens on the map when the URL asks for it", () => {
    window.history.replaceState(null, "", "/agua?vista=mapa");
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {})),
    );
    render(
      <WaterViewSwitch>
        <p>gráficos</p>
      </WaterViewSwitch>,
    );
    expect(screen.getByRole("button", { name: "Mapa" })).toHaveAttribute("aria-pressed", "true");
  });
});
