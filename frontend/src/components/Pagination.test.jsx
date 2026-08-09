import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, test, expect, vi, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import Pagination from "./Pagination";

afterEach(() => {
  cleanup();
});

describe("Pagination", () => {
  test("handles the first page correctly", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={24}
        onPageChange={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", { name: "← Previous", exact: true })
    ).toBeDisabled();

    expect(
      screen.getByRole("button", { name: "Next →", exact: true })
    ).not.toBeDisabled();

    expect(
      screen.getByRole("button", { name: "1", exact: true })
    ).toHaveClass("active");
  });

  test("handles the last page correctly", () => {
    render(
      <Pagination
        currentPage={24}
        totalPages={24}
        onPageChange={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", { name: "Next →", exact: true })
    ).toBeDisabled();

    expect(
      screen.getByRole("button", { name: "← Previous", exact: true })
    ).not.toBeDisabled();

    expect(
      screen.getByRole("button", { name: "24", exact: true })
    ).toHaveClass("active");
  });

  test("handles a middle page correctly", () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={24}
        onPageChange={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", { name: "1", exact: true })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "4", exact: true })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "5", exact: true })
    ).toHaveClass("active");

    expect(
      screen.getByRole("button", { name: "6", exact: true })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "24", exact: true })
    ).toBeInTheDocument();
  });

  test("navigates when a page number is clicked", () => {
    const onPageChange = vi.fn();

    render(
      <Pagination
        currentPage={12}
        totalPages={24}
        onPageChange={onPageChange}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "13", exact: true })
    );

    expect(onPageChange).toHaveBeenCalledWith(13);
  });

  test("renders ellipses correctly without duplicating the last page", () => {
    render(
      <Pagination
        currentPage={21}
        totalPages={24}
        onPageChange={vi.fn()}
      />
    );

    const page24Buttons = screen.getAllByRole("button", {
      name: "24",
      exact: true,
    });

    expect(page24Buttons).toHaveLength(1);

    expect(screen.getAllByText("...")).toHaveLength(2);
  });
});