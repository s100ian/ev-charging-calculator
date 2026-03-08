import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { createPwaPlugin } from "./pwa.config";

// https://vite.dev/config/
const base = "/ev-charging-calculator/";
const buildVersion = new Date().toISOString();

export default defineConfig({
  plugins: [
    react(),
    createPwaPlugin({
      appName: "EV Charging Calculator",
      base,
      publicAssets: [
        "manifest.webmanifest",
        "apple-touch-icon.png",
        "pwa-192.png",
        "pwa-512.png",
        "maskable-icon-512.png",
        "ev-charger-icon-2.png",
      ],
      version: buildVersion,
    }),
  ],
  base,
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["e2e/**", "node_modules/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/main.tsx", "src/vite-env.d.ts", "src/**/*.test.{ts,tsx}", "src/test/**"],
      thresholds: {
        branches: 25,
        functions: 5,
        lines: 15,
        statements: 15,
      },
    },
  },
})
