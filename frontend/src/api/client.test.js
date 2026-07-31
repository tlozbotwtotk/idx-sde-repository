import { describe, test, expect, beforeEach, vi } from "vitest";
import { fetchProperties } from "./client";

global.fetch = vi.fn();

describe("fetchProperties", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test("fetches properties successfully", async () => {
    const mockData = {
      total: 1,
      results: [
        {
          L_ListingID: "123",
          L_City: "Los Angeles",
          L_SystemPrice: 1500000,
        },
      ],
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const data = await fetchProperties({
      city: "Los Angeles",
      minPrice: 1000000,
      maxPrice: 3000000,
    });

    expect(fetch).toHaveBeenCalledWith(
      "/api/properties?city=Los+Angeles&minPrice=1000000&maxPrice=3000000"
    );

    expect(data).toEqual(mockData);
  });


  test("throws error when API request fails", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(fetchProperties()).rejects.toThrow(
      "HTTP 500: Internal Server Error"
    );
  });


  test("builds query string with multiple filters", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [],
      }),
    });

    await fetchProperties({
      city: "Los Angeles",
      minPrice: 1000000,
      maxPrice: 3000000,
    });

    const calledUrl = fetch.mock.calls[0][0];

    expect(calledUrl).toContain("city=Los+Angeles");
    expect(calledUrl).toContain("minPrice=1000000");
    expect(calledUrl).toContain("maxPrice=3000000");
  });
});