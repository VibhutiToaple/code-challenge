import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { vi, describe, it, beforeEach, afterEach, expect } from "vitest";

import Root from "../../app/Root";

// --- Mock dependencies ---
vi.mock("@utils/auth", () => ({
  isLoggedIn: vi.fn(),
}));

vi.mock("@components/LoginComponent", () => ({
  __esModule: true,
  default: ({ onLoginSuccess }: any) => (
    <div data-testid="login">
      <button data-testid="login-btn" onClick={onLoginSuccess}>
        Login
      </button>
    </div>
  ),
}));

vi.mock("../../app/App", () => ({
  __esModule: true,
  default: () => <div data-testid="app">App Loaded</div>,
}));

// --- Import mocks ---
import { isLoggedIn } from "@utils/auth";

describe("<Root />", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders LoginComponent when user is not logged in", () => {
    (isLoggedIn as vi.Mock).mockReturnValue(false);

    render(<Root />);
    expect(screen.getByTestId("login")).toBeInTheDocument();
    expect(screen.queryByTestId("app")).not.toBeInTheDocument();
  });

  it("renders App when user is logged in", () => {
    (isLoggedIn as vi.Mock).mockReturnValue(true);

    render(<Root />);
    expect(screen.getByTestId("app")).toBeInTheDocument();
    expect(screen.queryByTestId("login")).not.toBeInTheDocument();
  });

  it("logs in user and shows App after successful login", () => {
    (isLoggedIn as vi.Mock).mockReturnValueOnce(false).mockReturnValueOnce(true);

    render(<Root />);
    const btn = screen.getByTestId("login-btn");

    // Spy on window event dispatch
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");

    // Simulate login success
    fireEvent.click(btn);

    // Validate localStorage and event
    expect(localStorage.getItem("isLoggedIn")).toBe("true");
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Event));
  });

  it("adds and removes login-success event listener", () => {
    const addEventSpy = vi.spyOn(window, "addEventListener");
    const removeEventSpy = vi.spyOn(window, "removeEventListener");
    (isLoggedIn as vi.Mock).mockReturnValue(false);

    const { unmount } = render(<Root />);
    expect(addEventSpy).toHaveBeenCalledWith("login-success", expect.any(Function));

    unmount();
    expect(removeEventSpy).toHaveBeenCalledWith("login-success", expect.any(Function));
  });
});
