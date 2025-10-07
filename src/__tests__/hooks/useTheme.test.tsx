import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

import { useTheme } from "../../hooks/useTheme";
import { THEME_KEY, DARK, LIGHT } from "@utils/constants";

vi.mock("@utils/theme", () => ({
  getInitialTheme: vi.fn(() => LIGHT),
}));

describe("useTheme hook", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.className = "";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("initializes theme from getInitialTheme()", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe(LIGHT);
  });

  it("applies correct body class on mount", () => {
    renderHook(() => useTheme());
    expect(document.body.classList.contains("theme-light")).toBe(true);
  });

  it("toggles theme from light → dark and updates localStorage", () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe(DARK);
    expect(localStorage.getItem(THEME_KEY)).toBe(DARK);
    expect(document.body.classList.contains("theme-dark")).toBe(true);
  });

  it("toggles theme from dark → light", () => {
    const { result, rerender } = renderHook(() => useTheme());

    // Force dark mode first
    act(() => {
      result.current.toggleTheme(); // now dark
    });
    expect(result.current.theme).toBe(DARK);

    // Toggle again → should switch back to light
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe(LIGHT);
    expect(localStorage.getItem(THEME_KEY)).toBe(LIGHT);
    expect(document.body.classList.contains("theme-light")).toBe(true);
  });

  it("removes both theme classes before applying new one", () => {
    const { result } = renderHook(() => useTheme());
    document.body.classList.add("theme-dark", "theme-light");

    act(() => {
      result.current.toggleTheme();
    });

    const classes = Array.from(document.body.classList);
    expect(classes).toContain("theme-dark");
    expect(classes).not.toContain("theme-light");
  });
});
