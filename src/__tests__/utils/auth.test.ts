import { describe, it, expect, beforeEach, vi } from "vitest";
import { isLoggedIn } from "@utils/auth";

describe("isLoggedIn utility", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("returns true when localStorage has isLoggedIn = 'true'", () => {
    localStorage.setItem("isLoggedIn", "true");
    expect(isLoggedIn()).toBe(true);
  });

  it("returns false when localStorage has isLoggedIn = 'false'", () => {
    localStorage.setItem("isLoggedIn", "false");
    expect(isLoggedIn()).toBe(false);
  });

  it("returns false when localStorage has no isLoggedIn key", () => {
    expect(isLoggedIn()).toBe(false);
  });

  it("calls localStorage.getItem with correct key", () => {
    const getItemSpy = vi.fn().mockReturnValue("true");
    const mockLocalStorage = { getItem: getItemSpy } as any;
    const originalStorage = global.localStorage;
    global.localStorage = mockLocalStorage;

    isLoggedIn();

    expect(getItemSpy).toHaveBeenCalledWith("isLoggedIn");

    global.localStorage = originalStorage;
  });
});
