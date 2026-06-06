import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ArticlesPage from "../ArticlesPage";
import { createTestWrapper } from "../../__tests__/test-utils";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

vi.mock("@/lib/api", () => ({
  apiFetch: vi.fn(),
}));

const article = {
  id: 1,
  title: "Visible Article",
  content: "This is **rendered** in the article list.",
  author: "Sruta",
  author_user: "sruta",
  published_date: "2026-06-01T12:00:00+08:00",
  source_url: "",
  is_published: true,
  is_pinned: false,
  created_at: "2026-06-01T12:00:00+08:00",
  updated_at: "2026-06-01T12:30:00+08:00",
  last_updated: "2026-06-01T12:30:00+08:00",
};

const mockApiFetch = vi.mocked(apiFetch);

const resetAuthStore = () => {
  // 清理持久化登录态，确保列表页只测试当前用例设置的认证分支。
  useAuthStore.getState().clearAuth();
  localStorage.removeItem("auth-storage");
};

describe("ArticlesPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
    resetAuthStore();
  });

  it("renders articles from a paginated API response", async () => {
    // 覆盖 Django REST Framework 当前的分页响应结构。
    mockApiFetch.mockResolvedValue(
      new Response(
        JSON.stringify({
          count: 1,
          next: null,
          previous: null,
          results: [article],
        }),
        { status: 200 },
      ),
    );

    render(<ArticlesPage />, { wrapper: createTestWrapper("/articles") });

    expect(await screen.findByText("Visible Article")).toBeInTheDocument();
    expect(
      screen.getByText("This is rendered in the article list."),
    ).toBeInTheDocument();
  });

  it("renders articles from a plain array response", async () => {
    // 兼容分页关闭或接口桩直接返回数组时的文章展示。
    mockApiFetch.mockResolvedValue(
      new Response(JSON.stringify([article]), { status: 200 }),
    );

    render(<ArticlesPage />, { wrapper: createTestWrapper("/articles") });

    expect(await screen.findByText("Visible Article")).toBeInTheDocument();
  });

  it("shows the error state for malformed article responses", async () => {
    // 响应结构异常时应进入错误态，而不是静默显示空列表。
    mockApiFetch.mockResolvedValue(
      new Response(JSON.stringify({ results: null }), { status: 200 }),
    );

    render(<ArticlesPage />, { wrapper: createTestWrapper("/articles") });

    await waitFor(() => {
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });
  });
});
