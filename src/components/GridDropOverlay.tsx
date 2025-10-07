import React, { useMemo } from "react";

import { GridDropOverlayProps } from "../types/types";

/**
 * GridDropOverlay
 * --------------------------------------------------------
 * Provides a visual grid overlay for drop zones within the MainWorkspace.
 * Highlights the active cell during drag operations.
 *
 * @param rows - Number of rows in the grid
 * @param cols - Number of columns in the grid
 * @param activeCell - Currently highlighted grid cell ({ row, col })
 * @param visible - Whether the overlay should be visible
 * @param options - Optional theming (colors, border thickness, etc.)
 */
export const GridDropOverlay: React.FC<GridDropOverlayProps> = React.memo(
  ({ rows, cols, activeCell, visible }) => {
    // Precompute grid cells once (rows * cols)
    const gridCells = useMemo(() => {
      return Array.from({ length: rows * cols }, (_, i) => ({
        row: Math.floor(i / cols),
        col: i % cols,
      }));
    }, [rows, cols]);

    // Base overlay style (memoized for perf)
    const overlayStyle = useMemo<React.CSSProperties>(
      () => ({
        position: "absolute",
        inset: 0,
        display: "grid",
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        background: visible ? "rgba(30, 40, 80, 0.18)" : "transparent",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.15s ease, background 0.15s ease",
        userSelect: "none",
        zIndex: 3000,
        pointerEvents: "none", // Ensure no interference with clicks
      }),
      [rows, cols, visible]
    );

    // Render the grid overlay
    return (
      <div style={overlayStyle}>
        {gridCells.map(({ row, col }) => {
          const isActive = activeCell?.row === row && activeCell?.col === col;

          const cellStyle: React.CSSProperties = {
            border: "2px dashed rgba(126,199,255,0.5)",
            background: isActive ? "rgba(126,199,255,0.25)" : "rgba(255,255,255,0.05)",
            borderRadius: isActive ? 8 : 0,
            boxShadow: isActive ? "0 0 0 2px rgba(126,199,255,0.6)" : undefined,
            transition: "background 0.15s ease, border-radius 0.15s ease",
            pointerEvents: "none",
          };

          return <div key={`${row}-${col}`} style={cellStyle} />;
        })}
      </div>
    );
  }
);
GridDropOverlay.displayName = "GridDropOverlay";
