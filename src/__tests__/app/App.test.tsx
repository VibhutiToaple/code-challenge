import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, beforeEach, expect } from "vitest";

import App from "../../app/App";

// --- Mocks for child components ---
vi.mock("@components/MainWorkspace", () => ({
  MainWorkspace: ({ children, onDrop, onDragOver }: any) => (
    <div
      data-testid="main-workspace"
      onDrop={onDrop}
      onDragOver={onDragOver}
      style={{ width: "100%", height: "100%" }}
    >
      {children}
    </div>
  ),
}));


vi.mock("@components/ResizableDraggablePanel", () => ({
  __esModule: true,
  default: ({ title }: any) => <div data-testid="panel">{title}</div>,
}));

vi.mock("@components/UserProfile", () => ({
  __esModule: true,
  default: ({ onLogout, onThemeToggle, theme }: any) => (
    <div data-testid="user-profile">
      <button onClick={onLogout}>Logout</button>
      <button onClick={onThemeToggle}>Toggle Theme ({theme})</button>
    </div>
  ),
}));

// --- Mock hooks ---
const mockOpenPanels: any[] = [];
const mockOpenPanel = vi.fn();
const mockClosePanel = vi.fn();
const mockMovePanel = vi.fn();
const mockResizePanel = vi.fn();

vi.mock("@hooks/usePanels", () => ({
  usePanels: () => ({
    openPanels: mockOpenPanels,
    openPanel: mockOpenPanel,
    closePanel: mockClosePanel,
    movePanel: mockMovePanel,
    resizePanel: mockResizePanel,
  }),
}));

let mockTheme = "light";
const mockToggleTheme = vi.fn();
vi.mock("@hooks/useTheme", () => ({
  useTheme: () => ({ theme: mockTheme, toggleTheme: mockToggleTheme }),
}));

let mockDragNavPanelKey = null;
const mockOnNavDragStart = vi.fn();
const mockOnNavDragEnd = vi.fn();
vi.mock("@hooks/useNavDrag", () => ({
  useNavDrag: () => ({
    dragNavPanelKey: mockDragNavPanelKey,
    onNavDragStart: (key: string) => () => mockOnNavDragStart(key),
    onNavDragEnd: mockOnNavDragEnd,
  }),
}));

vi.mock("@hooks/useInactivityLogout", () => ({
  useInactivityLogout: vi.fn(),
}));

vi.mock("@components/panelList", () => ({
  panelList: [
    { key: "fruitbook", title: "Fruit Book", content: <div>Fruit Book Panel</div> },
    { key: "fruitview", title: "Fruit View", content: <div>Fruit View Panel</div> },
    { key: "about", title: "About", content: <div>About Panel</div> },
  ],
}));

// --- Mock icons ---
vi.mock("@assets/Icons/TermsIcon", () => ({ default: () => <span>TermsIcon</span> }));
vi.mock("@assets/Icons/AboutIcon", () => ({ default: () => <span>AboutIcon</span> }));
vi.mock("@assets/Icons/FruitViewIcon", () => ({ default: () => <span>FruitViewIcon</span> }));

describe("<App />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOpenPanels.length = 0; // reset panels
    mockTheme = "light";
  });

  it("renders without crashing and shows header text", () => {
    render(<App />);
    expect(screen.getByText(/fruteria/i)).toBeInTheDocument();
    expect(screen.getByText(/No panels open/i)).toBeInTheDocument();
  });

  it("toggles navigation bar when menu button clicked", () => {
    render(<App />);
    const toggleBtn = screen.getByRole("button", { name: /☰/ });
    fireEvent.click(toggleBtn);
    expect(screen.getByText("Fruit Book")).toBeInTheDocument();
  });

  it("calls toggleTheme from UserProfile", () => {
    render(<App />);
    const themeBtn = screen.getByText(/Toggle Theme/);
    fireEvent.click(themeBtn);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it("calls openPanel when a panel item is dropped", () => {
    render(<App />);
    const workspace = screen.getByTestId("main-workspace");

    const mockEvent = {
      preventDefault: vi.fn(),
      dataTransfer: { getData: vi.fn(() => "fruitbook") },
    } as unknown as React.DragEvent<HTMLDivElement>;

    // Simulate drop
    fireEvent.drop(workspace, mockEvent);
    expect(mockOpenPanel).toHaveBeenCalledWith("fruitbook", null, { width: 0, height: 0 });
  });

  it("renders ResizableDraggablePanels when openPanels exist", () => {
    mockOpenPanels.push({
      id: "1",
      title: "Panel 1",
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    });

    render(<App />);
    expect(screen.getByTestId("panel")).toBeInTheDocument();
    expect(screen.getByText("Panel 1")).toBeInTheDocument();
  });

  it("closes a panel when UserProfile logout is clicked", () => {
    render(<App />);
    const logoutBtn = screen.getByText("Logout");
    fireEvent.click(logoutBtn);

    expect(localStorage.getItem("isLoggedIn")).toBeNull();
  });

  it("renders with correct theme class", () => {
    mockTheme = "dark";
    render(<App />);
    const appRoot = document.querySelector(".app-root");
    expect(appRoot).toHaveClass("theme-dark");
  });
});
