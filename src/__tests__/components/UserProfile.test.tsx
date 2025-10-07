import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UserProfile from "../../components/UserProfile";

// Mock Ant Design components to simplify behavior
vi.mock("antd", async () => {
  const actual = await vi.importActual("antd");
  return {
    ...actual,
    Button: ({ children, onClick, ...props }: any) => (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    ),
    Switch: ({ checked, onChange, checkedChildren, unCheckedChildren }: any) => (
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={() => onChange(!checked)}
        aria-checked={checked}
        data-checked={checked}
      />
    ),
    Typography: {
      Text: ({ children }: any) => <span>{children}</span>,
    },
  };
});

describe("<UserProfile />", () => {
  let mockLogout: ReturnType<typeof vi.fn>;
  let mockThemeToggle: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockLogout = vi.fn();
    mockThemeToggle = vi.fn();
  });

  it("renders without crashing", () => {
    render(<UserProfile onLogout={mockLogout} onThemeToggle={mockThemeToggle} theme="light" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("opens popover when user icon button is clicked", () => {
    render(<UserProfile onLogout={mockLogout} onThemeToggle={mockThemeToggle} theme="light" />);
    const iconButton = screen.getByRole("button");
    fireEvent.click(iconButton);

    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("user@email.com")).toBeInTheDocument();
    expect(screen.getByText("Do you want to log out?")).toBeInTheDocument();
  });

  it("calls onLogout and closes on 'Log out' click", () => {
    render(<UserProfile onLogout={mockLogout} onThemeToggle={mockThemeToggle} theme="dark" />);
    const iconButton = screen.getByRole("button");
    fireEvent.click(iconButton);

    const logoutButton = screen.getByText("Log out");
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("closes popover when clicking 'Cancel'", () => {
    render(<UserProfile onLogout={mockLogout} onThemeToggle={mockThemeToggle} theme="dark" />);
    fireEvent.click(screen.getByRole("button")); // open
    fireEvent.click(screen.getByText("Cancel")); // cancel
    expect(screen.queryByText("Do you want to log out?")).not.toBeInTheDocument();
  });

  it("closes popover when clicking outside overlay", () => {
  render(<UserProfile onLogout={mockLogout} onThemeToggle={mockThemeToggle} theme="dark" />);
  fireEvent.click(screen.getByRole("button")); // open popover

  const overlay = screen.getByRole("presentation");
  fireEvent.click(overlay);

  expect(screen.queryByText("Do you want to log out?")).not.toBeInTheDocument();
});

  it("toggles theme when switch is used", () => {
    render(<UserProfile onLogout={mockLogout} onThemeToggle={mockThemeToggle} theme="light" />);
    fireEvent.click(screen.getByRole("button")); // open popover

    const switchInput = screen.getByRole("switch");
    fireEvent.click(switchInput);

    expect(mockThemeToggle).toHaveBeenCalledTimes(1);
  });

  it("renders correct theme label text", () => {
    const { rerender } = render(
      <UserProfile onLogout={mockLogout} onThemeToggle={mockThemeToggle} theme="dark" />
    );

    // Find the user icon button (circle button)
    const openButton = screen.getAllByRole("button")[0];
    fireEvent.click(openButton);

    expect(screen.getByText("Light Theme")).toBeInTheDocument();

    // Re-render with light theme
    rerender(<UserProfile onLogout={mockLogout} onThemeToggle={mockThemeToggle} theme="light" />);
    const openButton2 = screen.getAllByRole("button")[0];
    fireEvent.click(openButton2);

    expect(screen.getByText("Dark Theme")).toBeInTheDocument();
  });
});
