# WEEK 4 - Property Search Endpoint with Filters & Indexing

## Project structure
- idxproject
  - backend/
      - routes/
          - properties.js
      - helper/
          - helperfunctions.js
      - tests/
          - openhouses.test.js

## Enter Backend Directory
```bash
cd backend
```

## Run Server
```bash
npm run dev
```

## API Endpoints
### Get Property by Listing ID
```http
GET http://localhost:5000/api/properties/{listingId}
```

### Get Open Houses for a Property
```http
GET http://localhost:5000/api/properties/{listingId}/openhouses
```

## Verify Route Order
The open houses route must be registered before the property detail route.
```javascript
router.get("/:id/openhouses", ...);
router.get("/:id", ...);
```

## Request Logging
Every request is logged with:
- HTTP method
- Request URL
- Response status code
- Response time (ms)

Example output:
```text
GET /api/properties/1000291026 200 8ms
GET /api/properties/1000291026/openhouses 200 3ms
GET /api/properties/999999999999 404 2ms
```
## Database Verification
### Verify Property Exists
```sql
SELECT *
FROM rets_property
WHERE L_ListingID = '1000291026';
```

### Verify Open Houses
```sql
SELECT *
FROM rets_openhouse
WHERE L_ListingID = '1000291026'
ORDER BY OpenHouseDate ASC, OH_StartTime ASC;
```

## Tests
### Run all tests
```bash
npm test
```

### Run only the open house tests
```bash
npm test -- tests/openhouses.test.js
```
## Debug Challenge
### Problem
Requests to the Open Houses endpoint occasionally resulted in an unexpected server error when a listing ID triggered an edge case.
Example:
1. Request GET /api/properties/{listingId}/openhouses
2. The property exists, but an unexpected database or query error occurs.
3. Without proper error handling, the exception propagates as an unhandled promise rejection and the request fails unexpectedly.

### Solution
The endpoint was updated to include proper error handling using a `try/catch` block.
Before querying the `rets_openhouse` table, the API now:
- Validates the listing ID.
- Verifies that the property exists in rets_property.
- Returns appropriate HTTP responses (400, 404, or 500) instead of allowing unhandled exceptions.
This ensures that unexpected database or application errors are handled gracefully and do not cause the server to crash.

## Notes
- Added `GET /api/properties/:id` to retrieve a single property by listing ID.
- Added `GET /api/properties/:id/openhouses` to retrieve all open house events for a property.
- Listing IDs are validated before querying the database.
- The property is verified to exist before querying the `rets_openhouse` table.
- Open houses are ordered by `OpenHouseDate` and `OH_StartTime`.
- Added request logging middleware that records the request method, URL, response status, and execution time.
- The `/:id/openhouses` route is registered before `/:id` to ensure Express matches the correct endpoint.
- Error handling was implemented using `try/catch` blocks to prevent unhandled promise rejections and return appropriate HTTP error responses.
- Investigated the debug challenge by testing large batches of listing IDs and reviewing data in both `rets_property` and `rets_openhouse`, including missing listing IDs, null values, invalid JSON, and data inconsistencies. No listing ID was found that consistently reproduced the reported crash.