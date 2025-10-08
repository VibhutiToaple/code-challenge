// src/__tests__/panels/AboutPanel.test.tsx
import { render, screen } from "@testing-library/react";
import AboutPanel from "../../panels/AboutPanel";

describe("AboutPanel", () => {
  test("renders title and content correctly", () => {
    render(<AboutPanel />);

    // ✅ Check heading
    expect(screen.getByRole("heading", { name: /about/i })).toBeInTheDocument();

    // ✅ Use a substring that exists fully within textContent
    expect(screen.getByText(/welcome to/i)).toBeInTheDocument();
    expect(screen.getByText(/playful trading app for fruit/i)).toBeInTheDocument();

    // ✅ Check emoji and closing text
    expect(screen.getByText(/Made with/i)).toBeInTheDocument();
  });

  test("has correct structure and class names", () => {
    render(<AboutPanel />);
    const container = document.querySelector(".about-panel-container");
    expect(container).toBeInTheDocument();

    const title = screen.getByRole("heading", { name: /about/i });
    expect(title).toHaveClass("about-panel-title");
  });
});
