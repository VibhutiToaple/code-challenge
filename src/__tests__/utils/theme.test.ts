import { describe, it, expect, beforeEach, vi } from "vitest";
import { getInitialTheme } from "@utils/theme";
import { THEME_KEY, DARK, LIGHT } from "@utils/constants";

describe("getInitialTheme", () => {
  let confirmSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    confirmSpy = vi.spyOn(window, "confirm");
  });

  it("returns stored dark theme if already saved", () => {
    const mockStorage = vi.spyOn(window.localStorage.__proto__, "getItem").mockReturnValue(DARK);
    const result = getInitialTheme();
    expect(result).toBe(DARK);
    expect(mockStorage).toHaveBeenCalledWith(THEME_KEY);
  });

  it("returns stored light theme if already saved", () => {
    const mockStorage = vi.spyOn(window.localStorage.__proto__, "getItem").mockReturnValue(LIGHT);
    const result = getInitialTheme();
    expect(result).toBe(LIGHT);
    expect(mockStorage).toHaveBeenCalledWith(THEME_KEY);
  });

  it("returns dark when no stored theme and user confirms", () => {
    const getItemMock = vi.spyOn(window.localStorage.__proto__, "getItem").mockReturnValue(null);
    const setItemMock = vi.spyOn(window.localStorage.__proto__, "setItem");
    confirmSpy.mockReturnValue(true);

    const result = getInitialTheme();

    expect(result).toBe(DARK);
    expect(setItemMock).toHaveBeenCalledWith(THEME_KEY, DARK);
    expect(getItemMock).toHaveBeenCalledWith(THEME_KEY);
  });

  it("returns light when no stored theme and user cancels", () => {
    const getItemMock = vi.spyOn(window.localStorage.__proto__, "getItem").mockReturnValue(null);
    const setItemMock = vi.spyOn(window.localStorage.__proto__, "setItem");
    confirmSpy.mockReturnValue(false);

    const result = getInitialTheme();

    expect(result).toBe(LIGHT);
    expect(setItemMock).toHaveBeenCalledWith(THEME_KEY, LIGHT);
    expect(getItemMock).toHaveBeenCalledWith(THEME_KEY);
  });

  it("always stores the selected theme when not found", () => {
    vi.spyOn(window.localStorage.__proto__, "getItem").mockReturnValue(null);
    const setItemMock = vi.spyOn(window.localStorage.__proto__, "setItem");
    confirmSpy.mockReturnValue(true);

    getInitialTheme();

    expect(setItemMock).toHaveBeenCalledWith(THEME_KEY, DARK);
  });
});
