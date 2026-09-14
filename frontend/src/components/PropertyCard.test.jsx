import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, test, expect, vi, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import PropertyCard from "./PropertyCard";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../PropertyImageCarousel", () => ({
  default: () => <div data-testid="mock-carousel">Carousel</div>,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("PropertyCard", () => {
  const sampleProperty = {
    L_ListingID: "PROP123",
    L_SystemPrice: 500000,
    L_Address: "123 Main St",
    L_City: "Portland",
    L_State: "OR",
    L_Keyword2: 3,
    LM_Dec_3: 2,
    LM_Int2_3: 1500,
    L_Photos: [],
  };

  test("renders property data", () => {
    render(
      <PropertyCard
        property={sampleProperty}
        isFavorite={() => false}
        onToggleFavorite={vi.fn()}
      />
    );

    expect(screen.getByText("$500,000")).toBeInTheDocument();
    expect(screen.getByText("123 Main St")).toBeInTheDocument();
    expect(screen.getByText("Portland, OR")).toBeInTheDocument();
    expect(screen.getByText("3 beds")).toBeInTheDocument();
    expect(screen.getByText("2 baths")).toBeInTheDocument();
    expect(screen.getByText("1,500 sqft")).toBeInTheDocument();
  });

  test("clicking navigates to detail page", () => {
    render(
      <PropertyCard
        property={sampleProperty}
        isFavorite={() => false}
        onToggleFavorite={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText("123 Main St"));

    expect(mockNavigate).toHaveBeenCalledWith("/property/PROP123");
  });

  test("renders correct heart state based on isFavorite prop", () => {
    const { rerender } = render(
      <PropertyCard
        property={sampleProperty}
        isFavorite={(id) => id === "PROP123"}
        onToggleFavorite={vi.fn()}
      />
    );

    const favoriteButton = screen.getByRole("button", { name: /save to favorites/i });
    expect(favoriteButton).toHaveTextContent("❤️");

    rerender(
      <PropertyCard
        property={sampleProperty}
        isFavorite={() => false}
        onToggleFavorite={vi.fn()}
      />
    );

    expect(favoriteButton).toHaveTextContent("🤍");
  });

  test("triggers onToggleFavorite and stops propagation when heart is clicked", () => {
    const handleToggleFavorite = vi.fn();
    render(
      <PropertyCard
        property={sampleProperty}
        isFavorite={() => false}
        onToggleFavorite={handleToggleFavorite}
      />
    );

    const favoriteButton = screen.getByRole("button", { name: /save to favorites/i });
    fireEvent.click(favoriteButton);

    expect(handleToggleFavorite).toHaveBeenCalledTimes(1);
    expect(handleToggleFavorite).toHaveBeenCalledWith(sampleProperty);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});