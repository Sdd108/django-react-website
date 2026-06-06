import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import { createTestWrapper } from "../../__tests__/test-utils";
import { useAuthStore } from "@/stores/authStore";

const resetAuthStore = () => {
  // 清空认证状态，确保重定向测试只受当前用例控制。
  useAuthStore.getState().clearAuth();
  localStorage.removeItem("auth-storage");
};

describe("ProtectedRoute", () => {
  afterEach(() => {
    resetAuthStore();
  });

  it("redirects unauthenticated users to login", async () => {
    // 未登录访问受保护页面时，应跳转到登录页入口。
    const wrapper = createTestWrapper("/private");
    render(
      <Routes>
        <Route
          path="/private"
          element={
            <ProtectedRoute>
              <div>Private Content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>Login Target</div>} />
      </Routes>,
      { wrapper },
    );

    expect(await screen.findByText("Login Target")).toBeInTheDocument();
    expect(screen.queryByText("Private Content")).not.toBeInTheDocument();
  });

  it("renders children for authenticated users", () => {
    // 已登录用户可以直接看到受保护内容。
    useAuthStore
      .getState()
      .setAuth(
        { id: 1, username: "sruta", email: "sruta@example.com" },
        "access-token",
        "refresh-token",
      );
    const wrapper = createTestWrapper("/private");

    render(
      <Routes>
        <Route
          path="/private"
          element={
            <ProtectedRoute>
              <div>Private Content</div>
            </ProtectedRoute>
          }
        />
      </Routes>,
      { wrapper },
    );

    expect(screen.getByText("Private Content")).toBeInTheDocument();
  });
});
