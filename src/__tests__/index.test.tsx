import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import * as ReactDOMClient from "react-dom/client";

// 🧩 Mock ReactDOM
vi.mock("react-dom/client", async () => {
  const actual = await vi.importActual<typeof ReactDOMClient>("react-dom/client");
  return {
    ...actual,
    createRoot: vi.fn(() => ({
      render: vi.fn(),
    })),
  };
});

// 🧩 Mock ThemeProvider and Root to prevent actual React hooks running
vi.mock("@components/ThemeProvider", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

// 🧩 IMPORTANT — mock Root to prevent real hooks (useState) running
vi.mock("../app/Root", () => ({
  default: () => <div data-testid="root-component">Mock Root</div>,
}));

describe("index.tsx", () => {
  beforeEach(() => {
    vi.resetModules(); // reset the module cache between tests
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
  });

  it("creates root and renders ThemeProvider + Root", async () => {
    // Create root container before import
    const mockContainer = document.createElement("div");
    mockContainer.id = "root";
    document.body.appendChild(mockContainer);

    // Import AFTER mocks
    await import("../index");

    expect(ReactDOMClient.createRoot).toHaveBeenCalledWith(mockContainer);

    const rootInstance = (ReactDOMClient.createRoot as ReturnType<typeof vi.fn>).mock.results[0]
      .value;
    expect(rootInstance.render).toHaveBeenCalledTimes(1);

    const renderArg = rootInstance.render.mock.calls[0][0];
    expect(renderArg.props.children.type().props["data-testid"]).toBe("root-component");
  });

  it("throws error if root container is missing", async () => {
    document.body.innerHTML = "";

    let caughtError: unknown = null;
    try {
      await import("../index");
    } catch (err) {
      caughtError = err;
    }

    expect(caughtError).toBeInstanceOf(Error);
    expect((caughtError as Error).message).toMatch("Root container missing in index.html");
  });
});
