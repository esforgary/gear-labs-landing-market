import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const pathFromHere = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  root: pathFromHere("./static-app"),
  base: "./",
  publicDir: pathFromHere("./public"),
  plugins: [react()],
  resolve: { alias: { "@": pathFromHere("./") } },
  build: {
    outDir: pathFromHere("../../public/imported/market-analysis"),
    emptyOutDir: true,
  },
});
