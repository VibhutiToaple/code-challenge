import React, { ReactNode } from "react";

export interface EnrichmentPanelProps {
  fruit: string;
}

export type LayoutMode = "horizontal" | "vertical" | "random";

interface GridDropOverlayProps {
  rows: number;
  cols: number;
  activeCell: { row: number; col: number } | null;
  visible: boolean;
  theme?: {
    activeColor?: string;
    borderColor?: string;
    inactiveBg?: string;
  };
}

export type LoginComponentProps = {
  onLoginSuccess?: () => void;
};

export interface MainWorkspaceProps {
  children: React.ReactNode;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onGridDropInfo?: (info: {
    cell: { row: number; col: number } | null;
    size: { width: number; height: number };
  }) => void;
  gridRows?: number;
  gridCols?: number;
}

export type PanelProps = {
  title: string;
  children: React.ReactNode;
};

export type ResizableDraggablePanelProps = {
  title: string;
  content: React.ReactNode;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  onClose: () => void;
  onMove: (dx: number, dy: number) => void;
  onResize: (dw: number, dh: number) => void;
};

export type ThemeMode = "light" | "dark";

export interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
}

export interface UserProfileProps {
  onLogout: () => void;
  onThemeToggle?: () => void;
  theme?: "dark" | "light";
}

export interface UserPopoverProps {
  userInfo: { name: string; email: string };
  onLogout: () => void;
  onCancel: () => void;
  onThemeToggle?: () => void;
  theme?: "dark" | "light";
}

export interface ThemeProviderProps {
  children: ReactNode;
}

export type EnrichmentItem = {
  id: string;
  name: string;
  category: string;
  value: number;
};

export type OpenPanel = {
  id: string;
  title: string;
  content: React.ReactNode;
  x: number;
  y: number;
  width: number;
  height: number;
};
