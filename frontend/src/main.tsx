import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import router from "./routes.tsx";

// React Query 客户端集中管理所有服务端数据缓存，例如文章列表和文章详情。
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* Provider 封装 Chakra UI 主题和颜色模式，Toaster 放在路由外保证全站可用。 */}
      <Provider>
        <RouterProvider router={router} />
        <Toaster />
      </Provider>
    </QueryClientProvider>
  </StrictMode>,
);
