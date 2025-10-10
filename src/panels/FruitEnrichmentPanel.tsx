import { useState, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { dimentions, columnDefs } from "@utils/constants";

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
    x: dimentions.twoHundread,
    y: dimentions.oneTwenty,
    width: dimentions.fourHundread,
    height: dimentions.twoTwenty,
  });

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
  const handleMove = useCallback((dx: number, dy: number) => {
    setPanelState((prev) => ({
      ...prev,
      x: prev.x + dx,
      y: prev.y + dy,
    }));
  }, []);

  /**
   * Handles resizing the panel.
   * @param dw Delta width
   * @param dh Delta height
   */
  const handleResize = (dw: number, dh: number) => {
    setPanelState((prev) => ({
      ...prev,
      width: Math.max(dimentions.threeTwenty, prev.width + dw),
      height: Math.max(dimentions.oneSixty, prev.height + dh),
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
              height: panelState.height - dimentions.fourty,
            }}>
            <AgGridReact
              columnDefs={columnDefs}
              rowData={rowData}
              domLayout="autoHeight"
              headerHeight={dimentions.thirtyTwo}
              rowHeight={dimentions.thirtyTwo}
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
      minWidth={dimentions.threeTwenty}
      minHeight={dimentions.oneSixty}
      onClose={onClose}
      onMove={handleMove}
      onResize={handleResize}
      onActivate={(id) => handleActivate(id)}
      style={{
        zIndex: activePanelId === fruit.id ? dimentions.threeThousand : dimentions.oneThousand,
      }}
    />
  );
};

export default FruitEnrichmentPanel;
