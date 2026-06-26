const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const helperfunctions = require("../helper/helperfunctions");

// GET /api/properties/filter-options
router.get("/filter-options", async (req, res) => {
  try {
    const [bedsRows] = await pool.query(`
      SELECT DISTINCT CAST(L_Keyword2 AS UNSIGNED) AS value
      FROM rets_property
      WHERE L_Keyword2 IS NOT NULL
      ORDER BY value ASC
    `);

    const [bathsRows] = await pool.query(`
      SELECT DISTINCT CAST(LM_Dec_3 AS UNSIGNED) AS value
      FROM rets_property
      WHERE LM_Dec_3 IS NOT NULL
      ORDER BY value ASC
    `);

    res.json({
      beds: bedsRows.map((row) => row.value).filter((v) => v !== null),
      baths: bathsRows.map((row) => row.value).filter((v) => v !== null),
    });
  } catch (err) {
    console.error("GET /api/properties/filter-options error:", err);
    res.status(err.status || 500).json({
      error: err.message,
    });
  }
});

// GET /api/properties/:id/openhouses
router.get("/:id/openhouses", async (req, res) => {
  try {
    const { id } = helperfunctions.validateListingId(req.params.id);

    // First verify the property exists
    const [propertyRows] = await pool.query(
      `SELECT id, L_ListingID
       FROM rets_property
       WHERE L_ListingID = ?
       LIMIT 1`,
      [id]
    );

    if (propertyRows.length === 0) {
      return res.status(404).json({ error: `Property with listing id:${id} not found` });
    }

    const [openhouseRows] = await pool.query(
      `SELECT *
       FROM rets_openhouse
       WHERE L_ListingID = ?
       ORDER BY OpenHouseDate , OH_StartTime ASC`,
      [id]
    );

    res.json(openhouseRows);
  } catch (err) {
    console.error("GET /api/properties/:id/openhouses error:", err);
    res.status(err.status || 500).json({
        //error: err.status ? err.message : "Internal Server error"
        error:err.message
      });
    //res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/properties/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = helperfunctions.validateListingId(req.params.id);
    
    const [rows] = await pool.query(
      `SELECT
        id,
        L_ListingID,
        L_DisplayId,
        L_Address,
        L_City,
        L_State,
        L_Zip,
        L_SystemPrice,
        L_Keyword2,
        LM_Dec_3,
        LM_Int2_3,
        L_Photos,
        LMD_MP_Latitude,
        LMD_MP_Longitude,
        L_Remarks,
        YearBuilt,
        LotSizeAcres,
        StandardStatus
      FROM rets_property
      WHERE L_ListingID = ?
      LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: `Property with listing id:${id} not found` });
    }
    res.json(rows[0]);

  } catch (err) {
      console.error("GET /api/properties/:id error:", err);
      res.status(err.status || 500).json({
        //error: err.status ? err.message : "Internal Server error"
        error:err.message
      });
  }
});

// GET /api/properties/:id
router.get("/", async (req, res) => {
  try {
    const {
      city,
      zipcode,
      minPrice,
      maxPrice,
      beds,
      baths,
      limit = "20",
      offset = "0",
    } = req.query;

    //const limitNum = parseInt(limit, 10);
    //const offsetNum = parseInt(offset, 10);
    
    //Validations
    /* if (!Number.isInteger(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ error: "limit must be an integer between 1 and 100" });
    }

    if (!Number.isInteger(offsetNum) || offsetNum < 0) {
      return res.status(400).json({ error: "offset must be an integer 0 or greater" });
    } */
    //Validtions
    const limitNum = helperfunctions.validatePageLimit(limit);
    const offsetNum = helperfunctions.validatePageOffset(offset);
    const conditions = [];
    const values = [];
    
    //Conditions
    const addCondition = (sql, value) => {
      conditions.push(sql);
      values.push(value);
    };
    //CHECK SQL INJECTION
    if (city) {
      addCondition("LOWER(TRIM(L_City)) = LOWER(TRIM(?))", city);
    }
    if (zipcode) {
      addCondition("L_Zip = ?", zipcode.trim());
    }
    if (minPrice !== undefined) {
      if (!helperfunctions.validateNumber(minPrice)) {
        return res.status(400).json({ error: "minPrice must be a number" });
      }
      addCondition("L_SystemPrice >= ?", Number(minPrice));
    }
    if (maxPrice !== undefined) {
      if (!helperfunctions.validateNumber(maxPrice)) {
        return res.status(400).json({ error: "maxPrice must be a number" });
      }
      addCondition("L_SystemPrice <= ?", Number(maxPrice));
    }
    if (beds !== undefined) {
      if (!helperfunctions.validateNumber(beds)) {
        return res.status(400).json({ error: "beds must be a number" });
      }
      addCondition("L_Keyword2 >= ?", Number(beds));
    }
    if (baths !== undefined) {
      if (!helperfunctions.validateNumber(baths)) {
        return res.status(400).json({ error: "baths must be a number" });
      }
      addCondition("LM_Dec_3 >= ?", Number(baths));
    }
    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    
    const countSql = `
      SELECT COUNT(*) AS total
      FROM rets_property
      ${whereClause}
    `;
    const dataSql = `
      SELECT
        id,
        L_ListingID,
        L_DisplayId,
        L_Address,
        L_City,
        L_State,
        L_Zip,
        L_SystemPrice,
        L_Keyword2,
        LM_Dec_3,
        LM_Int2_3,
        L_Photos,
        LMD_MP_Latitude,
        LMD_MP_Longitude,
        L_Remarks,
        YearBuilt,
        LotSizeAcres,
        StandardStatus
      FROM rets_property
      ${whereClause}
      ORDER BY id
      LIMIT ? OFFSET ?
    `;
    const [countRows] = await pool.query(countSql, values);
    const total = countRows[0].total;

    const [results] = await pool.query(dataSql, [...values, limitNum, offsetNum]);
    
    res.json({
      total,
      limit: limitNum,
      offset: offsetNum,
      results,
    });
  } 
  catch (err) {
      console.error("GET /api/properties error:", err);
      res.status(err.status || 500).json({
        //error: err.status ? err.message : "Internal Server error"
        error:err.message
      });
  }
});






module.exports = router;