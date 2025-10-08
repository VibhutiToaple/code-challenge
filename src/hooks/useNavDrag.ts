import { useState, DragEvent } from "react";
import { PANEL_KEY } from "@utils/constants";

export function useNavDrag() {
  const [dragNavPanelKey, setDragNavPanelKey] = useState<string | null>(null);

  const onNavDragStart = (key: string) => (e: DragEvent<HTMLLIElement>) => {
    setDragNavPanelKey(key);
    e.dataTransfer.setData(PANEL_KEY, key);
  };

  const onNavDragEnd = () => setDragNavPanelKey(null);

  return { dragNavPanelKey, onNavDragStart, onNavDragEnd };
}
