import { useState } from "react";
import { panelList } from "@components/panelList";
import { getGridCellPosition } from "@utils/grid";
import { NAV_BAR_HEIGHT } from "@utils/constants";

import { OpenPanel } from "../types/types";

export function usePanels() {
  const [openPanels, setOpenPanels] = useState<OpenPanel[]>([]);

  const openPanel = (
    key: string,
    dropCell: { row: number; col: number } | null,
    containerSize: { width: number; height: number }
  ) => {
    const panelDef = panelList.find((p) => p.key === key);
    if (!panelDef) return;

    const id = `${key}-${Date.now()}`;
    let x = 60,
      y = NAV_BAR_HEIGHT + 10,
      width = 700,
      height = 420;

    if (dropCell && containerSize.width && containerSize.height) {
      const availableHeight = containerSize.height - NAV_BAR_HEIGHT;
      const pos = getGridCellPosition(
        dropCell.row,
        dropCell.col,
        containerSize.width,
        availableHeight,
        NAV_BAR_HEIGHT
      );
      width = Math.min(pos.width, containerSize.width);
      height = Math.min(pos.height, availableHeight);
      x = pos.x;
      y = pos.y;
    }

    setOpenPanels((prev) => [
      ...prev,
      { id, title: panelDef.title, content: panelDef.content, x, y, width, height },
    ]);
  };

  const closePanel = (id: string) => {
    setOpenPanels((prev) => prev.filter((p) => p.id !== id));
  };

  const movePanel = (id: string, dx: number, dy: number) => {
    setOpenPanels((prev) =>
      prev.map((p) => (p.id === id ? { ...p, x: p.x + dx, y: p.y + dy } : p))
    );
  };

  const resizePanel = (id: string, dw: number, dh: number) => {
    setOpenPanels((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, width: Math.max(200, p.width + dw), height: Math.max(100, p.height + dh) }
          : p
      )
    );
  };

  const activatePanel = (id: string) => {
    setOpenPanels((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx === -1) return prev;
      // move selected panel to the end of the array (rendered on top)
      const panel = prev[idx];
      const others = prev.filter((p) => p.id !== id);
      return [...others, panel];
    });
  };

  return { openPanels, openPanel, closePanel, movePanel, resizePanel, activatePanel };
}
