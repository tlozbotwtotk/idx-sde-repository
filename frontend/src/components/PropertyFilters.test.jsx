import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, test, expect, vi, afterEach } from "vitest";
import '@testing-library/jest-dom/vitest';
import PropertyFilters from "./PropertyFilters";

afterEach(() => {
  cleanup();
});

describe("PropertyFilters", () => {
  test("renders all filter inputs", () => {
    render(<PropertyFilters onSearch={() => {}} />);

    expect(screen.getByText("City")).toBeInTheDocument();
    expect(screen.getByText("ZIP Code")).toBeInTheDocument();
    expect(screen.getByText("Min Price")).toBeInTheDocument();
    expect(screen.getByText("Max Price")).toBeInTheDocument();
    expect(screen.getByText("Beds")).toBeInTheDocument();
    expect(screen.getByText("Baths")).toBeInTheDocument();
  });

  test("submits filters correctly", () => {
    const mockSearch = vi.fn();
    const { container } = render(<PropertyFilters onSearch={mockSearch} />);

    const cityInput = container.querySelector('input[name="city"]');
    const minPriceInput = container.querySelector('input[name="minPrice"]');
    const maxPriceInput = container.querySelector('input[name="maxPrice"]');

    fireEvent.change(cityInput, {
      target: { value: "Los Angeles" },
    });

    fireEvent.change(minPriceInput, {
      target: { value: "1000000" },
    });

    fireEvent.change(maxPriceInput, {
      target: { value: "3000000" },
    });

    fireEvent.click(container.querySelector('button[type="submit"]'));

    expect(mockSearch).toHaveBeenCalledWith({
      city: "Los Angeles",
      minPrice: "1000000",
      maxPrice: "3000000",
    });
  });

  test("clears filters and reloads all properties", () => {
    const mockSearch = vi.fn();
    const { container } = render(<PropertyFilters onSearch={mockSearch} />);

    const cityInput = container.querySelector('input[name="city"]');

    fireEvent.change(cityInput, {
      target: { value: "Los Angeles" },
    });

    expect(cityInput.value).toBe("Los Angeles");

    fireEvent.click(container.querySelector('button[type="button"]'));

    expect(cityInput.value).toBe("");
    expect(mockSearch).toHaveBeenCalledWith({});
  });
});