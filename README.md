# idx-sde-repository
IDX Exchange Summer 2026 SDE Internship Repository

## Project Overview
What You Are Building: 
A Zillow/Redfin-style property search experience backed by real MLS data. The finished 
application must include: 
• A searchable, filterable property listings page with pagination 
• A property detail page with photos, map, and open house schedule 
• A Node/Express REST API connecting React to MySQL 
• A local MySQL database populated from two provided SQL files

## Project Technical Stack: 
• Frontend: React (Create React App) 
• Backend: Node.js + Express 
• Database: MySQL 8 running in Docker 
• Testing: Jest + React Testing Library + Supertest

### Week 1: Environment Setup & Database Import 
MySQL runs in docker with tables populated with data with functional search queries.

### Week 2: Backend Foundation + REST API Basics 
A Node/Express server works with a health check endpoint (along with error codes).

### Week 3: Property Search Endpoint with Filters & Indexing
A working, filterable GET /api/properties endpoint with proper database indexing for city, zipcode, min price, max price, beds, and baths

### Week 4: Property Detail & Open House Endpoints
Added 2 new endpoints: property by ListingID and openhouses by propertyID

### Week 5: React Setup and Listings Page
A React frontend app that fetches the backend info and displays it on the various property cards

### Week 6: Filters and Testing Intro
The frontend app now includes filters and unit tests are introduced

### Week 7: Pagination and Complex Testing
The frontend app now includes pagination at the bottom and more complex test cases

### Week 8: Property Detail Page
The frontend app now includes an image carousel and a property detail page for each property card; within the property detail page is various information, along with a photo gallery, map, and open houses.
