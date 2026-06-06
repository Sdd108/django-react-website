import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import LoginPage from "../LoginPage";
import RegisterPage from "../RegisterPage";
import { createTestWrapper } from "../../__tests__/test-utils";
import { useAuthStore } from "@/stores/authStore";

const resetAuthStore = () => {
  // 页面测试之间重置登录态，避免已登录重定向影响表单渲染断言。
  useAuthStore.getState().clearAuth();
  localStorage.removeItem("auth-storage");
};

describe("Auth pages", () => {
  afterEach(() => {
    resetAuthStore();
  });

  it("renders the login form for signed-out users", () => {
    // 登录页应提供用户名和密码字段，供未登录用户进入文章工作区。
    const wrapper = createTestWrapper("/login");

    render(<LoginPage />, { wrapper });

    expect(
      screen.getByRole("heading", { name: "Sign In" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
  });

  it("renders the register form for signed-out users", () => {
    // 注册页应展示账号、邮箱和两次密码输入，覆盖新用户入口。
    const wrapper = createTestWrapper("/register");

    render(<RegisterPage />, { wrapper });

    expect(
      screen.getByRole("heading", { name: "Create Account" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create Account" }),
    ).toBeInTheDocument();
  });
});
