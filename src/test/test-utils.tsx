import { render, type RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactElement, ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

interface AllTheProvidersProps {
  children: ReactNode;
  initialRoute?: string;
}

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
}

export function AllTheProviders({
  children,
  initialRoute = "/",
}: AllTheProvidersProps) {
  const queryClient = createTestQueryClient();

  return (
    <MemoryRouter initialEntries={[initialRoute]}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MemoryRouter>
  );
}

export function customRender(
  ui: ReactElement,
  { initialRoute, ...options }: RenderOptions & { initialRoute?: string } = {}
) {
  return render(ui, {
    wrapper: (props) => (
      <AllTheProviders {...props} initialRoute={initialRoute} />
    ),
    ...options,
  });
}

export * from "@testing-library/react";

export * from "vitest";

export { customRender as render };
