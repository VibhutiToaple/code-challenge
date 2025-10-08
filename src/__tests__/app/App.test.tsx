import { render, screen, fireEvent } from "@testing-library/react";
import App from "../../app/App";

const mockOpenPanel = vi.fn();

vi.mock("@hooks/usePanels", () => ({
  usePanels: () => ({
    openPanels: [],
    openPanel: mockOpenPanel,
    closePanel: vi.fn(),
    movePanel: vi.fn(),
    resizePanel: vi.fn(),
  }),
}));

vi.mock("@hooks/useTheme", () => ({
  useTheme: () => ({ theme: "light", toggleTheme: vi.fn() }),
}));

vi.mock("@hooks/useInactivityLogout", () => ({
  useInactivityLogout: vi.fn(),
}));

vi.mock("@hooks/useNavDrag", () => ({
  useNavDrag: () => ({
    dragNavPanelKey: null,
    onNavDragStart: () => vi.fn(),
    onNavDragEnd: vi.fn(),
  }),
}));

vi.mock("@components/MainWorkspace", () => ({
  MainWorkspace: ({ children, onDrop, onDragOver }: any) => (
    <div
      data-testid="workspace"
      onDrop={onDrop}
      onDragOver={onDragOver}
      style={{ width: 200, height: 200 }}
    >
      {children}
    </div>
  ),
}));

vi.mock("@components/UserProfile", () => ({
  __esModule: true,
  default: ({ onThemeToggle }: any) => (
    <button onClick={onThemeToggle} data-testid="theme-toggle">
      Toggle Theme
    </button>
  ),
}));

describe("App Component", () => {
  test("handles drag over and drop events gracefully", () => {
    render(<App />);

    const workspace = screen.getByTestId("workspace");

    // Simulate drag over
    fireEvent.dragOver(workspace, { preventDefault: vi.fn() });

    // ✅ Create mock DataTransfer with getData returning "fruitview"
    const mockDataTransfer = {
      getData: vi.fn(() => "fruitview"),
    };

    // Simulate drop event
    fireEvent.drop(workspace, {
      preventDefault: vi.fn(),
      dataTransfer: mockDataTransfer,
    });

    // ✅ Verify correct call values
    expect(mockOpenPanel).toHaveBeenCalledTimes(1);
    expect(mockOpenPanel).toHaveBeenCalledWith(
      "fruitview",
      null, // dropCell default value
      { width: 0, height: 0 } // containerSize default value
    );
  });
});
