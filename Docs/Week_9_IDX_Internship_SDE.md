# WEEK 9 - Advanced Feature (Required) + Performance Optimization

## Project structure
- idxproject
  - backend/
    - routes/
      - properties.js
  - frontend/
    - src/
      - api
      - components/
        - PropertyCard.jsx
        - PropertyFilters.jsx
        - ErrorBoundary.jsx
      - hooks/
        - useFavorites.js
      - pages/
        - ListingsPage.jsx
        - FavoritesPage.jsx
      - styles/
        - PropertyCard.css
        - PropertyFilter.css
        - ListingsPage.css
      - utility
      - App.js
      - index.js

## Enter and Run Frontend
```bash
cd frontend
npm start
```

## Enter and Run Backend
```bash
cd backend
npm run dev
```

## Advanced Feature: Sorting + Favorites
Option 3 (Sorting + Favorites) was implemented.

### Sorting
Sorting functionality was added to the listings page.

#### Features
- Sort by Price
- Sort by Date Listed
- Sort by Square Ft
- Sort by Beds
- Supports ascending and descending order
- Sort persists across pagination
- Sort resets when filters are changed
- Backend validates `sortBy` against a whitelist of SQL column names
- Invalid sort fields return a **400 Bad Request**

## Favorites
A `FavoritesPage` was implemented using a custom React hook.

### Features
- Heart button added to every Property Card
- Heart click uses `stopPropagation()` to prevent card navigation
- Favorites stored in browser `localStorage`
- Favorites persist after page refresh
- Dedicated Favorites page
- Favorites count displayed in the favorites button
- Clear Favorites button
- Filled / outlined heart state
- Empty state message appears when no favorites are saved

## Custom Hook
A reusable `useFavorites` hook was created.

### Features
- Read favorites from `localStorage`
- Save favorites to `localStorage`
- Manage favorites state
- Expose helper functions:
  - `toggleFavorite()`
  - `isFavorite()`
  - `favoritesCount`
  - `clearFavorites()`
This keeps all persistence logic inside the hook rather than inside UI components.

## Error Boundary
A reusable React `ErrorBoundary` was added to catch render errors and show a recovery UI.

### Features
- Catches render-time errors in child components
- Displays the existing `ErrorMessage` component
- Prevents the entire application from crashing

## Performance Optimization
### EXPLAIN Analysis
The most complex filter query was tested with `EXPLAIN`.

#### Before Optimization
- Full table scan (`type = ALL`)
- No indexes used
- ~35,402 rows scanned
- Filesort performed

#### After Optimization
- Composite indexes were added for common filter combinations
Indexes added:
- `idx_city_price`
- `idx_zip_price`
- `idx_city_beds`
- `idx_city_baths`
- `idx_city_price_beds`

#### Results
- Query type improved from **ALL** to **range**
- MySQL selected the composite index `idx_city_price_beds`
- Estimated rows scanned reduced from **35,402** to **1,872**
- Approximately **94.7% fewer rows scanned**
- Index Condition Pushdown used


## Request Logging Middleware
The request logging middleware was enhanced.

### Features
- HTTP Method
- Request URL
- Status Code
- Response time (milliseconds)

Example Log
```bash
GET /api/properties?limit=20&offset=0 304 8ms
```

## Console Warnings
The React app was reviewed for console warnings.

### Result
- No application-level React warnings were found.
- Remaining deprecation warnings originate from the Create React App / Webpack development tooling rather than the application code.

## Debug Notes
### Sorting Debug Check
Verified that sorting by all parameters returns results in the correct order by comparing the API output with SQL queries sorted by tht parameters.

### Favorites Debug Check
Confirmed that:
- The heart button does not navigate away from the card
- Favorite state remains after page refresh
- Favorites are removed immediately when unfavorited

### Performance Debug Check
Compared EXPLAIN output before and after adding indexes to confirm reduced row scanning and improved filtering efficiency.

## Notes
- Added sorting controls to the listings page.
- Implemented backend sorting validation.
- Added sorting persistence across pagination.
- Added Favorites page.
- Implemented custom `useFavorites` hook.
- Stored favorites using `localStorage`.
- Added heart button to every property card.
- Prevented favorite clicks from triggering card navigation.
- Added favorites counter.
- Added Clear Favorites functionality.
- Added React Error Boundary.
- Added request timing middleware.
- Used `EXPLAIN` to analyze query performance.
- Added composite indexes to improve filtering performance.
- Reduced estimated rows scanned by approximately **94.7%** after indexing.
- Verified there are no application-level React console warnings.