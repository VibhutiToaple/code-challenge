import path from "path";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig({
  plugins: [
    react(),
    createHtmlPlugin({
      template: "public/index.html",
      inject: {
        data: {
          title: "index",
          injectScript: `<script src="./inject.js"></script>`,
        },
      },
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@data": path.resolve(__dirname, "src/data"),
      "@panels": path.resolve(__dirname, "src/panels"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@assets": path.resolve(__dirname, "src/assets"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    testTimeout: 10000, // 10 seconds
    setupFiles: "./setupTests.ts",
    css: true, // allows CSS imports in tests
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}"],
    },
  },
  server: {
    port: 3030, // Specify your desired port
    open: true, // Automatically open the browser
  },
});
