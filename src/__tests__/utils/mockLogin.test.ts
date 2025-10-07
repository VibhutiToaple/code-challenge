import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockLogin } from "@utils/mockLogin";
import { USERNAME, PASSWORD } from "@utils/constants";

// Use fake timers to control setTimeout
vi.useFakeTimers();

describe("mockLogin utility", () => {
  beforeEach(() => {
    vi.clearAllTimers();
  });

  it("resolves with a user object when correct credentials are provided", async () => {
    const promise = mockLogin(USERNAME, PASSWORD);

    // Fast-forward all timers
    vi.runAllTimers();

    const result = await promise;

    expect(result).toEqual({
      id: "1",
      username: USERNAME,
      role: "admin",
    });
  });

  it("resolves with null when incorrect credentials are provided", async () => {
    const promise = mockLogin("wrongUser", "wrongPassword");

    vi.runAllTimers();

    const result = await promise;
    expect(result).toBeNull();
  });

  it("returns a Promise that resolves after approximately 300ms", async () => {
    const setTimeoutSpy = vi.spyOn(global, "setTimeout");

    const promise = mockLogin(USERNAME, PASSWORD);
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 300);

    vi.runAllTimers();
    await promise;
  });

  it("handles empty username/password gracefully", async () => {
    const promise = mockLogin("", "");

    vi.runAllTimers();

    const result = await promise;
    expect(result).toBeNull();
  });
});
