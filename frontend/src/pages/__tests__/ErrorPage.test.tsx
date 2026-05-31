import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { Provider } from "@/components/ui/provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorPage from "../ErrorPage";

function renderErrorPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const router = createMemoryRouter(
    [
      {
        path: "/",
        errorElement: <ErrorPage />,
        children: [{ index: true, element: <div>Home</div> }],
      },
    ],
    { initialEntries: ["/nonexistent"] }
  );

  return render(
    <QueryClientProvider client={queryClient}>
      <Provider>
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>
  );
}

describe("ErrorPage", () => {
  it("renders the 404 error heading", () => {
    renderErrorPage();
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("renders the Go Home button", () => {
    renderErrorPage();
    expect(screen.getByText("Go Home")).toBeInTheDocument();
  });

  it("renders the NavBar", () => {
    renderErrorPage();
    expect(screen.getByText("Sruta")).toBeInTheDocument();
  });
});
