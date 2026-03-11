import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/test/setupTests.ts",
      css: true,
      include: ["src/**/*.spec.ts", "src/**/*.test.ts", "src/**/*.spec.tsx", "src/**/*.test.tsx"],
      coverage: {
        reporter: ["text", "html"],
        reportsDirectory: "./coverage"
      }
    },
  })
);