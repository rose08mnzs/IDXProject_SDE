const request = require("supertest");
const app = require("../app");
const pool = require("../config/db");


jest.setTimeout(30000000);
describe("Debug open houses endpoint", () => {
  //afterAll(async () => {
  //  await pool.end();
  //});

  test("finds the listing ID that crashes /api/properties/:id/openhouses", async () => {
    //Test passes 6924
    // const [rows] = await pool.query(`
    //   SELECT DISTINCT p.L_ListingID
    //   FROM rets_property p
    //   join rets_openhouse o on p.L_ListingID = o.L_ListingID
    //   ORDER BY p.L_ListingID ASC
    // `);
    
    //10000 - 45206
    // const [rows] = await pool.query(`
    //   SELECT DISTINCT p.L_ListingID
    //   FROM rets_property p
    //   LEFT JOIN rets_openhouse o ON p.L_ListingID = o.L_ListingID
    //   WHERE o.L_ListingID IS NULL
    //   ORDER BY p.L_ListingID
    //   LIMIT 10000 OFFSET 10000;
    // `);
    //52130
    const [rows] = await pool.query(`
      SELECT DISTINCT p.L_ListingID
      FROM rets_property p
      ORDER BY p.L_ListingID
      LIMIT 10000 OFFSET 0;
    `);

    const badIds = [];
    let ids=0;
    console.log("count of rows:", rows.length);
    for (const row of rows) {
      const id = row.L_ListingID;
      const res = await request(app).get(`/api/properties/${id}/openhouses`);
      ids++;
        if (res.status != 200) {
          console.log("Potential failing ID:", id, "status:", res.status);
        //  console.log("Body:", res.body);
         //  new Error(`Open houses endpoint failed for listing ID ${id}`);
          badIds.push({
            id,
            status: res.status,
            body: res.body,
          });
          break;
        }
        
        //expect(res.status).toBe(200);
      }
        console.log("ids parsed :", ids);
        console.log("badIds length :", badIds.length);
        expect(badIds).toEqual([]);
       // expect(badIds.length).toBe(0);
    
  });
});