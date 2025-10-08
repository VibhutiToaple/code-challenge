import { useRef, useCallback, useState, useEffect, memo, PointerEvent } from "react";

import { ResizableDraggablePanelProps } from "../types/types";

/**
 * A draggable and resizable panel component.
 * - Supports mouse and touch via pointer events.
 * - Prevents overflow beyond parent container.
 * - Provides min/max resize boundaries.
 *
 * @param {ResizableDraggablePanelProps} props
 */
const ResizableDraggablePanel = ({
  title,
  content,
  x,
  y,
  width,
  height,
  minWidth = 150,
  minHeight = 100,
  onClose,
  onMove,
  onResize,
}: ResizableDraggablePanelProps) => {
  const dragOrigin = useRef<{ x: number; y: number } | null>(null);
  const resizeOrigin = useRef<{
    x: number;
    y: number;
    w: number;
    h: number;
    maxW: number;
    maxH: number;
  } | null>(null);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setDragging] = useState(false);
  const [isResizing, setResizing] = useState(false);

  /** Helper: get container bounds safely */
  const getContainerBounds = useCallback(() => {
    const parent = panelRef.current?.closest(".main-container") as HTMLElement | null;
    return parent?.getBoundingClientRect();
  }, []);

  /** === DRAG LOGIC === */
  const handlePointerDown = useCallback((e: PointerEvent) => {
    e.stopPropagation();
    dragOrigin.current = { x: e.clientX, y: e.clientY };
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging || !dragOrigin.current) return;

      const bounds = getContainerBounds();
      if (!bounds) return;

      const dx = e.clientX - dragOrigin.current.x;
      const dy = e.clientY - dragOrigin.current.y;

      const newX = Math.max(0, Math.min(x + dx, bounds.width - width));
      const newY = Math.max(0, Math.min(y + dy, bounds.height - height));

      onMove(newX - x, newY - y);
      dragOrigin.current = { x: e.clientX, y: e.clientY };
    },
    [isDragging, onMove, x, y, width, height, getContainerBounds]
  );

  const handlePointerUp = useCallback((e: PointerEvent) => {
    setDragging(false);
    dragOrigin.current = null;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  /** === RESIZE LOGIC === */
  const handleResizeDown = useCallback(
    (e: PointerEvent) => {
      e.stopPropagation();
      const bounds = getContainerBounds();
      if (!bounds) return;

      resizeOrigin.current = {
        x: e.clientX,
        y: e.clientY,
        w: width,
        h: height,
        maxW: bounds.width - x,
        maxH: bounds.height - y,
      };

      setResizing(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [width, height, x, y, getContainerBounds]
  );

  const handleResizeMove = useCallback(
    (e: PointerEvent) => {
      if (!isResizing || !resizeOrigin.current) return;

      const { x: startX, y: startY, w, h, maxW, maxH } = resizeOrigin.current;
      const dw = e.clientX - startX;
      const dh = e.clientY - startY;

      const newWidth = Math.min(Math.max(w + dw, minWidth), maxW);
      const newHeight = Math.min(Math.max(h + dh, minHeight), maxH);

      onResize(newWidth - width, newHeight - height);
    },
    [isResizing, onResize, minWidth, minHeight, width, height]
  );

  const handleResizeUp = useCallback((e: PointerEvent) => {
    setResizing(false);
    resizeOrigin.current = null;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  /** Optional: Escape key closes panel */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDragging && !isResizing) {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDragging, isResizing, onClose]);

  return (
    <div
      ref={panelRef}
      className={`panel ${isDragging ? "dragging" : ""}`}
      role="dialog"
      aria-label={title}
      tabIndex={0}
      style={{
        left: x,
        top: y,
        width: Math.max(width, minWidth),
        height: Math.max(height, minHeight),
        transition: isDragging || isResizing ? "none" : "transform 0.15s ease",
      }}
      onPointerMove={(e) => {
        handlePointerMove(e);
        handleResizeMove(e);
      }}
      onPointerUp={(e) => {
        handlePointerUp(e);
        handleResizeUp(e);
      }}>
      {/* HEADER */}
      <div className="panel-header" onPointerDown={handlePointerDown}>
        <span>{title}</span>
        <button className="panel-close-button" onClick={onClose} aria-label="Close panel">
          ✕
        </button>
      </div>

      {/* CONTENT */}
      <div className="panel-content">{content}</div>

      {/* RESIZE HANDLE */}
      <div className="resize-handle" onPointerDown={handleResizeDown}>
        <svg width="18" height="18">
          <polyline points="3,15 15,15 15,3" fill="none" stroke="#7c5fe6" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
};

export default memo(ResizableDraggablePanel);
