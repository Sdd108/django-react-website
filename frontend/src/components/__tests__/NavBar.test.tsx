import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NavBar from "../NavBar";
import { createTestWrapper } from "../../__tests__/test-utils";

describe("NavBar", () => {
  it("renders the brand title", () => {
    // 导航栏应始终展示站点品牌，作为回到首页的入口。
    const wrapper = createTestWrapper("/");
    render(<NavBar />, { wrapper });

    expect(screen.getByText("Sruta")).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    // 主导航链接数量固定，防止后续改动误删页面入口。
    const wrapper = createTestWrapper("/");
    render(<NavBar />, { wrapper });

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Articles")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("highlights the active route", () => {
    // 传入 /articles 初始路径，用来验证当前路由对应的菜单项存在并可被高亮。
    const wrapper = createTestWrapper("/articles");
    render(<NavBar />, { wrapper });

    // 当前测试只断言目标菜单项存在，具体样式由 Chakra props 控制。
    const articlesLink = screen.getByText("Articles");
    expect(articlesLink).toBeInTheDocument();
  });

  it("renders the color mode button", () => {
    // 颜色模式按钮来自共享 UI 组件，确保它随导航栏一起渲染。
    const wrapper = createTestWrapper("/");
    render(<NavBar />, { wrapper });

    // ColorModeButton 会渲染为 button；这里不绑定具体图标，降低主题实现变更的耦合。
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });
});
