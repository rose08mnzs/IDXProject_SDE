import { fetchProperties, fetchPropertyDetail } from "../api/client";

describe("api client", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("fetchProperties sends only non-empty params", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ total: 1, results: [{ id: 1 }] }),
    });

    const data = await fetchProperties({
      city: "Austin",
      zipcode: "78701",
      minPrice: "",
      maxPrice: null,
      beds: "3",
      baths: undefined,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/properties?city=Austin&zipcode=78701&beds=3",
      {}
    );
    expect(data.total).toBe(1);
  });

  test("fetchPropertyDetail returns a property", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id: 12, L_ListingID: "ABC123" }),
    });

    const data = await fetchPropertyDetail("ABC123");

    expect(global.fetch).toHaveBeenCalledWith("/api/properties/ABC123", {});
    expect(data.L_ListingID).toBe("ABC123");
  });

  test("request throws an error message when response is not ok", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({ error: "Database failed" }),
    });

    await expect(fetchProperties()).rejects.toThrow("Database failed");
  });
});