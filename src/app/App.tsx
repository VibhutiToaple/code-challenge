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
import {
  GRID_COLS,
  GRID_ROWS,
  PANEL_KEY,
  DRAG_ACTIVE,
  FRUITBOOK,
  FRUITVIEW,
  constants,
} from "@utils/constants";

const App = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [dropCell, setDropCell] = useState<{ row: number; col: number } | null>(null);

  const { openPanels, openPanel, closePanel, movePanel, resizePanel, activatePanel } = usePanels();
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
    const key = e.dataTransfer.getData(PANEL_KEY);
    if (!key) return;
    openPanel(key, dropCell, containerSize);
  };

  const onMainDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();

  return (
    <div className={`app-root theme-${theme}`}>
      {navOpen && (
        <nav className="side-nav">
          <ul className="nav-panel-list">
            {panelList.map((panel) => (
              <li
                key={panel.key}
                style={{
                  background: dragNavPanelKey === panel.key ? "#353b4a" : undefined,
                }}
                draggable
                onDragStart={onNavDragStart(panel.key)}
                onDragEnd={onNavDragEnd}
                className={`nav-panel-item ${dragNavPanelKey === panel.key ? DRAG_ACTIVE : ""}`}
                title={panel.title}>
                <span className="nav-panel-icon">
                  {panel.key === FRUITBOOK ? (
                    <TermsIcon />
                  ) : panel.key === FRUITVIEW ? (
                    <FruitViewIcon />
                  ) : (
                    <AboutIcon />
                  )}
                </span>
                <span className="nav-panel-title">{panel.title}</span>
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
              <span className="nav-toggle-icon">
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
            <span className="app-title">{constants.fruteriaName}</span>
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
              {constants.emptyPanelMessage.title} <br /> {constants.emptyPanelMessage.description}
            </div>
          ) : (
            openPanels.map((panel) => (
              <ResizableDraggablePanel
                key={panel.id}
                {...panel}
                onClose={() => closePanel(panel.id)}
                onMove={(dx, dy) => movePanel(panel.id, dx, dy)}
                onResize={(dw, dh) => resizePanel(panel.id, dw, dh)}
                onActivate={() => activatePanel(panel.id)}
              />
            ))
          )}
        </main>
      </MainWorkspace>
    </div>
  );
};

export default App;
