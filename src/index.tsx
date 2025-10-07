import "antd/dist/reset.css";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@components/ThemeProvider";

import Root from "./app/Root";

/**
 * Application entry point.
 *
 * - Initializes the React root container.
 * - Wraps the application with the ThemeProvider for light/dark mode handling.
 * - Mounts the main Root component into the DOM.
 *
 * @throws {Error} If the root container element is missing in index.html.
 */
const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container missing in index.html");
}

/**
 * Renders the application root with theming context.
 */
const root = createRoot(container);
root.render(
  <ThemeProvider>
    <Root />
  </ThemeProvider>
);
