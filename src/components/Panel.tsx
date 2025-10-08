import { PanelProps } from "../types/types";

const Panel = ({ title, children }: PanelProps) => (
  <div className="panel-container">
    <div className="panel-title">{title}</div>
    <div>{children}</div>
  </div>
);

export default Panel;
