import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { Provider } from "@/components/ui/provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorPage from "../ErrorPage";

function renderErrorPage() {
  // 每次渲染错误页都创建独立 QueryClient，避免测试之间共享缓存。
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  // 通过访问不存在的路径触发 react-router 的 errorElement。
  const router = createMemoryRouter(
    [
      {
        path: "/",
        errorElement: <ErrorPage />,
        children: [{ index: true, element: <div>Home</div> }],
      },
    ],
    { initialEntries: ["/nonexistent"] },
  );

  return render(
    <QueryClientProvider client={queryClient}>
      <Provider>
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>,
  );
}

describe("ErrorPage", () => {
  it("renders the 404 error heading", () => {
    // 未匹配路径应该展示 404，而不是通用 Error。
    renderErrorPage();
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("renders the Go Home button", () => {
    // 错误页必须提供返回首页的恢复路径。
    renderErrorPage();
    expect(screen.getByText("Go Home")).toBeInTheDocument();
  });

  it("renders the NavBar", () => {
    // 即使路由异常，也保留全站导航，避免用户被困在错误页。
    renderErrorPage();
    expect(screen.getByText("Sruta")).toBeInTheDocument();
  });
});
