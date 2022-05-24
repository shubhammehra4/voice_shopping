# Server

`server/prisma/migrations/20220520174801_init_db/migration.sql` -> Path to SQL Schema

`server/prisma/seed.ts` -> Path to DB seed data (please customize shops, names and items for jammu)
                                                example: Rawal Pindi Sweet Shop etc.

## Api Endpoints

- GET /shops - Get Shops
- GET /shops/{shopID} - Get particular shop with products
- POST /orders - Create order
- GET /orders - Get all orders (not used in application)
- GET /orders/{contactNumber} - Get orders of a user (not used in application)
- POST /orders/payment - Update payment status of an order

Activites Example

- Decide of DB Schema and entities and ER diagrams
- Learn and implement API server in node with fastify/express
- Test the API with Postman
- Decide Frontent design and structure
- Learn about speech recognition ...
- Implement UI and functionality
- Integration Test the application
- deploy and test
