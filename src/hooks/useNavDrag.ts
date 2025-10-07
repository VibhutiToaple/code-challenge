import { useState, DragEvent } from "react";

export function useNavDrag() {
  const [dragNavPanelKey, setDragNavPanelKey] = useState<string | null>(null);

  const onNavDragStart = (key: string) => (e: DragEvent<HTMLLIElement>) => {
    setDragNavPanelKey(key);
    e.dataTransfer.setData("panelKey", key);
  };

  const onNavDragEnd = () => setDragNavPanelKey(null);

  return { dragNavPanelKey, onNavDragStart, onNavDragEnd };
}
