import React from "react";
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ConfigProvider, theme as antdTheme } from "antd";
import { ThemeProvider, useTheme } from "../../components/ThemeProvider";
import { DARK, LIGHT, APP_THEME } from "../../utils/constants";

vi.mock("antd", async () => {
  const actual = await vi.importActual("antd");
  return {
    ...actual,
    ConfigProvider: vi.fn(({ children }) => <div data-testid="config-provider">{children}</div>),
    theme: {
      ...actual.theme,
      darkAlgorithm: "darkAlgorithmMock",
      defaultAlgorithm: "defaultAlgorithmMock",
    },
  };
});

describe("<ThemeProvider />", () => {
  const mockMatchMedia = (isDark: boolean) => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: isDark,
        media: "(prefers-color-scheme: dark)",
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    document.body.className = "";
  });

  it("defaults to light theme when no preference stored and system is light", () => {
    mockMatchMedia(false);

    render(
      <ThemeProvider>
        <div data-testid="child">App</div>
      </ThemeProvider>
    );

    expect(document.body.classList.contains("theme-light")).toBe(true);
    expect(document.body.classList.contains("theme-dark")).toBe(false);
  });

  it("defaults to dark theme when system prefers dark", () => {
    mockMatchMedia(true);

    render(
      <ThemeProvider>
        <div data-testid="child">App</div>
      </ThemeProvider>
    );

    expect(document.body.classList.contains("theme-dark")).toBe(true);
  });

  it("uses stored theme preference if available", () => {
    localStorage.setItem(APP_THEME, DARK);

    render(
      <ThemeProvider>
        <div>Content</div>
      </ThemeProvider>
    );

    expect(document.body.classList.contains("theme-dark")).toBe(true);
  });

  it("toggles theme and updates localStorage", () => {
    mockMatchMedia(false);

    // Custom hook consumer to test context behavior
    const TestComponent = () => {
      const { theme, toggleTheme } = useTheme();
      return (
        <div>
          <span data-testid="theme">{theme}</span>
          <button onClick={toggleTheme}>Toggle</button>
        </div>
      );
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const themeSpan = screen.getByTestId("theme");
    const toggleButton = screen.getByRole("button", { name: /toggle/i });

    // Initially light
    expect(themeSpan.textContent).toBe(LIGHT);
    expect(document.body.classList.contains("theme-light")).toBe(true);

    // Toggle to dark
    act(() => toggleButton.click());
    expect(themeSpan.textContent).toBe(DARK);
    expect(localStorage.getItem(APP_THEME)).toBe(DARK);
    expect(document.body.classList.contains("theme-dark")).toBe(true);
  });

  it("applies correct Ant Design algorithm", () => {
    localStorage.setItem(APP_THEME, DARK);
    render(
      <ThemeProvider>
        <div>AntD</div>
      </ThemeProvider>
    );

    const antdConfigCall = (ConfigProvider as any).mock.calls[0][0];
    expect(antdConfigCall.theme.algorithm).toBe("darkAlgorithmMock");
  });
});
