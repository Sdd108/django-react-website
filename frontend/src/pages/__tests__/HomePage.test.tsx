import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "../HomePage";
import { createTestWrapper } from "../../__tests__/test-utils";

describe("HomePage", () => {
  it("renders the hero heading", () => {
    const wrapper = createTestWrapper("/");
    render(<HomePage />, { wrapper });

    expect(screen.getByText("Welcome to Sruta")).toBeInTheDocument();
  });

  it("renders the hero tagline", () => {
    const wrapper = createTestWrapper("/");
    render(<HomePage />, { wrapper });

    expect(
      screen.getByText(/Exploring the world of web development/)
    ).toBeInTheDocument();
  });

  it("renders the Explore Articles CTA", () => {
    const wrapper = createTestWrapper("/");
    render(<HomePage />, { wrapper });

    expect(screen.getByText("Explore Articles")).toBeInTheDocument();
  });

  it("renders the features section heading", () => {
    const wrapper = createTestWrapper("/");
    render(<HomePage />, { wrapper });

    expect(screen.getByText("What you'll find here")).toBeInTheDocument();
  });

  it("renders all three feature cards", () => {
    const wrapper = createTestWrapper("/");
    render(<HomePage />, { wrapper });

    expect(screen.getByText("Latest Articles")).toBeInTheDocument();
    expect(screen.getByText("Expert Insights")).toBeInTheDocument();
    expect(screen.getByText("Best Practices")).toBeInTheDocument();
  });
});
