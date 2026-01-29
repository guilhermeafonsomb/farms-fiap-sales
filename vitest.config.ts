import { defineConfig } from "vitest/config";
import { loadEnv} from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, `${process.cwd()}`);
  return {
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
        VITE_APPWRITE_ENDPOINT: env.VITE_APPWRITE_ENDPOINT,
        VITE_APPWRITE_PROJECT_ID: env.VITE_APPWRITE_PROJECT_ID,
        VITE_APPWRITE_DATABASE_ID: env.VITE_APPWRITE_DATABASE_ID,
        VITE_APPWRITE_COLLECTION_PRODUCTS: env.VITE_APPWRITE_COLLECTION_PRODUCTS,
        VITE_APPWRITE_COLLECTION_STOCK: env.VITE_APPWRITE_COLLECTION_STOCK,
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
  }
});
