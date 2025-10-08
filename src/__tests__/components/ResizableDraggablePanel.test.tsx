import { render, screen, fireEvent } from "@testing-library/react";
import ResizableDraggablePanel from "../../components/ResizableDraggablePanel";

describe("ResizableDraggablePanel", () => {
  const defaultProps = {
    title: "Test Panel",
    content: <div>Panel Content</div>,
    x: 100,
    y: 100,
    width: 200,
    height: 150,
    onClose: vi.fn(),
    onMove: vi.fn(),
    onResize: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    Element.prototype.closest = vi.fn(() => ({
      getBoundingClientRect: () => ({
        width: 1000,
        height: 800,
      }),
    }));
  });

  test("renders with title and content", () => {
    render(<ResizableDraggablePanel {...defaultProps} />);
    expect(screen.getByRole("dialog", { name: /test panel/i })).toBeInTheDocument();
    expect(screen.getByText("Panel Content")).toBeInTheDocument();
  });

  test("calls onClose when close button is clicked", () => {
    render(<ResizableDraggablePanel {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /close panel/i }));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  test("calls onMove when dragging occurs", () => {
    render(<ResizableDraggablePanel {...defaultProps} />);
    const header = screen.getByText("Test Panel");

    // Start drag
    fireEvent.pointerDown(header, { clientX: 100, clientY: 100, pointerId: 1 });

    // Move to new position
    fireEvent.pointerMove(header, { clientX: 120, clientY: 130, pointerId: 1 });

    // End drag
    fireEvent.pointerUp(header, { pointerId: 1 });

    // ✅ Should now call onMove
    expect(defaultProps.onMove).toHaveBeenCalledTimes(1);
  });

  test("calls onResize when resizing occurs", () => {
    render(<ResizableDraggablePanel {...defaultProps} />);
    const handle = document.querySelector(".resize-handle") as HTMLElement;

    fireEvent.pointerDown(handle, { clientX: 200, clientY: 200, pointerId: 2 });
    fireEvent.pointerMove(handle, { clientX: 260, clientY: 260, pointerId: 2 });
    fireEvent.pointerUp(handle, { pointerId: 2 });

    expect(defaultProps.onResize).toHaveBeenCalled();
  });

  test("calls onClose when Escape key is pressed", () => {
    render(<ResizableDraggablePanel {...defaultProps} />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });
});
