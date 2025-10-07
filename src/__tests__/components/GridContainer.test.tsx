import { render, screen, fireEvent } from "@testing-library/react";
import GridContainer from "@components/GridContainer";
import * as panelsModule from "@data/panelsData";

vi.mock("../../components/ResizableDraggablePanel", () => ({
  default: ({ title, onClose }: any) => (
    <div data-testid="panel">
      <span>{title}</span>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

// Mock panel data
const mockPanels = [
  { id: "1", title: "Panel A", x: 0, y: 0, width: 100, height: 100 },
  { id: "2", title: "Panel B", x: 0, y: 0, width: 100, height: 100 },
];

describe("<GridContainer />", () => {
  beforeEach(() => {
    vi.spyOn(panelsModule, "panelsData", "get").mockReturnValue(mockPanels);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders all panels from data", () => {
    render(<GridContainer />);
    const panels = screen.getAllByTestId("panel");
    expect(panels).toHaveLength(mockPanels.length);
    expect(screen.getByText("Panel A")).toBeInTheDocument();
    expect(screen.getByText("Panel B")).toBeInTheDocument();
  });

  it("removes a panel when Close is clicked", () => {
    render(<GridContainer />);
    const closeButtons = screen.getAllByText("Close");
    fireEvent.click(closeButtons[0]); // Close Panel A
    expect(screen.queryByText("Panel A")).not.toBeInTheDocument();
    expect(screen.getByText("Panel B")).toBeInTheDocument();
  });

  it("changes layout to horizontal", () => {
    render(<GridContainer />);
    const horizontalBtn = screen.getByText("↔️");
    fireEvent.click(horizontalBtn);
    expect(horizontalBtn).toBeInTheDocument(); // just ensures click doesn’t crash
  });

  it("changes layout to vertical", () => {
    render(<GridContainer />);
    const verticalBtn = screen.getByText("↕️");
    fireEvent.click(verticalBtn);
    expect(verticalBtn).toBeInTheDocument();
  });

  it("changes layout to random", () => {
    render(<GridContainer />);
    const randomBtn = screen.getByText("💃");
    fireEvent.click(randomBtn);
    expect(randomBtn).toBeInTheDocument();
  });
});
