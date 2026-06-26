# WEEK 3 - Property Search Endpoint with Filters & Indexing

## Project structure
- idxproject
  - backend/
      - routes/
          - properties.js
      - helper/
          - helperfunctions.js
      - tests/
          - properties.test.js

## Enter Backend Directory
```bash
cd backend
```

## Run Server
```bash
npm run dev
```

## API Endpoints
### Get All Properties
```http
GET http://localhost:5000/api/properties
```

### Pagination
```http
GET http://localhost:5000/api/properties?limit=10&offset=20
```

### Filter by City
```http
GET http://localhost:5000/api/properties?city=Temecula
```

### Multiple Filters
```http
GET http://localhost:5000/api/properties?city=Temecula&minPrice=300000&beds=3
```

### Invalid Price
```http
GET http://localhost:5000/api/properties?minPrice=abc
```

### Invalid Limit
```http
GET http://localhost:5000/api/properties?limit=0
```
```http
GET http://localhost:5000/api/properties?limit=200
```

## View Existing Indexes
```sql
SHOW INDEXES FROM rets_property;
```

## Create Database Indexes
### Existing Indexes
```sql
CREATE INDEX idx_L_ListingID
ON rets_property (L_ListingID);

CREATE INDEX idx_L_City
ON rets_property (L_City);

CREATE INDEX idx_L_Zip
ON rets_property (L_Zip);

CREATE INDEX idx_L_DisplayId
ON rets_property (L_DisplayId);

CREATE INDEX idx_rets_property_type
ON rets_property (L_Type_);
```

### Composite Indexes
```sql
CREATE INDEX idx_city_price
ON rets_property (L_City, L_SystemPrice);

CREATE INDEX idx_zip_price
ON rets_property (L_Zip, L_SystemPrice);

CREATE INDEX idx_city_beds
ON rets_property (L_City, L_Keyword2);

CREATE INDEX idx_city_baths
ON rets_property (L_City, LM_Dec_3);

CREATE INDEX idx_city_price_beds
ON rets_property (L_City, L_SystemPrice, L_Keyword2);
```

## Shows Indexes used for Query
```sql
EXPLAIN 
SELECT *
FROM rets_property
WHERE L_City = 'Temecula'
  AND L_SystemPrice >= 300000
  AND L_Keyword2 >= 3;
```
## Measure Query Performance
```sql
EXPLAIN ANALYZE
SELECT *
FROM rets_property
WHERE L_City = 'Temecula'
  AND L_SystemPrice >= 300000
  AND L_Keyword2 >= 3;
```

## Tests
### Run all tests
```bash
npm test
```

### Run only the properties tests
```bash
npm test -- tests/properties.test.js
```

## Debug Challenge
### Problem
A subtle bug occurred in the `/api/properties` filter endpoint when `minPrice` and `beds` were used together.
Example:
1. Search for `minPrice=300000`
2. Add `beds=3`
3. The result count did not match the expected database count
This happened because the SQL conditions and the parameter values were not always kept in the same order, causing the wrong values to be bound to the `?` placeholders.

### Solution
A helper function was used to add each SQL condition and its matching value at the same time.
Each filter now calls:
- `conditions.push(...)`
- `values.push(...)`
in the same step, which keeps the parameter order consistent.
This ensures that `minPrice` and `beds` are applied to the correct columns and the API returns the correct result count.

## Notes

- All filter values use parameterized queries (`?`) to prevent SQL injection.
- Dynamic SQL conditions are built using helper functions to keep parameter order consistent.
- Composite indexes were created for the most common filter combinations rather than every possible combination to balance query performance with storage and maintenance overhead.
- Query performance was evaluated using `EXPLAIN ANALYZE` before and after creating the composite indexes.
- Unit tests were written using **Jest** and **Supertest** to verify the property filtering endpoint.
