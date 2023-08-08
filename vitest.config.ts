import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

const alias: Record<string, string> = {};

if (process.env.REACT === "16") {
  alias["react"] = require.resolve("react-16");
  alias["react-dom"] = require.resolve("react-dom-16");
}

if (process.env.REACT === "17") {
  alias["react"] = require.resolve("react-17");
  alias["react-dom"] = require.resolve("react-dom-17");
}

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    coverage: {
      /** @see https://github.com/bcoe/c8#checking-for-full-source-coverage-using---all */
      src: ["./src"],
      all: true,
      reporter: ["text", "lcov"],
    },
    alias,
  },
});
