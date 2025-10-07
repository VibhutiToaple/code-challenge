import React, { useCallback, useRef, useState, useLayoutEffect } from "react";

/**
 * Custom hook to manage workspace grid tracking and size updates.
 * Supports drag tracking across grid cells and auto-resizes with ResizeObserver.
 */
export const useWorkspaceGrid = ({
  gridRows,
  gridCols,
  onGridChange,
}: {
  gridRows: number;
  gridCols: number;
  onGridChange?: (info: {
    cell: { row: number; col: number } | null;
    size: { width: number; height: number };
  }) => void;
}) => {
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!workspaceRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setContainerSize({ width, height });
    });
    observer.observe(workspaceRef.current);
    return () => observer.disconnect();
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      if (!workspaceRef.current) return;
      const rect = workspaceRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const cellWidth = rect.width / gridCols;
      const cellHeight = rect.height / gridRows;

      const col = Math.max(0, Math.min(gridCols - 1, Math.floor(x / cellWidth)));
      const row = Math.max(0, Math.min(gridRows - 1, Math.floor(y / cellHeight)));
      const cell = { row, col };

      setActiveCell(cell);
      onGridChange?.({ cell, size: { width: rect.width, height: rect.height } });
    },
    [gridCols, gridRows, onGridChange]
  );

  return { workspaceRef, activeCell, containerSize, handleDragOver, setActiveCell };
};
