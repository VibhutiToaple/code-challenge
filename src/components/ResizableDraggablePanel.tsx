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
        position: "absolute",
        left: x,
        top: y,
        width: Math.max(width, minWidth),
        height: Math.max(height, minHeight),
        background: "var(--panel-bg, #fff)",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        userSelect: "none",
        overflow: "hidden",
        transition: isDragging || isResizing ? "none" : "transform 0.15s ease",
        outline: "none",
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
      <div
        className="panel-header"
        onPointerDown={handlePointerDown}
        style={{
          cursor: "grab",
          background: "var(--panel-header-bg, #f5f5f5)",
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
        <span>{title}</span>
        <button
          onClick={onClose}
          aria-label="Close panel"
          style={{
            border: "none",
            background: "transparent",
            fontSize: "16px",
            cursor: "pointer",
          }}>
          ✕
        </button>
      </div>

      {/* CONTENT */}
      <div className="panel-content" style={{ padding: "12px" }}>
        {content}
      </div>

      {/* RESIZE HANDLE */}
      <div
        className="resize-handle"
        onPointerDown={handleResizeDown}
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: "14px",
          height: "14px",
          cursor: "nwse-resize",
          background: "transparent",
        }}
      />
    </div>
  );
};

export default memo(ResizableDraggablePanel);
