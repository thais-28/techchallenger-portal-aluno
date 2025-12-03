import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  target: "es2020",
  outDir: "dist",
  clean: true,
  splitting: false,
  sourcemap: false,
  minify: false,
});
