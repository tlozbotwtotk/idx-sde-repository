import { describe, test, expect, beforeEach, vi } from "vitest";
import { fetchProperties, fetchPropertyDetail, fetchOpenHouses } from "./client";

vi.stubGlobal("fetch", vi.fn());

describe("API Client", () => {
  beforeEach(() => {
    vi.mocked(fetch).mockClear();
  });

  describe("fetchProperties", () => {
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

      vi.mocked(fetch).mockResolvedValueOnce({
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
      // Suppress expected console.error output to prevent noisy stderr logs during intentional failure tests
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      await expect(fetchProperties()).rejects.toThrow(
        "HTTP 500: Internal Server Error"
      );

      consoleSpy.mockRestore();
    });

    test("builds query string with multiple filters", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
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

      const calledUrl = vi.mocked(fetch).mock.calls[0][0];

      expect(calledUrl).toContain("city=Los+Angeles");
      expect(calledUrl).toContain("minPrice=1000000");
      expect(calledUrl).toContain("maxPrice=3000000");
    });
  });

  describe("fetchPropertyDetail", () => {
    test("fetches single property detail successfully", async () => {
      const mockProperty = { L_ListingID: "123" };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProperty,
      });

      const data = await fetchPropertyDetail("123");

      expect(fetch).toHaveBeenCalledWith("/api/properties/123");
      expect(data).toEqual(mockProperty);
    });

    test("throws 'Property not found' when status is 404", async () => {
      // Suppress expected console.error output to prevent noisy stderr logs during intentional failure tests
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(fetchPropertyDetail("999")).rejects.toThrow(
        "Property not found"
      );

      consoleSpy.mockRestore();
    });

    test("throws generic HTTP error when status is not 404", async () => {
      // Suppress expected console.error output to prevent noisy stderr logs during intentional failure tests
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      await expect(fetchPropertyDetail("123")).rejects.toThrow(
        "HTTP 500: Internal Server Error"
      );

      consoleSpy.mockRestore();
    });
  });

  describe("fetchOpenHouses", () => {
    test("fetches open houses successfully", async () => {
      const mockOpenHouses = [{ id: 1, time: "2:00 PM" }];

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockOpenHouses,
      });

      const data = await fetchOpenHouses("123");

      expect(fetch).toHaveBeenCalledWith("/api/properties/123/openhouses");
      expect(data).toEqual(mockOpenHouses);
    });

    test("throws error when open houses request fails", async () => {
      // Suppress expected console.error output to prevent noisy stderr logs during intentional failure tests
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      await expect(fetchOpenHouses("123")).rejects.toThrow(
        "HTTP 500: Internal Server Error"
      );

      consoleSpy.mockRestore();
    });
  });
});