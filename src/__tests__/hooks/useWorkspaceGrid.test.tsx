import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { useWorkspaceGrid } from "../../hooks/useWorkspaceGrid";

// Mock ResizeObserver implementation
class MockResizeObserver {
  static instances: MockResizeObserver[] = [];
  callback: ResizeObserverCallback;
  observedElement: Element | null = null;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    MockResizeObserver.instances.push(this);
  }

  observe(element: Element) {
    this.observedElement = element;
  }

  disconnect() {
    this.observedElement = null;
  }

  triggerResize(width: number, height: number) {
    this.callback([{ contentRect: { width, height } }] as any, this as any);
  }
}
(global as any).ResizeObserver = MockResizeObserver;

describe("useWorkspaceGrid", () => {
  let mockDiv: HTMLDivElement;

  beforeEach(() => {
    mockDiv = document.createElement("div");
    mockDiv.getBoundingClientRect = vi.fn(() => ({
      left: 0,
      top: 0,
      width: 600,
      height: 300,
      right: 600,
      bottom: 300,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
  });

  afterEach(() => {
    MockResizeObserver.instances = [];
    vi.restoreAllMocks();
  });

  it("disconnects ResizeObserver on unmount", () => {
    const { unmount } = renderHook(() => {
      // ✅ Attach ref *during render*, not after
      const hook = useWorkspaceGrid({ gridRows: 2, gridCols: 2 });
      hook.workspaceRef.current = mockDiv;
      return hook;
    });

    // ✅ After mount, there should be one observer
    expect(MockResizeObserver.instances.length).toBe(1);

    // Unmount and ensure disconnect was called
    act(() => {
      unmount();
    });

    expect(MockResizeObserver.instances[0].observedElement).toBeNull();
  });

  it("updates activeCell and calls onGridChange on drag over", () => {
    const onGridChange = vi.fn();
    const { result } = renderHook(() =>
      useWorkspaceGrid({ gridRows: 2, gridCols: 2, onGridChange })
    );

    act(() => {
      result.current.workspaceRef.current = mockDiv;
    });

    const mockEvent = {
      clientX: 300,
      clientY: 150,
      preventDefault: vi.fn(),
    } as unknown as React.DragEvent;

    act(() => {
      result.current.handleDragOver(mockEvent);
    });

    expect(result.current.activeCell).toEqual({ row: 1, col: 1 });
    expect(onGridChange).toHaveBeenCalledWith({
      cell: { row: 1, col: 1 },
      size: { width: 600, height: 300 },
    });
  });
});
