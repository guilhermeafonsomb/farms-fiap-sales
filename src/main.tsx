import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";


if (import.meta.env.VITE_ENV === "dev") {
  const { worker } = await import("./lib/mocks/browser.ts");
  worker.start();
}

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastContainer position="top-center" autoClose={5000} />

      <App />
    </QueryClientProvider>
  </StrictMode>
);
