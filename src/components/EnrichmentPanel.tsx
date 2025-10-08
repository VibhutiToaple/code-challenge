import { enrichmentData } from "@data/enrichmentData";
import { constants } from "@utils/constants";

import { EnrichmentPanelProps } from "../types/types";

const EnrichmentPanel = ({ fruit }: EnrichmentPanelProps) => {
  return (
    <>
      <strong>
        {fruit} {constants.enrichmentData.title}
      </strong>
      <div style={{ marginTop: 8 }}>{enrichmentData[fruit] || constants.enrichmentData.noData}</div>
    </>
  );
};

export default EnrichmentPanel;
