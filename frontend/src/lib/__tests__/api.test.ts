import { afterEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "../api";
import { useAuthStore } from "@/stores/authStore";

const resetAuthStore = () => {
  // 每个 API 测试都重置认证状态，避免 token 从前一个用例泄漏。
  useAuthStore.getState().clearAuth();
  localStorage.removeItem("auth-storage");
};

describe("apiFetch", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    resetAuthStore();
  });

  it("adds the bearer token when authenticated", async () => {
    // 登录后 apiFetch 应自动追加 Bearer token。
    useAuthStore
      .getState()
      .setAuth(
        { id: 1, username: "sruta", email: "sruta@example.com" },
        "access-token",
        "refresh-token",
      );
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("{}", { status: 200 }));

    await apiFetch("/articles/");

    const headers = fetchMock.mock.calls[0][1]?.headers as Headers;
    expect(headers.get("Authorization")).toBe("Bearer access-token");
  });

  it("clears auth when a 401 cannot be refreshed", async () => {
    // refresh token 不存在时，401 会触发清空登录态。
    useAuthStore.setState({
      user: { id: 1, username: "sruta", email: "sruta@example.com" },
      accessToken: "expired-token",
      refreshToken: null,
      isAuthenticated: true,
    });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("{}", { status: 401 }),
    );

    await apiFetch("/articles/");

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().accessToken).toBeNull();
  });
});
