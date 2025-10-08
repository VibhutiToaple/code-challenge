import { useState, DragEvent } from "react";
import { panelList } from "@components/panelList";
import TermsIcon from "@assets/Icons/TermsIcon";
import AboutIcon from "@assets/Icons/AboutIcon";
import FruitViewIcon from "@assets/Icons/FruitViewIcon";
import ResizableDraggablePanel from "@components/ResizableDraggablePanel";
import { MainWorkspace } from "@components/MainWorkspace";
import UserProfile from "@components/UserProfile";
import { usePanels } from "@hooks/usePanels";
import { useTheme } from "@hooks/useTheme";
import { useInactivityLogout } from "@hooks/useInactivityLogout";
import { useNavDrag } from "@hooks/useNavDrag";
import { GRID_COLS, GRID_ROWS } from "@utils/constants";

const App = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [dropCell, setDropCell] = useState<{ row: number; col: number } | null>(null);

  const { openPanels, openPanel, closePanel, movePanel, resizePanel } = usePanels();
  const { theme, toggleTheme } = useTheme();
  const { dragNavPanelKey, onNavDragStart, onNavDragEnd } = useNavDrag();

  useInactivityLogout();

  const handleGridDropInfo = (info: {
    cell: { row: number; col: number } | null;
    size: { width: number; height: number };
  }) => {
    setDropCell(info.cell);
    setContainerSize(info.size);
  };

  const onMainDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const key = e.dataTransfer.getData("panelKey");
    if (!key) return;
    openPanel(key, dropCell, containerSize);
  };

  const onMainDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();

  return (
    <div className={`app-root theme-${theme}`} style={{ display: "flex" }}>
      {navOpen && (
        <nav
          style={{
            width: 90, // Increased width
            background: "#232b3e",
            padding: "0.5rem 0.25rem",
            borderRight: "1px solid #3e4a6b",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: 90, // Increased minWidth
            boxSizing: "border-box",
          }}>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}>
            {panelList.map((panel) => (
              <li
                key={panel.key}
                style={{
                  marginBottom: 16,
                  cursor: "grab",
                  fontWeight: "normal",
                  background: dragNavPanelKey === panel.key ? "#353b4a" : undefined,
                  padding: 8,
                  borderRadius: 10,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  color: "#e0e0e0",
                  width: "100%",
                  transition: "background 0.2s",
                  textAlign: "center", // Center text
                  minHeight: 64,
                }}
                draggable
                onDragStart={onNavDragStart(panel.key)}
                onDragEnd={onNavDragEnd}
                className={dragNavPanelKey === panel.key ? "drag-active" : ""}
                title={panel.title}>
                <span style={{ marginBottom: 4 }}>
                  {panel.key === "fruitbook" ? (
                    <TermsIcon />
                  ) : panel.key === "fruitview" ? (
                    <FruitViewIcon />
                  ) : (
                    <AboutIcon />
                  )}
                </span>
                <span
                  style={{
                    width: "100%",
                    textAlign: "center", // Center text
                    fontSize: 13,
                    fontWeight: 500,
                    lineHeight: 1.2,
                    wordBreak: "break-word",
                  }}>
                  {panel.title}
                </span>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <MainWorkspace
        onDrop={onMainDrop}
        onDragOver={onMainDragOver}
        onGridDropInfo={handleGridDropInfo}
        gridRows={GRID_ROWS}
        gridCols={GRID_COLS}>
        <main className="main-workspace">
          {/* Top Nav */}
          <header className="app-header">
            <button
              className="nav-toggle-button"
              style={{
                boxShadow: navOpen ? "0 2px 8px #0002" : undefined,
              }}
              onClick={() => setNavOpen((v) => !v)}>
              <span style={{ display: "inline-block", width: 28, height: 28 }}>
                {navOpen ? (
                  // X icon
                  <svg width="28" height="28" viewBox="0 0 28 28">
                    <line
                      x1="7"
                      y1="7"
                      x2="21"
                      y2="21"
                      stroke="#fff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <line
                      x1="21"
                      y1="7"
                      x2="7"
                      y2="21"
                      stroke="#fff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  // Hamburger icon
                  <svg width="28" height="28" viewBox="0 0 28 28">
                    <rect y="6" width="28" height="3" rx="1.5" fill="#fff" />
                    <rect y="13" width="28" height="3" rx="1.5" fill="#fff" />
                    <rect y="20" width="28" height="3" rx="1.5" fill="#fff" />
                  </svg>
                )}
              </span>
            </button>
            <span className="app-title">fruteria</span>
            <div style={{ flex: 1 }} />
            <UserProfile
              onLogout={() => {
                localStorage.removeItem("isLoggedIn");
                window.dispatchEvent(new Event("login-success"));
              }}
              onThemeToggle={toggleTheme}
              theme={theme}
            />
          </header>

          {openPanels.length === 0 ? (
            <div className="empty-panel-message">
              No panels open. <br /> Drag one from the navigation bar.
            </div>
          ) : (
            openPanels.map((panel) => (
              <ResizableDraggablePanel
                key={panel.id}
                {...panel}
                onClose={() => closePanel(panel.id)}
                onMove={(dx, dy) => movePanel(panel.id, dx, dy)}
                onResize={(dw, dh) => resizePanel(panel.id, dw, dh)}
              />
            ))
          )}
        </main>
      </MainWorkspace>
    </div>
  );
};

export default App;
