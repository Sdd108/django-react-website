import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "../HomePage";
import { createTestWrapper } from "../../__tests__/test-utils";

describe("HomePage", () => {
  it("renders the hero heading", () => {
    // 首页首屏标题是品牌入口的核心可见文本。
    const wrapper = createTestWrapper("/");
    render(<HomePage />, { wrapper });

    expect(screen.getByText("Welcome to Sruta")).toBeInTheDocument();
  });

  it("renders the hero tagline", () => {
    // 副标题说明站点主题，使用正则避免和换行排版强绑定。
    const wrapper = createTestWrapper("/");
    render(<HomePage />, { wrapper });

    expect(
      screen.getByText(/Exploring the world of web development/),
    ).toBeInTheDocument();
  });

  it("renders the Explore Articles CTA", () => {
    // 主要 CTA 应引导用户进入文章列表。
    const wrapper = createTestWrapper("/");
    render(<HomePage />, { wrapper });

    expect(screen.getByText("Explore Articles")).toBeInTheDocument();
  });

  it("renders the features section heading", () => {
    // 特性区标题用于确认首屏下方内容正常渲染。
    const wrapper = createTestWrapper("/");
    render(<HomePage />, { wrapper });

    expect(screen.getByText("What you'll find here")).toBeInTheDocument();
  });

  it("renders all three feature cards", () => {
    // 三张特性卡片来自数组渲染，这里覆盖完整数据集。
    const wrapper = createTestWrapper("/");
    render(<HomePage />, { wrapper });

    expect(screen.getByText("Latest Articles")).toBeInTheDocument();
    expect(screen.getByText("Expert Insights")).toBeInTheDocument();
    expect(screen.getByText("Best Practices")).toBeInTheDocument();
  });
});
