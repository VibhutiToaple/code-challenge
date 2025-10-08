import { useState, useRef } from "react";
import ReactDOM from "react-dom";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { fruits } from "@data/fruits";

import FruitEnrichmentPanel from "./FruitEnrichmentPanel";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// Register ag-grid modules (required for module-based builds)
ModuleRegistry.registerModules([AllCommunityModule]);

const columnDefs: ColDef[] = [
  { headerName: "ID", field: "id", minWidth: 90 },
  { headerName: "Fruit", field: "name", minWidth: 120 },
  { headerName: "Country", field: "country", minWidth: 120 },
  { headerName: "Type", field: "type", minWidth: 120 },
  {
    headerName: "Status",
    field: "status",
    minWidth: 120,
    cellStyle: (params: any) => ({
      color:
        params.value === "Available"
          ? "#7c5fe6"
          : params.value === "Pending"
            ? "#ffb300"
            : "#e57373",
      fontWeight: 700,
      fontFamily: "monospace",
      fontSize: 16,
      background: "#232b3e",
    }),
  },
  { headerName: "Details", field: "details", minWidth: 180 },
];

const defaultColDef = {
  flex: 1,
  resizable: true,
};

const FruitBook = () => {
  const [selectedFruit, setSelectedFruit] = useState<any | null>(null);
  const gridRef = useRef<any>(null);
  const portalContainer = document.querySelector(".main-container") || document.body;

  const onRowDoubleClicked = (event: any) => {
    setSelectedFruit(event.data);
  };

  const onSelectionChanged = () => {
    const selectedNodes = gridRef.current?.api.getSelectedNodes();
    if (selectedNodes && selectedNodes.length > 0) {
      setSelectedFruit(selectedNodes[0].data);
    }
  };

  return (
    <>
      <div className="fruit-book-panel">
        <div className="fruit-book-header">Fruit Book</div>
        <div className="ag-theme-alpine">
          <AgGridReact<any>
            data-testid="select-row"
            ref={gridRef}
            rowData={fruits}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            headerHeight={38}
            rowHeight={38}
            rowSelection="single"
            onSelectionChanged={onSelectionChanged}
            onRowDoubleClicked={onRowDoubleClicked}
            getRowStyle={(params) => {
              if (selectedFruit && params.data.id === selectedFruit.id) {
                return {
                  fontFamily: "monospace",
                  fontSize: 16,
                  color: "#fff",
                  background: "#7c5fe6",
                };
              }
              return {
                fontFamily: "monospace",
                fontSize: 16,
                color: "#f5f5f5",
                background:
                  params.node.rowIndex && params.node.rowIndex % 2 === 0 ? "#232b3e" : "#262f47",
              };
            }}
            suppressCellFocus={true}
          />
        </div>
      </div>
      {selectedFruit &&
        ReactDOM.createPortal(
          <FruitEnrichmentPanel fruit={selectedFruit} onClose={() => setSelectedFruit(null)} />,
          portalContainer
        )}
    </>
  );
};

export default FruitBook;
