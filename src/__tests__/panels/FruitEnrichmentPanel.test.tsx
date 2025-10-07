import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

const mockResizablePanel = vi.fn(({ title, content, onClose, onMove, onResize }) => (
  <div data-testid="resizable-panel">
    <h3>{title}</h3>
    <div data-testid="panel-content">{content}</div>
    <button data-testid="close-btn" onClick={onClose}>Close</button>
    <button data-testid="move-btn" onClick={() => onMove(20, 10)}>Move</button>
    <button data-testid="resize-btn" onClick={() => onResize(40, 30)}>Resize</button>
  </div>
));
vi.mock("@components/ResizableDraggablePanel", () => ({
  default: (props: any) => mockResizablePanel(props),
}));

vi.mock("ag-grid-react", () => ({
  AgGridReact: ({ columnDefs, rowData }: any) => (
    <div data-testid="ag-grid">
      <div data-testid="col-count">{columnDefs?.length ?? 0}</div>
      <div data-testid="row-count">{rowData?.length ?? 0}</div>
    </div>
  ),
}));

// ✅ IMPORT AFTER MOCKS
import FruitEnrichmentPanel from "@panels/FruitEnrichmentPanel";

describe("<FruitEnrichmentPanel />", () => {
  const mockFruit = {
    id: 1,
    name: "Mango",
    country: "India",
    type: "Tropical",
    status: "Available",
    details: "Sweet and yellow",
  };

  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders ResizableDraggablePanel with correct title", () => {
    render(<FruitEnrichmentPanel fruit={mockFruit} onClose={mockOnClose} />);
    expect(screen.getByText("Mango Enrichment")).toBeInTheDocument();
  });

  it("renders AG Grid with correct columns and rows", () => {
    render(<FruitEnrichmentPanel fruit={mockFruit} onClose={mockOnClose} />);
    expect(screen.getByTestId("ag-grid")).toBeInTheDocument();
    expect(screen.getByTestId("col-count").textContent).toBe("2"); // property/value
    expect(screen.getByTestId("row-count").textContent).toBe("5"); // ID, Country, Type, Status, Details
  });

  it("calls onClose when Close button clicked", () => {
    render(<FruitEnrichmentPanel fruit={mockFruit} onClose={mockOnClose} />);
    fireEvent.click(screen.getByTestId("close-btn"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("updates panel position when moved", () => {
    render(<FruitEnrichmentPanel fruit={mockFruit} onClose={mockOnClose} />);
    fireEvent.click(screen.getByTestId("move-btn"));
    const lastCallProps = mockResizablePanel.mock.lastCall?.[0];
    expect(lastCallProps.x).toBeGreaterThan(200);
    expect(lastCallProps.y).toBeGreaterThan(120);
  });

  it("updates panel size when resized with minimum limits", () => {
    render(<FruitEnrichmentPanel fruit={mockFruit} onClose={mockOnClose} />);
    fireEvent.click(screen.getByTestId("resize-btn"));
    const lastCallProps = mockResizablePanel.mock.lastCall?.[0];
    expect(lastCallProps.width).toBeGreaterThanOrEqual(320);
    expect(lastCallProps.height).toBeGreaterThanOrEqual(160);
  });
});
