import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "sales-app",
      filename: "remoteEntry.js",
      exposes: {
        "./FarmsFiapSales": "./src/App.tsx",
      },
      shared: [
        "react",
        "react-dom",
        "tailwindcss",
        "postcss",
        "autoprefixer",
        "react-router-dom",
        "@tanstack/react-query",
      ],
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
    assetsDir: "assets",
  },
  server: {
    port: 5003,
  },
});
