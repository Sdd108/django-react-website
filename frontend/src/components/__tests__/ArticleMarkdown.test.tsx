import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ArticleMarkdown from "../ArticleMarkdown";
import { createTestWrapper } from "../../__tests__/test-utils";

describe("ArticleMarkdown", () => {
  it("renders common Markdown syntax", () => {
    // 覆盖文章详情最常见的 Markdown：标题、列表、链接和行内代码。
    const wrapper = createTestWrapper("/");

    render(
      <ArticleMarkdown
        content={
          "## Markdown Title\n\n- First item\n\nRead [the docs](https://example.com) and use `code`."
        }
      />,
      { wrapper },
    );

    expect(
      screen.getByRole("heading", { name: "Markdown Title", level: 2 }),
    ).toBeInTheDocument();
    expect(screen.getByText("First item")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "the docs" })).toHaveAttribute(
      "href",
      "https://example.com",
    );
    expect(screen.getByText("code")).toBeInTheDocument();
  });
});
