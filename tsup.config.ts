import { defineConfig } from "tsup";
import svgrPlugin from "esbuild-plugin-svgr";

export default defineConfig({
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  esbuildPlugins: [
    svgrPlugin({
      exportType: "named",
    }),
  ],
  esbuildOptions: (options) => {
    options.jsx = "automatic";
  },
});
