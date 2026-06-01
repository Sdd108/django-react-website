import { Provider } from "@/components/ui/provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";

/**
 * 为组件测试统一包裹运行时依赖：
 * React Query 缓存、Chakra UI Provider，以及可指定初始路径的 MemoryRouter。
 */
export function createTestWrapper(initialRoute = "/") {
  // 每个测试创建独立 QueryClient，避免缓存数据在测试之间互相污染。
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
