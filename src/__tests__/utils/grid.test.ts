import { describe, it, expect } from "vitest";
import { getGridCellPosition } from "@utils/grid";

describe("getGridCellPosition", () => {
  const containerWidth = 800;
  const containerHeight = 600;
  const navBarHeight = 50;

  it("calculates position for top-left cell (0,0)", () => {
    const pos = getGridCellPosition(0, 0, containerWidth, containerHeight, navBarHeight);
    expect(pos).toEqual({
      x: 0,
      y: navBarHeight,
      width: 400, // 800 / 2
      height: 300, // 600 / 2
    });
  });

  it("calculates position for top-right cell (0,1)", () => {
    const pos = getGridCellPosition(0, 1, containerWidth, containerHeight, navBarHeight);
    expect(pos).toEqual({
      x: 400,
      y: navBarHeight,
      width: 400,
      height: 300,
    });
  });

  it("calculates position for bottom-left cell (1,0)", () => {
    const pos = getGridCellPosition(1, 0, containerWidth, containerHeight, navBarHeight);
    expect(pos).toEqual({
      x: 0,
      y: 300 + navBarHeight,
      width: 400,
      height: 300,
    });
  });

  it("calculates position for bottom-right cell (1,1)", () => {
    const pos = getGridCellPosition(1, 1, containerWidth, containerHeight, navBarHeight);
    expect(pos).toEqual({
      x: 400,
      y: 300 + navBarHeight,
      width: 400,
      height: 300,
    });
  });

  it("rounds fractional cell sizes correctly", () => {
    const pos = getGridCellPosition(0, 1, 805, 605, navBarHeight);
    // width and height get rounded
    expect(pos.width).toBe(Math.round(805 / 2)); // 403
    expect(pos.height).toBe(Math.round(605 / 2)); // 303
    expect(pos.x).toBe(Math.round(1 * (805 / 2))); // 403
  });

  it("returns numeric values for all properties", () => {
    const pos = getGridCellPosition(1, 1, containerWidth, containerHeight, navBarHeight);
    expect(typeof pos.x).toBe("number");
    expect(typeof pos.y).toBe("number");
    expect(typeof pos.width).toBe("number");
    expect(typeof pos.height).toBe("number");
  });
});
