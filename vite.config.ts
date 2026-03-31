import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";
import type { InlineConfig } from "vitest/node";

const includeFile = process.argv[4] as string | undefined;
const testBase: InlineConfig = {
  environment: "jsdom",
  setupFiles: ["tests/setup.ts"],
  testTimeout: 10000,
};
const coverageBase = {
  include: ["src/**/*.{ts,tsx}"],
  exclude: [
    "src/app/layout.tsx",
    "src/**/*.module.css.d.ts",
    "src/**/frourio.{client,server}.ts",
    "src/generated/**",
  ],
};

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test:
    includeFile === undefined
      ? {
          ...testBase,
          coverage: {
            ...coverageBase,
            thresholds: {
              statements: 20,
              branches: 20,
              functions: 20,
              lines: 20,
            },
          },
        }
      : { ...testBase, coverage: coverageBase, include: [includeFile] },
});
