High-level purpose

This is a small React + TypeScript single-page app (Vite) that demonstrates an interactive panel-based workspace for exploring “fruit” data.
Main features:

Side navigation with draggable panel items (e.g. Fruit Book, Fruit View, About).

A workspace area with a grid overlay that accepts drops from the nav — dropping opens a panel in a grid cell.

Panels are draggable and resizable UI windows.

Mock backend logic (MockFruitMachine) simulates buying/selling fruit inventory.

The app uses Ant Design for UI themeing and ag-grid for table displays in some panels.

A small login component (mocked) and theme provider (light/dark).

Key files I read (paths relative to repository root):

src/app/App.tsx — top-level application wiring (nav, workspace, panel rendering).

src/components/MainWorkspace.tsx — workspace container + grid drop logic + overlay.

src/components/ResizableDraggablePanel.tsx — draggable & resizable panel implementation.

src/components/GridDropOverlay.tsx — visual grid overlay showing active drop cell.

src/hooks/useNavDrag.ts — drag handlers for the side nav.

src/hooks/useWorkspaceGrid.ts — hook that computes active grid cell from pointer coordinates.

src/hooks/usePanels.ts — handles openPanels state (open/close/move/resize).

src/panels/* — panel content (FruitBook, FruitView, FruitEnrichment, About).

engine/MockFruitMachine.ts — tiny mocked backend (inventory buy/sell).

src/components/LoginComponent.tsx, src/components/ThemeProvider.tsx — auth + theming.

Data & state model

usePanels (src/hooks/usePanels.ts)

Maintains openPanels: OpenPanel[] in React state.

openPanel(key, dropCell, containerSize):

Finds panel definition in panelList.

Computes initial x,y,width,height for the new panel — if a dropCell and containerSize exist it calls getGridCellPosition(...) (from src/utils/grid.ts) to place/size the panel to fit the grid cell.

Adds a new panel object { id, title, content, x, y, width, height } into openPanels.

movePanel(id, dx, dy) updates x,y of a panel.

resizePanel(id, dw, dh) updates width,height of a panel.

closePanel(id) removes the panel.

So the canonical panel state (where they are, how large they are) is held in usePanels and rendered by the app.

Drag & drop from navigation → workspace

Make an item draggable in side nav

useNavDrag (src/hooks/useNavDrag.ts) provides onNavDragStart(key) which sets e.dataTransfer.setData(PANEL_KEY, key). The nav UI uses that to initiate a drag.

Workspace listens to pointer/drag

MainWorkspace uses the useWorkspaceGrid hook.

useWorkspaceGrid (src/hooks/useWorkspaceGrid.ts):

Keeps a workspaceRef and the workspace container size (via ResizeObserver).

Implements handleDragOver(e) which:

Gets the pointer coordinates relative to container,

Computes which grid cell (row/col) the pointer is over using gridRows and gridCols,

Calls onGridChange({ cell, size }) callback (this is wired in App.tsx).

MainWorkspace renders GridDropOverlay and passes activeCell so the overlay highlights the cell under the pointer.

Drop handling

In App.tsx, onMainDrop(e) reads the panel key with e.dataTransfer.getData(PANEL_KEY) and calls openPanel(key, dropCell, containerSize).

openPanel uses getGridCellPosition (utils/grid) to compute x,y,width,height for the chosen grid cell and then pushes a new panel entry into openPanels.

Result: dragging a nav item over the workspace highlights a cell; dropping opens the panel sized/positioned to the cell.

Files involved:

src/hooks/useNavDrag.ts, src/components/MainWorkspace.tsx, src/hooks/useWorkspaceGrid.ts, src/components/GridDropOverlay.tsx, src/hooks/usePanels.ts.

Panels: rendering, dragging, resizing

Rendering

App.tsx maps openPanels from usePanels() into JSX, rendering one ResizableDraggablePanel per entry:

<ResizableDraggablePanel

key={panel.id}

{...panel}

onClose={() => closePanel(panel.id)}

onMove={(dx, dy) => movePanel(panel.id, dx, dy)}

onResize={(dw, dh) => resizePanel(panel.id, dw, dh)}

/>

Each panel receives x, y, width, height and callbacks.

ResizableDraggablePanel (src/components/ResizableDraggablePanel.tsx)

Implements pointer-based dragging and resizing using pointerdown/pointermove/pointerup handlers and pointer capture.

Dragging:

Starts when the header receives pointer down.

Uses getContainerBounds() to prevent dragging outside workspace (panel keeps within container).

When pointer moves, the component computes deltas and calls onMove(dx, dy) so the parent usePanels updates x,y in state.

Resizing:

Bottom-right “resize-handle” starts resize.

On pointer move it computes new width/height and calls onResize(dw, dh) (deltas) so parent updates sizes.

Escape key handling: pressing ESC cancels drag/resize.

The panel element's CSS sets its dimensions / coordinates according to x,y,width,height, so when parent state updates the panel re-renders in its new position/size.

The component also enforces min/max constraints and pointer capture to keep moves smooth.

Important behavior: panels do not store their own position — they inform the parent (via onMove and onResize), and the parent is authoritative.

Visual drop hints — GridDropOverlay (src/components/GridDropOverlay.tsx)

Renders an absolutely-positioned grid overlay (rows × cols).

Highlights the activeCell (row/col) while dragging.

Styled with CSS grid; each cell can have an “active” style when it matches activeCell.

Used to visually communicate where a dropped panel will land.

Panels’ content

src/panels/FruitBookPanel.tsx — shows a table (ag-grid) listing fruits; includes controls and contextual actions.

src/panels/FruitViewPanel.tsx — shows details for a fruit and allows buy/sell via MockFruitMachine.

src/panels/FruitEnrichmentPanel.tsx — shows enrichment details and itself is composed into panels that can be nested.

src/panels/AboutPanel.tsx — static about content.

These are the UI content of panels. They are pure React components and are inserted into the ResizableDraggablePanel as content.

Mock backend/service

engine/MockFruitMachine.ts

A small class with in-memory inventory: getInventory(), buy(fruit, amt), sell(fruit, amt).

Used by FruitViewPanel to simulate business logic without a real server.

Theme & Login

ThemeProvider (src/components/ThemeProvider.tsx)

Uses Ant Design ConfigProvider and a ThemeContext.

Persists theme preference to localStorage.

LoginComponent (src/components/LoginComponent.tsx)

Uses a mockLogin from utils and sets localStorage keys on success.

Root.tsx wraps the app with ThemeProvider and renders either LoginComponent or App depending on isLoggedIn().

Utility functions & constants

src/utils/constants.ts — constants like GRID_ROWS, GRID_COLS, PANEL_KEY, NAV_BAR_HEIGHT.

src/utils/grid.ts — contains getGridCellPosition(row, col, containerWidth, containerHeight, topOffset) which returns an { x, y, width, height } rectangle for the given cell — used to place dropped panels.

src/utils/mockLogin.ts — returns a fake user object to simulate authentication.

Tests

There are Jest + React Testing Library tests under src/__tests__/* covering many components: MainWorkspace, ResizableDraggablePanel, LoginComponent, etc. They assert interactions like drag over behavior, overlay rendering, panel open/close.

Typical runtime sequences (step-by-step)

A. Open a panel by dragging from side nav

User drags a nav item (nav li has draggable and onDragStart set via useNavDrag).

Workspace receives dragover events; useWorkspaceGrid.handleDragOver computes activeCell.

GridDropOverlay highlights activeCell.

On drop, App.onMainDrop reads the dragged key and calls openPanel(key, dropCell, containerSize).

usePanels.openPanel computes x,y,width,height from getGridCellPosition and adds a panel to openPanels.

React renders that new ResizableDraggablePanel at the computed x,y,size.

B. Move a panel

User presses the panel header (pointer down) — ResizableDraggablePanel starts pointer capture.

Pointer moves trigger onMove(dx,dy) callbacks in the panel, which call usePanels.movePanel to update x,y.

Parent state update triggers re-render and the panel visually moves.

C. Resize a panel

User drags resize handle.

ResizableDraggablePanel computes dw,dh and calls onResize with deltas.

Parent usePanels.resizePanel updates width,height, re-render shows new size.

Where the important behaviors live (quick map)

Open/close/move/resize panels: src/hooks/usePanels.ts

Compute grid cell from pointer: src/hooks/useWorkspaceGrid.ts

Drag source for nav: src/hooks/useNavDrag.ts

Visual overlay: src/components/GridDropOverlay.tsx

Panel UI and interactions: src/components/ResizableDraggablePanel.tsx

Wire everything together (nav + workspace + panels): src/app/App.tsx

Mock engine: engine/MockFruitMachine.ts

Theming/auth: src/components/ThemeProvider.tsx, src/components/LoginComponent.tsx

Notes, assumptions & small observations

The app uses the parent-driven state model for panels: the panel component emits deltas and the parent stores absolute positions/sizes. This is simpler for persisting or serializing layout.

The grid overlay system uses the computed container dimensions and divides them by gridRows and gridCols to compute each cell rectangle. That’s how drop placement sizes the panel to the cell.

The mock engine is intentionally simple and synchronous — great for demo/test purposes.

There are several tests which indicate the author focused on testable interactions (drag, overlay, opening/closing).

If you’d like I can now:

Walk through any specific file line-by-line (e.g., ResizableDraggablePanel.tsx) and annotate what each block does.

Draw a small diagram of the event flow (nav → workspace → openPanel → usePanels).

Produce a short README-style “developer guide” (how to run, where to change the grid size, how to add a new panel).

Or implement the “horizontal/vertical/cha-cha” layout upgrade we discussed earlier, but integrated cleanly into this repo so layout doesn’t break (I can provide a PR-style patch).

Which of those would you like next?