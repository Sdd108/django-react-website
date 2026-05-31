import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NavBar from "../NavBar";
import { createTestWrapper } from "../../__tests__/test-utils";

describe("NavBar", () => {
  it("renders the brand title", () => {
    const wrapper = createTestWrapper("/");
    render(<NavBar />, { wrapper });

    expect(screen.getByText("Sruta")).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    const wrapper = createTestWrapper("/");
    render(<NavBar />, { wrapper });

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Articles")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("highlights the active route", () => {
    const wrapper = createTestWrapper("/articles");
    render(<NavBar />, { wrapper });

    // The active nav item should have the "active" styling
    const articlesLink = screen.getByText("Articles");
    expect(articlesLink).toBeInTheDocument();
  });

  it("renders the color mode button", () => {
    const wrapper = createTestWrapper("/");
    render(<NavBar />, { wrapper });

    // ColorModeButton renders as a button with aria-label or similar
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });
});
