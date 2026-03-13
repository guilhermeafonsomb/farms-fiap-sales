import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { withZephyr } from "vite-plugin-zephyr";
import { federation } from "@module-federation/vite";
import path from "path";

const mfConfig = {
  name: "sales-app",
  filename: "remoteEntry.js",
  exposes: {
    "./FarmsFiapSales": "./src/App.tsx",
  },
  shared: {
    react: { singleton: true, requiredVersion: "^19.0.0" },
    "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
    "react-router-dom": { singleton: true },
    "@tanstack/react-query": { singleton: true },
    "react-toastify": { singleton: true },
  },
  dts: false,
};

export default defineConfig({
  plugins: [
    react(),
    process.env.SKIP_ZEPHYR === "true"
      ? federation(mfConfig)
      : withZephyr({ mfConfig }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    needsInterop: ["react", "@tanstack/react-query", "react-toastify"],
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
    assetsDir: "sales-assets",
  },
  server: {
    port: 5003,
  },
  preview: {
    port: 5003,
  },
});
