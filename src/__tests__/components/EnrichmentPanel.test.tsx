import { render, screen } from "@testing-library/react";
import EnrichmentPanel from "@components/EnrichmentPanel";

describe("EnrichmentPanel", () => {
  it("renders enrichment info for a fruit", () => {
    render(<EnrichmentPanel fruit="Apple" />);
    expect(screen.getByText(/Apple Enrichment/i)).toBeInTheDocument();
  });

  it("shows fallback when no enrichment data exists", () => {
    render(<EnrichmentPanel fruit="UnknownFruit" />);
    expect(screen.getByText(/No enrichment data available/i)).toBeInTheDocument();
  });
});
