import { Provider } from "@/components/ui/provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";

/**
 * Wraps a component in the providers needed for testing:
 * QueryClient, Chakra UI, and MemoryRouter.
 */
export function createTestWrapper(initialRoute = "/") {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return function TestWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <Provider>
          <MemoryRouter initialEntries={[initialRoute]}>
            {children}
          </MemoryRouter>
        </Provider>
      </QueryClientProvider>
    );
  };
}
