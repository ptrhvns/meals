import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    legalComments: "inline",
  },
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
      },
    },
  },
  test: {
    coverage: {
      all: true,
      exclude: [
        "lib/types.ts",
        "src/main.tsx",
        "src/tests",
        "src/vite-env.d.ts",
      ],
      include: ["src/**/*.ts", "src/**/*.tsx"],
      provider: "istanbul",
      reporter: ["text"],
    },
    environment: "jsdom",
    globals: true,
    setupFiles: ["src/tests/setup.ts"],
  },
});
