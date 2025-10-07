import { enrichmentData } from "@data/enrichmentData";

import { EnrichmentPanelProps } from "../types/types";

const EnrichmentPanel = ({ fruit }: EnrichmentPanelProps) => {
  return (
    <>
      <strong>{fruit} Enrichment</strong>
      <div style={{ marginTop: 8 }}>{enrichmentData[fruit] || "No enrichment data available."}</div>
    </>
  );
};

export default EnrichmentPanel;
