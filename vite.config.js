import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? "/world-cup-insight-dashboard/" : "/",
  server: {
    host: "127.0.0.1",
    port: 5174,
    proxy: {
      "/api": "http://127.0.0.1:4174",
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
