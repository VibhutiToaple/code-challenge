import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";

import { useNavDrag } from "../../hooks/useNavDrag";

describe("useNavDrag", () => {
  it("initially has null dragNavPanelKey", () => {
    const { result } = renderHook(() => useNavDrag());
    expect(result.current.dragNavPanelKey).toBeNull();
  });

  it("sets dragNavPanelKey and dataTransfer on drag start", () => {
    const { result } = renderHook(() => useNavDrag());

    // Create a mock drag event
    const mockSetData = vi.fn();
    const mockEvent = {
      dataTransfer: { setData: mockSetData },
    } as unknown as React.DragEvent<HTMLLIElement>;

    act(() => {
      result.current.onNavDragStart("fruitbook")(mockEvent);
    });

    expect(result.current.dragNavPanelKey).toBe("fruitbook");
    expect(mockSetData).toHaveBeenCalledWith("panelKey", "fruitbook");
  });

  it("resets dragNavPanelKey on drag end", () => {
    const { result } = renderHook(() => useNavDrag());

    act(() => {
      result.current.onNavDragStart("fruitview")({
        dataTransfer: { setData: vi.fn() },
      } as unknown as React.DragEvent<HTMLLIElement>);
    });
    expect(result.current.dragNavPanelKey).toBe("fruitview");

    act(() => {
      result.current.onNavDragEnd();
    });

    expect(result.current.dragNavPanelKey).toBeNull();
  });

  it("handles multiple drag starts correctly", () => {
    const { result } = renderHook(() => useNavDrag());
    const mockEvent = { dataTransfer: { setData: vi.fn() } } as any;

    act(() => {
      result.current.onNavDragStart("about")(mockEvent);
      result.current.onNavDragStart("fruitview")(mockEvent);
    });

    expect(result.current.dragNavPanelKey).toBe("fruitview");
    expect(mockEvent.dataTransfer.setData).toHaveBeenCalledWith("panelKey", "fruitview");
  });
});
