import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { getGridCellPosition } from "../../utils/grid";

import { usePanels } from "../../hooks/usePanels";
import { NAV_BAR_HEIGHT } from "@utils/constants";

// 🔧 Mock the dependencies
vi.mock("@components/panelList", () => ({
  panelList: [
    { key: "fruitbook", title: "Fruit Book", content: "<div>FruitBook</div>" },
    { key: "about", title: "About", content: "<div>About</div>" },
  ],
}));

vi.mock("../../utils/grid", () => ({
  getGridCellPosition: vi.fn(() => ({
    x: 100,
    y: 200,
    width: 400,
    height: 300,
  })),
}));

describe("usePanels hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("initializes with no open panels", () => {
    const { result } = renderHook(() => usePanels());
    expect(result.current.openPanels).toEqual([]);
  });

  it("opens a new panel with default position when no dropCell provided", () => {
    const { result } = renderHook(() => usePanels());

    act(() => {
      result.current.openPanel("fruitbook", null, { width: 0, height: 0 });
    });

    const opened = result.current.openPanels[0];
    expect(opened.title).toBe("Fruit Book");
    expect(opened.width).toBe(700);
    expect(opened.height).toBe(420);
    expect(opened.x).toBe(60);
    expect(opened.y).toBe(NAV_BAR_HEIGHT + 10);
  });

  it("uses grid position when dropCell and container size are provided", () => {
    const { result } = renderHook(() => usePanels());

    act(() => {
      result.current.openPanel("about", { row: 1, col: 1 }, { width: 1200, height: 800 });
    });

    const opened = result.current.openPanels[0];
    expect(getGridCellPosition).toHaveBeenCalledWith(1, 1, 1200, 800 - NAV_BAR_HEIGHT, NAV_BAR_HEIGHT);
    expect(opened.x).toBe(100);
    expect(opened.y).toBe(200);
    expect(opened.width).toBeLessThanOrEqual(1200);
    expect(opened.height).toBeLessThanOrEqual(800 - NAV_BAR_HEIGHT);
  });

  it("does nothing if invalid key passed to openPanel", () => {
    const { result } = renderHook(() => usePanels());
    act(() => {
      result.current.openPanel("invalid", null, { width: 500, height: 500 });
    });
    expect(result.current.openPanels.length).toBe(0);
  });

  it("closes a panel correctly", () => {
    const { result } = renderHook(() => usePanels());

    act(() => {
      result.current.openPanel("fruitbook", null, { width: 0, height: 0 });
    });

    const id = result.current.openPanels[0].id;

    act(() => {
      result.current.closePanel(id);
    });

    expect(result.current.openPanels.length).toBe(0);
  });

  it("moves a panel by dx/dy", () => {
    const { result } = renderHook(() => usePanels());

    act(() => {
      result.current.openPanel("fruitbook", null, { width: 0, height: 0 });
    });

    const id = result.current.openPanels[0].id;

    act(() => {
      result.current.movePanel(id, 50, 25);
    });

    const updated = result.current.openPanels[0];
    expect(updated.x).toBe(60 + 50);
    expect(updated.y).toBe(NAV_BAR_HEIGHT + 10 + 25);
  });

  it("resizes a panel and respects min width/height", () => {
    const { result } = renderHook(() => usePanels());
    act(() => {
      result.current.openPanel("about", null, { width: 0, height: 0 });
    });
    const id = result.current.openPanels[0].id;

    act(() => {
      result.current.resizePanel(id, -1000, -1000); // shrink below min
    });

    const updated = result.current.openPanels[0];
    expect(updated.width).toBe(200); // minimum width
    expect(updated.height).toBe(100); // minimum height
  });

  it("resizes panel normally when within bounds", () => {
    const { result } = renderHook(() => usePanels());
    act(() => {
      result.current.openPanel("fruitbook", null, { width: 0, height: 0 });
    });
    const id = result.current.openPanels[0].id;

    act(() => {
      result.current.resizePanel(id, 100, 50);
    });

    const updated = result.current.openPanels[0];
    expect(updated.width).toBe(800);
    expect(updated.height).toBe(470);
  });
});
