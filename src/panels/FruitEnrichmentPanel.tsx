import { useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";

import ResizableDraggablePanel from "../components/ResizableDraggablePanel";
import { FruitEnrichmentPanelProps } from "../types/types";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

/**
 * Displays enrichment details for a fruit in a draggable, resizable panel.
 * @param fruit The fruit object to display details for.
 * @param onClose Callback to close the panel.
 */
const FruitEnrichmentPanel = ({ fruit, onClose }: FruitEnrichmentPanelProps) => {
  const [panelState, setPanelState] = useState({
    x: 200,
    y: 120,
    width: 400,
    height: 220,
  });

  /**
   * Column definitions for the AG Grid.
   */
  const columnDefs: ColDef<{ property: string; value: any }>[] = [
    {
      headerName: "Property",
      field: "property",
      flex: 1,
      cellStyle: {
        fontWeight: 700,
        color: "#333",
        fontFamily: "inherit",
      },
    },
    {
      headerName: "Value",
      field: "value",
      flex: 2,
      cellStyle: {
        color: "#333",
        fontFamily: "inherit",
      },
    },
  ];

  /**
   * Memoized row data for the grid.
   */
  const rowData = useMemo(
    () => [
      { property: "ID", value: fruit.id },
      { property: "Country", value: fruit.country },
      { property: "Type", value: fruit.type },
      { property: "Status", value: fruit.status },
      { property: "Details", value: fruit.details },
    ],
    [fruit]
  );

  /**
   * Handles moving the panel.
   * @param dx Delta X
   * @param dy Delta Y
   */
  const handleMove = (dx: number, dy: number) => {
    setPanelState((prev) => ({
      ...prev,
      x: prev.x + dx,
      y: prev.y + dy,
    }));
  };

  /**
   * Handles resizing the panel.
   * @param dw Delta width
   * @param dh Delta height
   */
  const handleResize = (dw: number, dh: number) => {
    setPanelState((prev) => ({
      ...prev,
      width: Math.max(320, prev.width + dw),
      height: Math.max(160, prev.height + dh),
    }));
  };

  const [activePanelId, setActivePanelId] = useState<string | null>(null);

  const handleActivate = (id?: string) => setActivePanelId(id || null);

  return (
    <ResizableDraggablePanel
      id={`fruit-enrichment-${fruit.id}`}
      title={`${fruit.name} Enrichment`}
      content={
        <div className="fruit-enrichment-panel">
          <div
            className="ag-theme-alpine"
            style={{
              height: panelState.height - 40,
            }}>
            <AgGridReact
              columnDefs={columnDefs}
              rowData={rowData}
              domLayout="autoHeight"
              headerHeight={32}
              rowHeight={32}
              suppressCellFocus={true}
              suppressMovableColumns={true}
              suppressMenuHide={true}
              className="ag-grid-react"
            />
          </div>
        </div>
      }
      x={panelState.x}
      y={panelState.y}
      width={panelState.width}
      height={panelState.height}
      minWidth={320}
      minHeight={160}
      onClose={onClose}
      onMove={handleMove}
      onResize={handleResize}
      onActivate={(id) => handleActivate(id)}
      style={{ zIndex: activePanelId === fruit.id ? 3000 : 1000 }}
    />
  );
};

export default FruitEnrichmentPanel;
