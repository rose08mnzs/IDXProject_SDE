const request = require("supertest");
const app = require("../app");
const pool = require("../config/db");

describe("GET /api/properties", () => {
  afterAll(async () => {
    await pool.end();
  });

  test("returns correct total when minPrice and beds are used together", async () => {
    const minPrice = 300000;
    const beds = 3;

    const [expectedRows] = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM rets_property
      WHERE L_SystemPrice >= ?
        AND L_Keyword2 >= ?
      `,
      [ minPrice, beds]
    );

    const expectedTotal = expectedRows[0].total;

    const res = await request(app)
      .get("/api/properties")
      .query({
        minPrice,
        beds,
        limit: 20,
        offset: 0,
      });

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(expectedTotal);
    expect(Array.isArray(res.body.results)).toBe(true);
  });
});