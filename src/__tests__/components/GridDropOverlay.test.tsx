import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import React from "react";
import { GridDropOverlay } from "../../components/GridDropOverlay";

// Mock props type
type GridCell = { row: number; col: number };

describe("<GridDropOverlay />", () => {
  it("renders the correct number of grid cells", () => {
    const rows = 3;
    const cols = 4;

    const { container } = render(
      <GridDropOverlay rows={rows} cols={cols} visible={true} activeCell={null} />
    );

    const outer = container.firstChild as HTMLElement;
    const innerCells = outer.querySelectorAll("div");
    expect(innerCells.length).toBe(rows * cols);
  });

  it("applies transparent background when not visible", () => {
    const { container } = render(
      <GridDropOverlay rows={2} cols={2} visible={false} activeCell={null} />
    );

    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveStyle({ background: "transparent" });
    expect(overlay).toHaveStyle({ opacity: "0" });
  });

  it("applies visible background and opacity when visible", () => {
    const { container } = render(
      <GridDropOverlay rows={2} cols={2} visible={true} activeCell={null} />
    );

    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveStyle({ background: "rgba(30, 40, 80, 0.18)" });
    expect(overlay).toHaveStyle({ opacity: "1" });
  });

  it("highlights the active cell correctly", () => {
    const activeCell: GridCell = { row: 1, col: 1 };
    const { container } = render(
      <GridDropOverlay rows={2} cols={2} visible={true} activeCell={activeCell} />
    );

    // Each inner div after the first is a cell
    const cells = container.querySelectorAll("div > div");
    const activeIndex = activeCell.row * 2 + activeCell.col;
    const active = cells[activeIndex] as HTMLElement;

    expect(active).toHaveStyle({
      background: "rgba(126,199,255,0.25)",
      borderRadius: "8px",
    });
  });
});
