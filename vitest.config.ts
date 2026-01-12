import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: true,
    env: {
      VITE_APPWRITE_ENDPOINT: "https://nyc.cloud.appwrite.io/v1",
      VITE_APPWRITE_PROJECT_ID: "68d01da500316c3af9cd",
      VITE_APPWRITE_DATABASE_ID: "68d021ad002fe84e49fb",
      VITE_APPWRITE_COLLECTION_PRODUCTS: "produtos",
      VITE_APPWRITE_COLLECTION_STOCK: "estoque",
    },
    exclude: ["**/node_modules/**", "**/dist/**", "**/lib/**", "**/e2e/**"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/test/**",
        "src/**/*.d.ts",
        "src/test/**",
        "node_modules/",
        "src/lib/**",
        "App.tsx",
        "main.tsx",
        "src/model",
        "src/hooks",
      ],
    },
  },
});
