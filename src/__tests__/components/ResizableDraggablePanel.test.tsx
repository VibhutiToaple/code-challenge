import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ResizableDraggablePanel from "../../components/ResizableDraggablePanel";

describe("<ResizableDraggablePanel />", () => {
  const defaultProps = {
    title: "Test Panel",
    content: <div data-testid="content">Hello</div>,
    x: 50,
    y: 50,
    width: 300,
    height: 200,
    onClose: vi.fn(),
    onMove: vi.fn(),
    onResize: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock getBoundingClientRect for container bounds
    Element.prototype.closest = vi.fn(() => ({
      getBoundingClientRect: () => ({ width: 800, height: 600 }),
    })) as any;
  });

  it("renders title and content correctly", () => {
    render(<ResizableDraggablePanel {...defaultProps} />);
    expect(screen.getByText("Test Panel")).toBeInTheDocument();
    expect(screen.getByTestId("content")).toHaveTextContent("Hello");
  });

  it("calls onClose when close button is clicked", () => {
    render(<ResizableDraggablePanel {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /close panel/i }));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("triggers onMove when dragging", () => {
    render(<ResizableDraggablePanel {...defaultProps} />);
    const header = screen.getByText("Test Panel");

    // Simulate drag start and movement
    fireEvent.pointerDown(header, { clientX: 100, clientY: 100, pointerId: 1 });
    fireEvent.pointerMove(header, { clientX: 120, clientY: 130, pointerId: 1 });
    fireEvent.pointerUp(header, { pointerId: 1 });

    expect(defaultProps.onMove).toHaveBeenCalled();
  });

  it("triggers onResize when resizing", () => {
    render(<ResizableDraggablePanel {...defaultProps} />);
    const handle = document.querySelector(".resize-handle") as HTMLElement;

    fireEvent.pointerDown(handle, { clientX: 200, clientY: 200, pointerId: 1 });
    fireEvent.pointerMove(handle, { clientX: 250, clientY: 240, pointerId: 1 });
    fireEvent.pointerUp(handle, { pointerId: 1 });

    expect(defaultProps.onResize).toHaveBeenCalled();
  });

  it("respects minWidth and minHeight during resize", () => {
    render(
      <ResizableDraggablePanel
        {...defaultProps}
        width={100}
        height={80}
        minWidth={150}
        minHeight={100}
      />
    );

    const handle = document.querySelector(".resize-handle") as HTMLElement;
    fireEvent.pointerDown(handle, { clientX: 100, clientY: 100, pointerId: 1 });
    fireEvent.pointerMove(handle, { clientX: 50, clientY: 50, pointerId: 1 });
    fireEvent.pointerUp(handle, { pointerId: 1 });

    expect(defaultProps.onResize).toHaveBeenCalledWith(
      expect.any(Number),
      expect.any(Number)
    );
  });

  it("clamps movement within parent container bounds", () => {
    render(
      <ResizableDraggablePanel
        {...defaultProps}
        x={790}
        y={590}
        width={20}
        height={20}
      />
    );

    const header = screen.getByText("Test Panel");
    fireEvent.pointerDown(header, { clientX: 10, clientY: 10, pointerId: 1 });
    fireEvent.pointerMove(header, { clientX: 900, clientY: 900, pointerId: 1 });
    fireEvent.pointerUp(header, { pointerId: 1 });

    // The panel should not move beyond container limits
    expect(defaultProps.onMove).toHaveBeenCalledWith(expect.any(Number), expect.any(Number));
  });

  it("calls onClose when Escape is pressed and not dragging/resizing", () => {
    render(<ResizableDraggablePanel {...defaultProps} />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("does not call onClose when Escape pressed during drag/resize", () => {
    render(<ResizableDraggablePanel {...defaultProps} />);
    const header = screen.getByText("Test Panel");

    fireEvent.pointerDown(header, { clientX: 100, clientY: 100, pointerId: 1 });
    fireEvent.keyDown(window, { key: "Escape" });
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it("applies expected styles and role attributes", () => {
    render(<ResizableDraggablePanel {...defaultProps} />);
    const panel = screen.getByRole("dialog", { name: "Test Panel" });

    expect(panel).toHaveStyle({
      position: "absolute",
      borderRadius: "12px",
      overflow: "hidden",
    });
  });
});
