import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, test, expect, vi, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import Pagination from "./Pagination";

afterEach(() => {
  cleanup();
});

describe("Pagination", () => {
  test("first page", () => {
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

  test("last page", () => {
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

  test("middle page", () => {
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

  test("page number click", () => {
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

  test("ellipsis rendering", () => {
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

  test("disabled states", () => {
    const { rerender } = render(
      <Pagination
        currentPage={1}
        totalPages={24}
        onPageChange={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", { name: "← Previous", exact: true })
    ).toBeDisabled();

    rerender(
      <Pagination
        currentPage={24}
        totalPages={24}
        onPageChange={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", { name: "Next →", exact: true })
    ).toBeDisabled();
  });

  test("page number clicks", () => {
    const onPageChange = vi.fn();

    render(
      <Pagination
        currentPage={12}
        totalPages={24}
        onPageChange={onPageChange}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "11", exact: true })
    );

    expect(onPageChange).toHaveBeenCalledWith(11);

    fireEvent.click(
      screen.getByRole("button", { name: "13", exact: true })
    );

    expect(onPageChange).toHaveBeenCalledWith(13);
  });

  test("hidden when 1 page", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={vi.fn()}
      />
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});