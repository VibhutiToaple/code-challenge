import React, { useEffect, useState, useCallback } from "react";
import { useWorkspaceGrid } from "@hooks/useWorkspaceGrid";

import { GridDropOverlay } from "./GridDropOverlay";
import { MainWorkspaceProps } from "../types/types";

/**
 * MainWorkspace component:
 * Handles drag-and-drop grid visualization and workspace layout tracking.
 */
export const MainWorkspace = ({
  children,
  onDrop,
  onDragOver,
  onGridDropInfo,
  gridRows = 2,
  gridCols = 2,
}: MainWorkspaceProps) => {
  const [dragging, setDragging] = useState(false);
  const [isPanelDragging, setIsPanelDragging] = useState(false);

  const { workspaceRef, activeCell, containerSize, handleDragOver, setActiveCell } =
    useWorkspaceGrid({
      gridRows,
      gridCols,
      onGridChange: onGridDropInfo,
    });

  // Handle external drag enter/leave
  useEffect(() => {
    const node = workspaceRef.current;
    if (!node) return;

    const handleDragEnter = () => setDragging(true);
    const handleDragLeave = () => {
      setDragging(false);
      setActiveCell(null);
      onGridDropInfo?.({ cell: null, size: containerSize });
    };

    node.addEventListener("dragenter", handleDragEnter);
    node.addEventListener("dragleave", handleDragLeave);
    return () => {
      node.removeEventListener("dragenter", handleDragEnter);
      node.removeEventListener("dragleave", handleDragLeave);
    };
  }, [containerSize, onGridDropInfo, setActiveCell]);

  // Listen for global panel drag events
  useEffect(() => {
    const handlePanelDragStart = () => setIsPanelDragging(true);
    const handlePanelDragEnd = () => {
      setIsPanelDragging(false);
      setActiveCell(null);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDragging(false);
        setIsPanelDragging(false);
        setActiveCell(null);
      }
    };

    window.addEventListener("panel-drag-start", handlePanelDragStart);
    window.addEventListener("panel-drag-end", handlePanelDragEnd);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("panel-drag-start", handlePanelDragStart);
      window.removeEventListener("panel-drag-end", handlePanelDragEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setActiveCell]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      setDragging(false);
      setIsPanelDragging(false);
      setActiveCell(null);
      onGridDropInfo?.({ cell: null, size: containerSize });
      onDrop(e);
    },
    [containerSize, onDrop, onGridDropInfo, setActiveCell]
  );

  return (
    <div
      ref={workspaceRef}
      className="main-container"
      onDrop={handleDrop}
      onDragOver={(e) => {
        handleDragOver(e);
        onDragOver(e);
      }}>
      {children}
      <GridDropOverlay
        rows={gridRows}
        cols={gridCols}
        activeCell={activeCell}
        visible={dragging || isPanelDragging}
        theme={{
          borderColor: "#00bfff",
          activeColor: "#007acc",
        }}
      />
    </div>
  );
};
