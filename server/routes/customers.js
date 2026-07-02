import express from 'express';
import { OVERDUE_SHIPMENT_THRESHOLD_DAYS } from '../config.js';

function dedupById(customers) {
  const seen = new Set();
  const result = [];
  for (const c of customers) {
    if (!seen.has(c.id)) {
      seen.add(c.id);
      result.push(c);
    }
  }
  return result;
}

export default function customersRouter(db) {
  const router = express.Router();

  // GET /shipment/status
  router.get('/shipment/status', (req, res) => {
    const shipments = db.get('shipments').value();
    const counts = {};
    for (const s of shipments) {
      counts[s.shipment_status] = (counts[s.shipment_status] || 0) + 1;
    }
    const result = Object.entries(counts).map(([status, count]) => ({
      status,
      count,
    }));
    return res.json(result);
  });

  // GET /shipments/pending
  router.get('/shipments/pending', (req, res) => {
    const shipments = db
      .get('shipments')
      .filter((s) => s.shipment_status === 'CREATED' || s.shipment_status === 'SHIPPED')
      .value();
    const customerIds = new Set(shipments.map((s) => s.customer_id));
    const customers = db
      .get('customers')
      .filter((c) => customerIds.has(c.customer_id))
      .value();
    return res.json(dedupById(customers));
  });

  // GET /shipments/overdue
  router.get('/shipments/overdue', (req, res) => {
    const shipments = db.get('shipments').value();
    const orderItems = db.get('order_items').value();
    const orders = db.get('orders').value();
    const customers = db.get('customers').value();

    const now = Date.now();
    const thresholdMs = OVERDUE_SHIPMENT_THRESHOLD_DAYS * 24 * 60 * 60 * 1000;

    const overdueCustomerIds = new Set();

    for (const shipment of shipments) {
      if (shipment.shipment_status === 'DELIVERED') continue;

      const relatedItem = orderItems.find(
        (oi) => oi.shipment_id === shipment.shipment_id
      );
      if (!relatedItem) continue;

      const order = orders.find((o) => o.order_id === relatedItem.order_id);
      if (!order || !order.order_tms) continue;

      const orderTime = new Date(order.order_tms.replace(' ', 'T')).getTime();
      if (!Number.isFinite(orderTime)) continue;

      if (now - orderTime > thresholdMs) {
        overdueCustomerIds.add(shipment.customer_id);
      }
    }

    const results = customers.filter((c) => overdueCustomerIds.has(c.customer_id));
    return res.json(dedupById(results));
  });

  // GET /orders/completed
  router.get('/orders/completed', (req, res) => {
    const orders = db.get('orders').filter({ order_status: 'COMPLETE' }).value();
    const customerIds = new Set(orders.map((o) => o.customer_id));
    const customers = db
      .get('customers')
      .filter((c) => customerIds.has(c.customer_id))
      .value();
    return res.json(dedupById(customers));
  });

  // GET /orders/quantity/:min/:max
  router.get('/orders/quantity/:min/:max', (req, res) => {
    const min = Number(req.params.min);
    const max = Number(req.params.max);
    if (!Number.isFinite(min) || !Number.isFinite(max)) {
      return res.status(400).json({
        message:
          'Invalid request. Please provide valid minimum and maximum quantities for orders.',
      });
    }
    const customers = db.get('customers').value();
    const orders = db.get('orders').value();
    const orderItems = db.get('order_items').value();

    const results = customers.filter((customer) => {
      const custOrders = orders.filter((o) => o.customer_id === customer.customer_id);
      const total = custOrders.reduce((sum, order) => {
        const items = orderItems.filter((oi) => oi.order_id === order.order_id);
        return sum + items.reduce((s, i) => s + (i.quantity || 0), 0);
      }, 0);
      return total >= min && total <= max;
    });

    return res.json(results);
  });

  // GET /:custId/order
  router.get('/:custId/order', (req, res) => {
    const custId = Number(req.params.custId);
    const customer = Number.isFinite(custId)
      ? db.get('customers').find({ customer_id: custId }).value()
      : undefined;
    if (!customer) {
      return res.status(404).json({
        message: 'Orders for the specified customer ID not found.',
      });
    }
    const orders = db.get('orders').filter({ customer_id: custId }).value();
    return res.json({ customer, orders });
  });

  // GET /:custId/shipment
  router.get('/:custId/shipment', (req, res) => {
    const custId = Number(req.params.custId);
    const customer = Number.isFinite(custId)
      ? db.get('customers').find({ customer_id: custId }).value()
      : undefined;
    if (!customer) {
      return res.status(404).json({
        message: 'Shipment history for the specified customer ID not found.',
      });
    }
    const shipments = db.get('shipments').filter({ customer_id: custId }).value();
    return res.json({ customer, shipments });
  });

  // PUT / (exact /api/v1/customers)
  router.put('/', (req, res) => {
    const { id, ...fields } = req.body || {};
    if (id === undefined || id === null || Object.keys(fields).length === 0) {
      return res.status(400).json({
        message: 'Invalid request. Please provide valid customer data for updating.',
      });
    }
    const existing = db.get('customers').find({ id }).value();
    if (!existing) {
      return res.status(400).json({
        message: 'Invalid request. Please provide valid customer data for updating.',
      });
    }
    db.get('customers').find({ id }).assign(fields).write();
    return res.json('Record Updated Successfully');
  });

  // DELETE /:customerId  (matches against the `id` field)
  router.delete('/:customerId', (req, res) => {
    const id = Number(req.params.customerId);
    const existing = db.get('customers').find({ id }).value();
    if (!existing) {
      return res.status(400).json({
        message: 'Invalid request. Please provide valid customer ID for deletion.',
      });
    }
    db.get('customers').remove({ id }).write();
    return res.json('Record deleted Successfully');
  });

  // GET /:query -- UNIFIED lookup, must be registered LAST (catch-all).
  router.get('/:query', (req, res) => {
    const query = decodeURIComponent(req.params.query);
    const customers = db.get('customers').value();

    if (query.includes('@')) {
      const results = customers.filter(
        (c) => String(c.email_address).toLowerCase() === query.toLowerCase()
      );
      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: 'Customer with the provided email ID not found.' });
      }
      return res.json(results);
    }

    const results = customers.filter((c) =>
      String(c.full_name).toLowerCase().includes(query.toLowerCase())
    );
    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: 'Customer with the provided name wildcard not found.' });
    }
    return res.json(results);
  });

  return router;
}
