import express from 'express';

export default function ordersRouter(db) {
  const router = express.Router();

  // GET /status
  router.get('/status', (req, res) => {
    const orders = db.get('orders').value();
    const counts = {};
    for (const o of orders) {
      counts[o.order_status] = (counts[o.order_status] || 0) + 1;
    }
    const result = Object.entries(counts).map(([status, count]) => ({
      status,
      count,
    }));
    return res.json(result);
  });

  // GET /status/:status
  router.get('/status/:status', (req, res) => {
    const { status } = req.params;
    const results = db
      .get('orders')
      .filter((o) => String(o.order_status).toLowerCase() === status.toLowerCase())
      .value();
    if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ message: 'Orders with the specified status not found.' });
    }
    return res.json(results);
  });

  // GET /date/:startDate/:endDate
  router.get('/date/:startDate/:endDate', (req, res) => {
    const { startDate, endDate } = req.params;
    const results = db
      .get('orders')
      .filter((o) => {
        if (!o.order_tms) return false;
        const datePart = o.order_tms.split(' ')[0];
        return datePart >= startDate && datePart <= endDate;
      })
      .value();
    if (!results || results.length === 0) {
      return res.status(404).json({
        message: 'Orders within the specified date range not found.',
      });
    }
    return res.json(results);
  });

  // GET /customer/:x -- UNIFIED (numeric customer_id, or email)
  router.get('/customer/:x', (req, res) => {
    const x = decodeURIComponent(req.params.x);
    const numeric = Number(x);
    let customerId;

    if (Number.isFinite(numeric) && x.trim() !== '') {
      customerId = numeric;
    } else if (x.includes('@')) {
      const customer = db
        .get('customers')
        .find((c) => String(c.email_address).toLowerCase() === x.toLowerCase())
        .value();
      if (customer) customerId = customer.customer_id;
    }

    const results =
      customerId !== undefined
        ? db.get('orders').filter({ customer_id: customerId }).value()
        : [];

    if (!results || results.length === 0) {
      return res.status(404).json({
        message: 'Orders for the specified customer ID not found.',
      });
    }
    return res.json(results);
  });

  // GET /:id/cancel
  router.get('/:id/cancel', (req, res) => {
    const id = Number(req.params.id);
    const order = db.get('orders').find({ order_id: id }).value();
    if (!order) {
      return res.status(404).json({
        message: 'Order with the specified ID not found for cancellation.',
      });
    }
    db.get('orders').find({ order_id: id }).assign({ order_status: 'CANCELLED' }).write();
    return res.json({ message: 'Order cancelled.' });
  });

  // PUT / (exact /api/v1/orders)
  router.put('/', (req, res) => {
    const { id, ...fields } = req.body || {};
    if (id === undefined || id === null || Object.keys(fields).length === 0) {
      return res.status(400).json({
        message: 'Invalid request. Please provide valid order data for updating.',
      });
    }
    const existing = db.get('orders').find({ id }).value();
    if (!existing) {
      return res.status(400).json({
        message: 'Invalid request. Please provide valid order data for updating.',
      });
    }
    db.get('orders').find({ id }).assign(fields).write();
    return res.json('Record Updated Successfully');
  });

  // DELETE /:id
  router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    const existing = db.get('orders').find({ id }).value();
    if (!existing) {
      return res.status(404).json({
        message: 'Order with the specified ID not found for deletion.',
      });
    }
    db.get('orders').remove({ id }).write();
    return res.json('Record deleted Successfully');
  });

  // GET /:idOrStore -- UNIFIED, must be registered LAST among single-segment GETs.
  router.get('/:idOrStore', (req, res) => {
    const raw = decodeURIComponent(req.params.idOrStore);
    const numeric = Number(raw);

    if (raw.trim() !== '' && Number.isFinite(numeric)) {
      const order = db.get('orders').find({ order_id: numeric }).value();
      if (!order) {
        return res.status(404).json({
          message: 'Order with the specified order ID not found.',
        });
      }
      const customer =
        db.get('customers').find({ customer_id: order.customer_id }).value() || null;
      const store = db.get('stores').find({ store_id: order.store_id }).value() || null;
      const items = db
        .get('order_items')
        .filter({ order_id: order.order_id })
        .value()
        .map((item) => ({
          ...item,
          product:
            db.get('products').find({ product_id: item.product_id }).value() || null,
        }));

      return res.json({ ...order, customer, store, items });
    }

    // Treat as a store name lookup.
    const store = db
      .get('stores')
      .find((s) => String(s.store_name).toLowerCase() === raw.toLowerCase())
      .value();
    const storeOrders = store
      ? db.get('orders').filter({ store_id: store.store_id }).value()
      : [];

    if (!store || storeOrders.length === 0) {
      return res.status(404).json({
        message: 'Orders with the specified store name not found.',
      });
    }

    const result = storeOrders.map((order) => ({
      orderid: order.order_id,
      orderstatus: order.order_status,
      storename: store.store_name,
      webaddress: store.web_address,
    }));
    return res.json(result);
  });

  return router;
}
