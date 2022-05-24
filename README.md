# Server

`server/prisma/migrations/20220520174801_init_db/migration.sql` -> Path to SQL Schema

`server/prisma/seed.ts` -> Path to DB seed data (please customize for jammu)

## Api Endpoints

- GET /shops - Get Shops
- GET /shops/{shopID} - Get particular shop with products
- POST /orders - Create order
- GET /orders - Get all orders (not used in application)
- GET /orders/{contactNumber} - Get orders of a user (not used in application)
- POST /orders/payment - Update payment status of an order
