import "@testing-library/jest-dom";
import { vi } from "vitest";

// Fix Ant Design warnings and jsdom limitations
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock missing PointerEvent APIs (JSDOM doesn’t support them)
if (!window.HTMLElement.prototype.setPointerCapture) {
  window.HTMLElement.prototype.setPointerCapture = vi.fn();
}

if (!window.HTMLElement.prototype.releasePointerCapture) {
  window.HTMLElement.prototype.releasePointerCapture = vi.fn();
}

// Optional: Prevent console errors from unimplemented APIs
vi.spyOn(console, "error").mockImplementation(() => {});
