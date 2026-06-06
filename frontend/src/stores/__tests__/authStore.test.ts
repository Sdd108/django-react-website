import { afterEach, describe, expect, it } from "vitest";
import { useAuthStore } from "../authStore";

const resetAuthStore = () => {
  // 清理持久化状态，保证每个 store 测试都从未登录状态开始。
  useAuthStore.getState().clearAuth();
  localStorage.removeItem("auth-storage");
};

describe("authStore", () => {
  afterEach(() => {
    resetAuthStore();
  });

  it("setAuth stores user and tokens", () => {
    useAuthStore
      .getState()
      .setAuth(
        { id: 1, username: "sruta", email: "sruta@example.com" },
        "access-token",
        "refresh-token",
      );

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.username).toBe("sruta");
    expect(state.accessToken).toBe("access-token");
    expect(state.refreshToken).toBe("refresh-token");
  });

  it("clearAuth removes user and tokens", () => {
    useAuthStore
      .getState()
      .setAuth(
        { id: 1, username: "sruta", email: "sruta@example.com" },
        "access-token",
        "refresh-token",
      );

    useAuthStore.getState().clearAuth();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
  });
});
