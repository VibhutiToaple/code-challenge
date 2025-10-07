import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Panel from "../../components/Panel";

describe("<Panel />", () => {
  it("renders the title", () => {
    render(<Panel title="Test Panel">Some content</Panel>);

    const titleElement = screen.getByText("Test Panel");
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveStyle({ fontWeight: "700" });
  });

  it("renders children inside the panel", () => {
    render(
      <Panel title="Fruits">
        <div data-testid="child">Apple</div>
      </Panel>
    );

    const child = screen.getByTestId("child");
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent("Apple");
  });

  it("applies expected styles to container", () => {
    const { container } = render(<Panel title="Styled">Content</Panel>);
    const panelDiv = container.firstChild as HTMLElement;

    expect(panelDiv).toHaveStyle({
      background: "#232b3e",
      borderRadius: "8px",
      color: "#e0e0e0",
    });
  });

  it("renders both title and children correctly together", () => {
    render(<Panel title="Dashboard">Welcome to your workspace</Panel>);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Welcome to your workspace")).toBeInTheDocument();
  });
});
