import { useState } from "react";
import { panelsData } from "@data/panelsData";

import ResizableDraggablePanel from "./ResizableDraggablePanel";
import { LayoutMode } from "../types/types";

const GridContainer = () => {
  const [panels, setPanels] = useState(panelsData);
  const [layout, setLayout] = useState<LayoutMode>("horizontal");

  const handleMove = (id: string, dx: number, dy: number) => {
    setPanels((prev) => prev.map((p) => (p.id === id ? { ...p, x: p.x + dx, y: p.y + dy } : p)));
  };

  const handleResize = (id: string, dw: number, dh: number) => {
    setPanels((prev) =>
      prev.map((p) => (p.id === id ? { ...p, width: p.width + dw, height: p.height + dh } : p))
    );
  };

  const handleLayoutChange = (mode: LayoutMode) => {
    const gap = 20;
    let updated = [...panels];

    switch (mode) {
      case "horizontal":
        updated = updated.map((p, i) => ({
          ...p,
          x: i * (p.width + gap),
          y: 0,
        }));
        break;

      case "vertical":
        updated = updated.map((p, i) => ({
          ...p,
          x: 0,
          y: i * (p.height + gap),
        }));
        break;

      case "random":
        updated = updated.map((p) => ({
          ...p,
          x: Math.random() * 500,
          y: Math.random() * 300,
        }));
        break;
    }

    setLayout(mode);
    setPanels(updated);
  };

  return (
    <div
      className="main-container"
      style={{
        position: "relative",
        width: "100%",
        height: "calc(100vh - 80px)",
        overflow: "hidden",
        background: "var(--background-color)",
      }}>
      {/* Layout Switcher */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 20,
          display: "flex",
          gap: "8px",
          zIndex: 1000,
        }}>
        <button onClick={() => handleLayoutChange("horizontal")}>↔️</button>
        <button onClick={() => handleLayoutChange("vertical")}>↕️</button>
        <button onClick={() => handleLayoutChange("random")}>💃</button>
      </div>

      {/* Panels */}
      {panels.map((panel) => (
        <ResizableDraggablePanel
          key={panel.id}
          {...panel}
          onClose={() => setPanels((prev) => prev.filter((p) => p.id !== panel.id))}
          onMove={(dx, dy) => handleMove(panel.id, dx, dy)}
          onResize={(dw, dh) => handleResize(panel.id, dw, dh)}
          content={<div>Content for {panel.title}</div>}
        />
      ))}
    </div>
  );
};

export default GridContainer;
