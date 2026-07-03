# WEEK 7 - Pagination UI & Component Testing

## Project structure
- idxproject
    - frontend/
        - src/ 
            - api
            - components/ 
                - Pagination.jsx
            - pages
            - styles/ 
                - Pagination.css
            - tests/
                - Pagination.test.js

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

## Pagination
A reusable `Pagination` component was added to allow users to navigate through multiple pages of property listings.

### Features
- Previous and Next navigation buttons
- Page number buttons
- Active page highlighting
- Ellipsis (`...`) for large page counts
- Automatically hides when there is only one page

### Pagination Behavior
- Previous is disabled on the first page
- Next is disabled on the last page
- Clicking a page number loads the selected page

### Changing Pages
- Keeps all active filters
- Loads the next set of filtered results
- Scrolls to the top of the page

### Applying New Filters
- Resets pagination back to page 1
- Loads the first page of the new search results

## Unit Testing
Unit tests were implemented using **Jest** and **React Testing Library**.

### Run Pagination tests
```bash
npm test -- src/tests/Pagination.test.js --watchAll=false
```

## Pagination Tests
The following scenarios are tested:
- Previous button is disabled on the first page
- Next button is disabled on the last page
- Clicking a page number changes pages
- Ellipsis renders correctly for large page counts
- Correct page numbers display near the beginning
- Correct page numbers display near the end
- The last page number is not duplicated
- Pagination is hidden when only one page exists

## Debug Challenge
### Problem
The pagination component displayed duplicate page numbers when navigating near the end of a large result set.
Example:
1. Navigate to **Page 48** of a 50-page result set.
2. View the pagination controls.
3. The last page number appears twice (e.g. `1 ... 47 48 49 50 50`).
This happened because the page number generation logic created overlapping page ranges, causing the last page to be added more than once.

### Solution
A component test was written to reproduce the issue by verifying that the last page number appeared only once. The pagination logic was then updated to handle the beginning, middle, and end page ranges separately while preventing overlapping page numbers. This ensures the pagination displays the correct sequence of page numbers and ellipses without duplicates.

## Notes
- Created a reusable `Pagination` component for navigating property listings.
- Added pagination state to `ListingsPage` using `currentPage` and `itemsPerPage`.
- Implemented Previous, Next, page number buttons, and ellipsis for large page counts.
- Preserved active filters when changing pages.
- Reset pagination to the first page whenever new filters are applied.
- Added a results summary displaying the current range of visible properties.
- Automatically scrolls to the top whenever the page changes.
- Hide pagination controls when there is only one page of results.
- Added comprehensive component tests using Jest and React Testing Library.
- Fixed duplicate page numbers by refactoring the page generation logic to eliminate overlapping page ranges.


