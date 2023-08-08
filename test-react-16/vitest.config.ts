import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    include: ["../src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    environment: "happy-dom",
    coverage: {
      /** @see https://github.com/bcoe/c8#checking-for-full-source-coverage-using---all */
      src: ["../src"],
      all: true,
      reporter: ["text", "lcov"],
    },
  },
});
