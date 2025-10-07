import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AboutPanel from "../../panels/AboutPanel"; // ✅ adjust if your alias differs

describe("<AboutPanel />", () => {
  it("renders without crashing", () => {
    const { container } = render(<AboutPanel />);
    expect(container).toBeInTheDocument();
  });

  it("displays the correct heading", () => {
    render(<AboutPanel />);
    const heading = screen.getByRole("heading", { level: 2, name: /about/i });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveStyle({ color: "#000", fontSize: "22px" });
  });

  it("renders welcome message and app name", () => {
    render(<AboutPanel />);
    expect(screen.getByText(/welcome to/i)).toBeInTheDocument();
    expect(screen.getByText(/fruteria/i)).toBeInTheDocument();
    expect(screen.getByText(/playful trading app for fruit/i)).toBeInTheDocument();
  });

  it("contains fun closing note with banana and heart emojis", () => {
    render(<AboutPanel />);
    const closingNote = screen.getByText(/made with/i);
    expect(closingNote.textContent).toContain("🍌");
    expect(closingNote.textContent).toContain("❤️");
  });
});
