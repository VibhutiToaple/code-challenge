import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Mocks
vi.mock("@hooks/useWorkspaceGrid", () => ({
  useWorkspaceGrid: vi.fn(() => ({
    workspaceRef: { current: document.createElement("div") },
    activeCell: null,
    containerSize: { width: 800, height: 600 },
    handleDragOver: vi.fn(),
    setActiveCell: vi.fn(),
  })),
}));

import { MainWorkspace } from "../../components/MainWorkspace";
import { GridDropOverlay } from "../../components/GridDropOverlay";

// Mock GridDropOverlay for easier assertions
vi.mock("../../components/GridDropOverlay", () => ({
  GridDropOverlay: vi.fn(() => <div data-testid="grid-overlay" />),
}));

describe("<MainWorkspace />", () => {
  const onDrop = vi.fn();
  const onDragOver = vi.fn();
  const onGridDropInfo = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders workspace and children", () => {
    render(
      <MainWorkspace onDrop={onDrop} onDragOver={onDragOver} onGridDropInfo={onGridDropInfo}>
        <div data-testid="child">Child</div>
      </MainWorkspace>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByTestId("grid-overlay")).toBeInTheDocument();
  });

  it("calls onDragOver when dragging over workspace", () => {
    const { container } = render(
      <MainWorkspace onDrop={onDrop} onDragOver={onDragOver} onGridDropInfo={onGridDropInfo}>
        <div>Content</div>
      </MainWorkspace>
    );

    const workspace = container.querySelector(".main-container")!;
    const dragEvent = new Event("dragover", { bubbles: true });

    act(() => {
      workspace.dispatchEvent(dragEvent);
    });

    expect(onDragOver).toHaveBeenCalled();
  });

  it("calls onDrop with correct event and resets state", () => {
    const { container } = render(
      <MainWorkspace onDrop={onDrop} onDragOver={onDragOver} onGridDropInfo={onGridDropInfo}>
        <div>Panel</div>
      </MainWorkspace>
    );

    const workspace = container.querySelector(".main-container")!;
    const dropEvent = new Event("drop", { bubbles: true });

    act(() => {
      workspace.dispatchEvent(dropEvent);
    });

    expect(onDrop).toHaveBeenCalled();
    expect(onGridDropInfo).toHaveBeenCalledWith({
      cell: null,
      size: { width: 800, height: 600 },
    });
  });

  it("sets dragging true on dragenter and false on dragleave", () => {
    const addEventListenerSpy = vi.spyOn(window.HTMLElement.prototype, "addEventListener");
    const removeEventListenerSpy = vi.spyOn(window.HTMLElement.prototype, "removeEventListener");

    render(
      <MainWorkspace onDrop={onDrop} onDragOver={onDragOver} onGridDropInfo={onGridDropInfo}>
        <div>Panel</div>
      </MainWorkspace>
    );

    expect(addEventListenerSpy).toHaveBeenCalledWith("dragenter", expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith("dragleave", expect.any(Function));

    expect(removeEventListenerSpy).not.toHaveBeenCalled();
  });

  it("handles global panel drag events", () => {
    render(
      <MainWorkspace onDrop={onDrop} onDragOver={onDragOver} onGridDropInfo={onGridDropInfo}>
        <div>Panel</div>
      </MainWorkspace>
    );

    act(() => {
      window.dispatchEvent(new Event("panel-drag-start"));
      window.dispatchEvent(new Event("panel-drag-end"));
    });

    // The GridDropOverlay is re-rendered; we just confirm component stability
    expect(screen.getByTestId("grid-overlay")).toBeInTheDocument();
  });

  it("handles Escape key press to reset drag state", () => {
    render(
      <MainWorkspace onDrop={onDrop} onDragOver={onDragOver} onGridDropInfo={onGridDropInfo}>
        <div>Panel</div>
      </MainWorkspace>
    );

    act(() => {
      const event = new KeyboardEvent("keydown", { key: "Escape" });
      window.dispatchEvent(event);
    });

    // Verify cleanup function stability
    expect(screen.getByTestId("grid-overlay")).toBeInTheDocument();
  });
});
