import { render, screen } from "@testing-library/react";
import Panel from "../../components/Panel";

describe("Panel", () => {
  test("renders title and children correctly", () => {
    render(
      <Panel title="Test Panel">
        <p>Child content</p>
      </Panel>
    );

    expect(screen.getByText("Test Panel")).toBeInTheDocument();
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  test("has correct class names for structure", () => {
    render(
      <Panel title="Styled Panel">
        <span>Example</span>
      </Panel>
    );

    const container = document.querySelector(".panel-container");
    expect(container).toBeInTheDocument();

    const title = document.querySelector(".panel-title");
    expect(title).toBeInTheDocument();
    expect(title?.textContent).toBe("Styled Panel");
  });
});
