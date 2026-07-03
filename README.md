# IDXProject_SDE
A full-stack Property Search Application that allows users to browse property listings, view detailed property information, search using multiple filters, and view scheduled open houses.
The project emphasizes building RESTful APIs, integrating a React frontend with an Express backend and MySQL database, writing defensive code, and implementing unit tests.

## Stack
### Frontend
- React
- JavaScript
- CSS

### Backend
- Node.js
- Express.js
- MySQL 8

### Testing
- Jest
- React Testing Library
- Supertest

### Development Tools
- Docker
- GitHub
- Visual Studio Code


## Current status
- Week 1-7 completed
- MySQL database setup using Docker
- Backend API implemented
    - Health check endpoint
    - Property listings endpoint
    - Property details endpoint
    - Property search with filters endpoint
    - Open houses endpoint
    - Error handling and validation
- Frontend implemented
    - Listings page
    - Property cards
    - Property detail page
    - Image fallback handling
    - Property filters
    - Pagination
    - Reusable components such as loading and error.
- Testing
    - openhouses API tests
    - properties API tests
    - API client unit tests
    - PropertyFilters component unit tests
    - Pagination component unit tests
- Debugging
    - Fixed parameterized query bug in property filtering
    - Added error handling for endpoints
    - Investigated listing ID data inconsistencies
    - Implemented defensive image handling
    - Fixed asynchronous search state update issue
    - Fixed duplicate page number generation in the pagination component



## Roadmap
- Week 1: Environment Setup & Database Import
- Week 2: Backend Foundation + REST API Basics
- Week 3: Property Search Endpoint with Filters & Indexing
- Week 4: Property Detail & Open House Endpoints
- Week 5: React Setup & Listings Page
- Week 6: Filters UI + Introduction to Testing
- Week 7: Pagination UI & Component Testing
- Week 8: Property Detail Page End-to-End
- Week 9: Advanced Feature (Required) + Performance Optimization
- Week 10: Git Workflow & Code Organization
- Week 11: Comprehensive Testing & Documentation
- Week 12: Final Demo & Presentation

## Notes
- MySQL is hosted in a local Docker container.
- The project follows an incremental, milestone-based development approach as part of the IDX Exchange Internship.
- Environment variables are stored locally in .env and are not committed to Git.