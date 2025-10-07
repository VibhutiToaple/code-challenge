import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

import { useInactivityLogout } from "../../hooks/useInactivityLogout";
import { INACTIVITY_LIMIT } from "@utils/constants";

describe("useInactivityLogout", () => {
  let dispatchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    dispatchSpy = vi.spyOn(window, "dispatchEvent");
  });

  afterEach(() => {
    vi.useRealTimers();
    dispatchSpy.mockRestore();
  });

  it("sets up inactivity timer and logs out after timeout", () => {
    renderHook(() => useInactivityLogout());

    // Initially, user is "logged in"
    localStorage.setItem("isLoggedIn", "true");

    // Fast-forward beyond the inactivity limit
    act(() => {
      vi.advanceTimersByTime(INACTIVITY_LIMIT + 1000);
    });

    // Expect user to be logged out and event fired
    expect(localStorage.getItem("isLoggedIn")).toBeNull();
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Event));
    expect(dispatchSpy.mock.calls[0][0].type).toBe("login-success");
  });

  it("resets timer on user activity", () => {
    renderHook(() => useInactivityLogout());

    localStorage.setItem("isLoggedIn", "true");

    // Trigger activity partway through
    act(() => {
      window.dispatchEvent(new Event("mousemove"));
      vi.advanceTimersByTime(INACTIVITY_LIMIT / 2);
      window.dispatchEvent(new Event("keydown"));
    });

    // Immediately after activity, user should still be logged in
    expect(localStorage.getItem("isLoggedIn")).toBe("true");

    // Advance full inactivity duration after last activity
    act(() => {
      vi.advanceTimersByTime(INACTIVITY_LIMIT + 10);
    });

    // Now logout should have occurred
    expect(localStorage.getItem("isLoggedIn")).toBeNull();
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Event));
  });

  it("cleans up listeners on unmount", () => {
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useInactivityLogout());

    unmount();

    expect(removeSpy).toHaveBeenCalledWith("mousemove", expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith("mousedown", expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith("touchstart", expect.any(Function));

    removeSpy.mockRestore();
  });
});
