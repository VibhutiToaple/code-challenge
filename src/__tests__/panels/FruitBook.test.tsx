import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ReactDOM from "react-dom";
import FruitBook from "@panels/FruitBookPanel"; // adjust if your path differs

// Mock ReactDOM.createPortal to just render children inline for testing
vi.spyOn(ReactDOM, "createPortal").mockImplementation((node) => node as any);

// Mock data
vi.mock("@data/fruits", () => ({
  fruits: [
    { id: 1, name: "Apple", country: "USA", type: "Fresh", status: "Available", details: "Red" },
    { id: 2, name: "Banana", country: "India", type: "Tropical", status: "Pending", details: "Yellow" },
  ],
}));

// Mock FruitEnrichmentPanel
vi.mock("@panels/FruitEnrichmentPanel", () => ({
  default: ({ fruit, onClose }: any) => (
    <div data-testid="enrichment-panel">
      <p>Selected: {fruit.name}</p>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

// Mock AgGridReact to simulate behavior
vi.mock("ag-grid-react", () => ({
  AgGridReact: ({ ref, onSelectionChanged, onRowDoubleClicked }: any) => {
    // Simulate ref with working API
    if (ref) {
      ref.current = {
        api: {
          getSelectedNodes: () => [
            {
              data: { id: 1, name: "Apple", country: "USA", type: "Fresh", status: "Available" },
            },
          ],
        },
      };
    }

    return (
      <div data-testid="mock-grid">
        <button data-testid="select-row" onClick={onSelectionChanged}>
          Select Apple
        </button>
        <button
          data-testid="double-click-row"
          onClick={() => onRowDoubleClicked({ data: { id: 2, name: "Banana" } })}
        >
          Double Click Banana
        </button>
      </div>
    );
  },
}));


describe("<FruitBook />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = "";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the title and grid container", () => {
    render(<FruitBook />);
    expect(screen.getByText("Fruit Book")).toBeInTheDocument();
    expect(screen.getByTestId("mock-grid")).toBeInTheDocument();
  });

  it("opens enrichment panel on row double-click", () => {
    render(<FruitBook />);
    const doubleClickBtn = screen.getByTestId("double-click-row");
    fireEvent.click(doubleClickBtn);

    expect(screen.getByTestId("enrichment-panel")).toBeInTheDocument();
    expect(screen.getByText(/selected: banana/i)).toBeInTheDocument();
  });

  it("opens enrichment panel on row selection", () => {
    render(<FruitBook />);
    const selectBtn = screen.getByTestId("select-row");
    fireEvent.click(selectBtn);

    expect(screen.getByTestId("enrichment-panel")).toBeInTheDocument();
    expect(screen.getByText(/selected: apple/i)).toBeInTheDocument();
  });

  it("closes enrichment panel when close button is clicked", () => {
    render(<FruitBook />);
    const doubleClickBtn = screen.getByTestId("double-click-row");
    fireEvent.click(doubleClickBtn);

    const closeBtn = screen.getByText("Close");
    fireEvent.click(closeBtn);

    expect(screen.queryByTestId("enrichment-panel")).not.toBeInTheDocument();
  });

  it("renders portal into document.body", () => {
    render(<FruitBook />);
    fireEvent.click(screen.getByTestId("select-row"));

    const portalNode = screen.getByTestId("enrichment-panel");
    expect(portalNode.parentNode).toBe(document.body);
  });
});
