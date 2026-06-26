# Useful SQL Queries
## Show databases
```sql
SHOW DATABASES;
```

## Show tables
```sql
SHOW TABLES;
```
## Switch to the rets database
```sql
USE rets;
```

## Disable strict SQL mode for the current session
```sql
SET SESSION sql_mode = '';
```

## Count Properties
```sql
SELECT COUNT(*)
FROM rets_property;
```

## Count Open Houses
```sql
SELECT COUNT(*)
FROM rets_openhouse;
```

## View the first 10 property records
```sql
SELECT * FROM rets_property
ORDER BY id
LIMIT 10;
```

## View a specific property by Listing ID
```sql
SELECT *
FROM rets_property
WHERE L_ListingID = '<ListingID>';
```

## Display row numbers with property IDs
```sql
SELECT
    ROW_NUMBER() OVER (ORDER BY id) AS row_num,
    id,
    L_ListingID
FROM rets_property
LIMIT 30;
```

## Check query execution plan for city, ZIP, and price search
```sql
EXPLAIN
SELECT *
FROM rets_property
WHERE L_City = 'Temecula'
  AND L_Zip = '97201'
  AND L_SystemPrice >= 300000;
```

## Create a composite index to speed up searches by city, price, and beds
```sql
CREATE INDEX idx_city_price_beds
ON rets_property (L_City, L_SystemPrice, L_Keyword2);
```

## Display all indexes on the property table
```sql
SHOW INDEXES FROM rets_property;
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

## View Cities
```sql
SELECT L_City, COUNT(*)
FROM rets_property
GROUP BY L_City
ORDER BY COUNT(*) DESC;
```

## Find Properties Without Open Houses
```sql
SELECT p.L_ListingID
FROM rets_property p
LEFT JOIN rets_openhouse o
    ON p.L_ListingID = o.L_ListingID
WHERE o.L_ListingID IS NULL;
```

## Find Open Houses Without Matching Properties
```sql
SELECT o.L_ListingID
FROM rets_openhouse o
LEFT JOIN rets_property p
    ON o.L_ListingID = p.L_ListingID
WHERE p.L_ListingID IS NULL;
```

## Find listings that have multiple open house records
```sql
SELECT
    L_ListingID,
    COUNT(*) AS openhouse_count
FROM rets_openhouse
GROUP BY L_ListingID
HAVING COUNT(*) > 1
ORDER BY openhouse_count DESC;
```

## Find open houses with invalid or missing JSON data
```sql
SELECT L_ListingID
FROM rets_openhouse
WHERE all_data IS NULL
OR all_data = ''
OR JSON_VALID(all_data) = 0;
```

## Find open houses with missing or invalid date/time values
```sql
SELECT
    L_ListingID,
    OpenHouseDate,
    OH_StartTime,
    OH_EndTime,
    OH_StartDate,
    OH_EndDate
FROM rets_openhouse
WHERE OpenHouseDate IS NULL
   OR OH_StartTime IS NULL
   OR OH_EndTime IS NULL
   OR OH_StartTime >= OH_EndTime
   OR OH_StartDate > OH_EndDate;
```

## Verify Photo Data - View sample photo data
```sql
SELECT
    L_ListingID,
    L_Photos
FROM rets_property
LIMIT 10;
```

## Summarize the quality of photo data stored in L_Photos
```sql
SELECT
    CASE
        WHEN L_Photos IS NULL THEN 'NULL'
        WHEN L_Photos = '' THEN 'EMPTY STRING'
        WHEN JSON_VALID(L_Photos) = 0 THEN 'INVALID JSON'
        WHEN JSON_LENGTH(L_Photos) = 0 THEN 'EMPTY ARRAY'
        ELSE 'VALID ARRAY'
    END AS photo_type,
    COUNT(*) AS count
FROM rets_property
GROUP BY photo_type;
```

## View first media entry
```sql
SELECT
    id,
    L_ListingID,
    L_Address,
    JSON_UNQUOTE(JSON_EXTRACT(L_Photos, '$[0]')) AS first_item
FROM rets_property;
```

## Find invalid or missing photo data
```sql
SELECT
    L_ListingID,
    L_Photos
FROM rets_property
WHERE L_Photos IS NULL
   OR L_Photos = ''
   OR JSON_VALID(L_Photos) = 0;
```