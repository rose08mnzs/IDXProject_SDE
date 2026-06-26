# WEEK 6 - Filters UI + Introduction to Testing

## Project structure
- idxproject
    - frontend/
        - src/ 
            - api/ 
                - client.js 
            - components/ 
                - NoResultsMessage.jsx
                - PropertyFilters.jsx
            - pages/ 
                - ListingsPage.jsx 
            - styles/ 
                - NoResultsMessage.css
                - PropertyFilters.css
            - tests/
                - client.test.js
                - PropertyFilters.test.js

## Enter and Run frontend
```bash
cd frontend
npm start
```

## Enter and Run Backend 
```bash
cd backend
npm run dev
```

## Property Filters
A reusable `PropertyFilters` component was added to allow users to search properties using multiple criteria.

### Available Filters
- City
- ZIP Code
- Minimum Price
- Maximum Price
- Bedrooms
- Bathrooms

### Search
The Search button submits the selected filters and requests matching properties from:
```http
GET /api/properties
```

Example:
```http
GET /api/properties?city=Los%20Angeles&maxPrice=200000&beds=3
```

## Dynamic Dropdown Values
The Bedrooms and Bathrooms dropdowns are populated dynamically instead of using hardcoded values.
A new backend endpoint retrieves the distinct values from the database:
```http
GET /api/properties/filter-options
```
The dropdown values are loaded once when the page initializes and reused throughout the session.

## Clear Filters
Clicking **Clear Filters**:
- Resets every filter back to its default value
- Sends a new request without any filter parameters
- Reloads the complete property list

## Resuable Components
- NoResultsMessage

## Unit Testing
Unit tests were implemented using **Jest** and **React Testing Library**.

### Run all tests
```bash
npm test -- --watchAll=false
```

### Run all tests in `test` folder
```bash
npm test -- --testPathPattern=src/tests --watchAll=false
```

### Run API client tests
```bash
npm test -- src/tests/client.test.js --watchAll=false
```

### Run Property Filters tests
```bash
npm test -- src/tests/PropertyFilters.test.js --watchAll=false
```

## API Client Tests
The following scenarios are tested:
- Only non-empty filter values are sent to the API
- Property details are retrieved successfully
- API errors throw meaningful error messages

## Property Filters Tests
The following scenarios are tested:
- All six filter inputs are rendered
- Clicking **Search** triggers the search handler
- Clicking **Clear Filters** triggers the clear handler

## Mocking
`fetch()` is mocked during testing to:
- Avoid making real HTTP requests
- Simulate successful API responses
- Simulate server errors
- Keep tests fast, predictable, and independent of the backend

## Debug Challenge
### Problem
A race condition occurred when multiple searches were performed quickly.
Example:
1. Search for **City = Los Angeles**
2. Click **Clear Filters**
3. Search for another city
The first request could finish after the second request, causing stale results to briefly appear before being replaced.

### Solution
A request ID check was implemented.
Each search request receives a unique identifier, and only the most recent request is allowed to update the component state.
This prevents stale API responses from overwriting newer search results.

## Notes
- Built a reusable `PropertyFilters` component using controlled React inputs.
- Added support for filtering by city, ZIP code, minimum price, maximum price, bedrooms, and bathrooms.
- Empty filter values are automatically removed before sending requests to the backend.
- Implemented a reusable `NoResultsMessage` component for searches with no matching properties.
- Populated the Bedrooms and Bathrooms dropdowns dynamically by retrieving the distinct values from the database.
- Loaded dropdown values once when the page initializes to avoid unnecessary API requests.
- Added unit tests for both the API client and the `PropertyFilters` component using Jest and React Testing Library.
- Mocked `fetch()` to simulate successful responses and server errors without requiring a running backend.
- Fixed an asynchronous race condition by ensuring only the latest search request is allowed to update the UI, preventing stale search results from briefly appearing.


