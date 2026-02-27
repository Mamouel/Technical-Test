import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import path from "node:path";

export default defineConfig({
  plugins: [vue(), svgLoader()],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "app"),
      "~": path.resolve(process.cwd(), "app"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/api/setup.ts"],
  },
});
