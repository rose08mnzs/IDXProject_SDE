# WEEK 8 - Property Detail Page End-to-End

## Project structure
- idxproject
    - frontend/
        - src/
            - api
            - components/
                - PropertyCard.jsx
                - PropertyImageCarousel.jsx
                - PropertyImageGallery.jsx
                - PropertyMap.jsx
                - OpenHouseList.jsx
                - DescriptionCard.jsx
                - PropertyDetails.jsx
            - pages/
                - ListingsPage.jsx
                - PropertyDetailPage.jsx
            - styles/
                - PropertyCard.css
                - PropertyImageGallery.css
                - PropertyDetailPage.css
                - OpenHouseList.css
                - PropertyDetails.css
                - DescriptionCard.css
                - PropertyMap.css
            - utility
            - App.js
            - index.js

## Install React Router
```bash
npm install react-router-dom
```

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

## Routing
React Router was added to support navigation between the property listings page and individual property detail pages.

### Routes
- `/` → ListingsPage
- `/property/:id` → PropertyDetailPage
- `/property/:id/openhouses` → PropertyOpenHouses

### Navigation
- Clicking a property card opens the Property Detail page.
- Back button returns to the Listings page.
- Invalid listing IDs display an error message instead of crashing.

## Property Detail Page

A new `PropertyDetailPage` was created to display complete property information.

### Displays
- Price
- Address
- City, State, ZIP Code
- Bedrooms
- Bathrooms
- Square Footage
- Year Built
- Description
- Property Details
- Open Houses
- Google Map

## Property Image Carousel
A reusable `PropertyImageCarousel` component was added to listing cards.

### Features
- Displays multiple listing photos
- Previous and Next buttons
- Image counter
- Prevents navigation when clicking carousel arrows using `stopPropagation()`
- Automatically removes broken image URLs
- Handles missing or malformed photo data

## Property Image Gallery
A reusable `PropertyImageGallery` component was created for the property detail page.

### Features
- Large primary image
- Scrollable thumbnail strip
- Active thumbnail highlighting
- Image counter
- Full-screen lightbox
- Keyboard navigation
    - Left Arrow
    - Right Arrow
    - Escape to close
- Automatically removes broken image URLs
- Handles malformed photo JSON safely

## Google Maps
The Google Maps Embed API was integrated into the property detail page.

### Features
- Displays property location
- Uses property latitude and longitude
- Only renders when coordinates are available
- "Get Directions" button opens Google Maps in a new tab

## Open Houses
Open houses are displayed directly on the property detail page.

### Features
- Formatted open house date
- Formatted start and end times
- Displays remarks extracted from the `all_data` JSON field
- Shows a message when no open houses exist

## Property Details
A reusable `PropertyDetails` component was created.

### Sections
- Overview
- Interior
- Exterior
- Community
- Listing Information

### Features
- Automatically hides empty fields
- Formats boolean values as Yes / No
- Formats dates into readable form
- Formats prices with commas
- Cleans MLS text such as `CentralAir` → `Central Air`

## Description
A reusable `DescriptionCard` component was added.

### Features
- Displays property description
- Collapses long descriptions
- "Read More" / "Show Less" functionality
- Reusable header section for displaying additional information (e.g. property price)

## Debug Challenges
### Problem 1
After implementing the Open House component, the remarks field never appeared even for properties that contained open house remarks. The backend returned the all_data field exactly as stored in the database, but OpenHouseRemarks was nested inside this JSON object rather than being a standalone property.

Example:
1. Open a property with an upcoming open house.
2. The date and time display correctly.
3. The remarks section remains empty even though remarks exist in the database.
This occurred because the React component attempted to access OpenHouseRemarks directly from the open house object instead of first parsing the all_data JSON string.

### Solution
The frontend component was updated to safely parse the all_data field using JSON.parse(). Once parsed, the component extracts the OpenHouseRemarks property from the resulting object and displays it beneath the open house information. A try/catch block was added to gracefully handle invalid or malformed JSON without causing the page to crash. This approach keeps the backend unchanged while correctly displaying remarks whenever they are available.

--- 

### Problem 2
The image lightbox opened correctly when the user clicked the main property image, but pressing the Escape key did not close it. Although a keyboard event listener had been implemented, the callback never executed while the lightbox was open.

Example:
1. Open the property image lightbox.
2. Press the Escape key.
3. The lightbox remains open instead of closing.
This happened because the keyboard event was attached incorrectly and the lightbox itself was not reliably receiving keyboard events.

### Solution
The keyboard handling logic was redesigned by attaching a keydown event listener to the global window object whenever the lightbox is opened. The listener is removed automatically when the lightbox closes or when the component unmounts to prevent unnecessary event listeners and memory leaks. The handler now listens for the Escape key to close the lightbox, while also supporting the Left Arrow and Right Arrow keys to navigate between photos. This provides full keyboard accessibility and ensures consistent behavior regardless of which element currently has focus.

## Notes
- Installed and configured React Router.
- Added Property Detail page with routing.
- Made Property Cards clickable.
- Created reusable Property Image Carousel component.
- Created reusable Property Image Gallery component.
- Implemented image lightbox with keyboard navigation.
- Added image counters to the carousel and gallery.
- Added thumbnail navigation.
- Integrated the Google Maps Embed API.
- Added "Get Directions" functionality.
- Displayed property open houses.
- Parsed `OpenHouseRemarks` from the `all_data` JSON field on the frontend.
- Created reusable `PropertyDetails` component.
- Created reusable `DescriptionCard` component with expandable "Read More" functionality.
- Automatically removed broken MLS image URLs from the gallery and carousel.
- Added error handling for invalid property IDs.
- Added a placeholder message when property location coordinates are unavailable.
- Formatted open house dates, times, and remarks for improved readability.
- Implemented global keyboard event handling to support **Escape**, **Left Arrow**, and **Right Arrow** navigation within the image lightbox.
- Researched keyboard accessibility for non-focusable elements and ensured reliable keyboard interaction by using a global `keydown` event listener while the lightbox is open.
- Added defensive JSON parsing with `try/catch` to safely extract open house remarks without requiring backend changes.




