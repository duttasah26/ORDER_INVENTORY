import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import jsonServer from 'json-server';

import productsRouter from './routes/products.js';
import customersRouter from './routes/customers.js';
import ordersRouter from './routes/orders.js';
import inventoryRouter from './routes/inventory.js';
import storesRouter from './routes/stores.js';
import shipmentsRouter from './routes/shipments.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project root is one level up from server/
const dbPath = path.resolve(__dirname, '..', 'db.json');

const server = jsonServer.create();
const router = jsonServer.router(dbPath);

// The lowdb v1 instance json-server 0.17.x exposes. All custom route
// handlers use this so they read/write the SAME underlying data as
// json-server's own default routes.
const db = router.db;

server.use(jsonServer.defaults());
server.use(express.json());

// Make the shared lowdb instance available to custom routers via app locals.
server.locals.db = db;

// Custom routers, mounted before the default fallback so their more
// specific literal paths are matched first.
server.use('/api/v1/products', productsRouter(db));
server.use('/api/v1/customers', customersRouter(db));
server.use('/api/v1/orders', ordersRouter(db));
server.use('/api/v1/inventory', inventoryRouter(db));
server.use('/api/v1/stores', storesRouter(db));
server.use('/api/v1/shipments', shipmentsRouter(db));

// Default json-server router as a fallback for plain CRUD on every
// collection (including order_items and admin, which have no custom router).
server.use('/api/v1', router);

// Port 4000 is occupied on this dev machine by a NoMachine remote-desktop
// service (nxd.exe), so the default is 4100; overridable via PORT env var.
const PORT = process.env.PORT || 4100;
server.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
});
