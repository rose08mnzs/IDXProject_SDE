# WEEK 5 - React Setup & Listings Page

## Project structure
- idxproject
    - backend
    - frontend/
        - src/ 
            - api/ 
                - client.js 
            - components/ 
                - PropertyCard.jsx 
                - LoadingSpinner.jsx 
                - ErrorMessage.jsx 
            - pages/ 
                - ListingsPage.jsx 
            - styles/ 
                - App.css 
                - PropertyCard.css 
                - ListingsPage.css 
                - LoadingSpinner.css 
                - ErrorMessage.css 
            - utils/ 
                - photos.js 
            - App.js 
            - index.js 
        - .gitignore
        - package.json

## Create React frontend
```bash
npx create-react-app frontend
```

## Enter and Run frontend
```bash
cd frontend
npm start
```

## Configure Proxy in package.json
```json
"proxy": "http://localhost:5000"
```

## Enter and Run Backend Directory
```bash
cd backend
npm run dev
```

## React application runs on
[http://localhost:3000](http://localhost:3000)

## API Client
All API requests are handled through: `src/api/client.js`
### Available functions
```text
fetchProperties(params) 
fetchPropertyDetail(id)
```
The API client:
- Checks response.ok
- Parses JSON responses
- Throws meaningful error messages
- Falls back to the HTTP status code when no backend message is returned

## Listings Page
The listings page fetches properties from :
```http
GET http://localhost:5000/api/properties
```

Property information displayed:
- First property photo
- Address
- City and State
- Number of bedrooms
- Number of bathrooms
- Square footage
- Listing price

## Resuable Components
- Loading State
- Error Message

## Defensive Photo Parsing
Property photos are parsed using `src/utils/photos.js`

The helper safely handles:
- Valid JSON arrays
- Null values
- Empty arrays
- Invalid JSON
- Non-image media (such as PDF documents)
- Missing photo URLs
If no valid image is found, a placeholder image or message is displayed.

## Verify Photo Data - View sample photo data
```sql
SELECT
    L_ListingID,
    L_Photos
FROM rets_property
LIMIT 10;
```

## View first media entry
```sql
SELECT
    L_ListingID,
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

## Debug Challenge
### Problem
Some property cards displayed broken images in the `PropertyCard` component.
Example:
1. Load the listings page
2. Some properties show a blank image or broken image icon
3. Other properties display normally
This happened because `L_Photos` was not always a clean JSON array of image URLs. In some records, the first item was null, an empty value, or a non-image file such as a PDF document instead of a photo URL.

### Solution
A defensive photo parsing helper was implemented.
The code safely parses `L_Photos` with `try/catch`, checks whether the parsed value is an array, and searches for the first valid photo URL instead of blindly using the first array element. If no valid image is found, the card displays a placeholder image or message instead of crashing.
This prevents broken images and ensures all property cards render correctly even when the photo data is missing, invalid, or contains non-image media

## Notes
- Created a React frontend using Create React App.
- Configured a development proxy to forward `/api/*` requests to the Express backend.
- Implemented an API client module to centralize all HTTP requests.
- Built a responsive `ListingsPage` that displays property cards in a grid layout.
- Created reusable `LoadingSpinner` and `ErrorMessage` components for loading and error states.
- Designed a modern property card displaying the property's first photo, address, location, bedrooms, bathrooms, square footage, and listing price.
- Added a hover effect to each property card.
- Implemented defensive photo parsing using `try/catch` to safely process the `L_Photos` JSON data.
- Improved defensive photo parsing to handle invalid, missing, and non-image photo data by selecting the first valid image URL.
- API requests display meaningful error messages by using backend-provided error messages when available and falling back to the HTTP status code when necessary.



