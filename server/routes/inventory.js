import express from 'express';

export default function inventoryRouter(db) {
  const router = express.Router();

  // GET /product/:productId/store/:storeId
  router.get('/product/:productId/store/:storeId', (req, res) => {
    const productId = Number(req.params.productId);
    const storeId = Number(req.params.storeId);
    const results = db
      .get('inventory')
      .filter({ product_id: productId, store_id: storeId })
      .value();
    if (!results || results.length === 0) {
      return res.status(404).json({
        message: 'Inventory records for the specified product and store not found.',
      });
    }
    return res.json(results);
  });

  // GET /category/:category
  // NOTE: products in this schema have no `category` field. As the closest
  // analogous grouping field we match against `brand` instead — a deliberate
  // interpretation to satisfy this endpoint, not a bug.
  router.get('/category/:category', (req, res) => {
    const { category } = req.params;
    const matchingProducts = db
      .get('products')
      .filter((p) => String(p.brand).toLowerCase() === category.toLowerCase())
      .value();
    const productIds = new Set(matchingProducts.map((p) => p.product_id));
    const results = db
      .get('inventory')
      .filter((i) => productIds.has(i.product_id))
      .value();
    if (!results || results.length === 0) {
      return res.status(404).json({
        message: 'Inventory records for the specified category not found.',
      });
    }
    return res.json(results);
  });

  // GET /shipment -- composite endpoint
  router.get('/shipment', (req, res) => {
    const inventory = db.get('inventory').value();
    const orderItems = db.get('order_items').value();
    const shipments = db.get('shipments').value();

    const records = inventory.map((invRow) => {
      const relatedItem = orderItems.find((oi) => oi.product_id === invRow.product_id);
      const shipment = relatedItem
        ? shipments.find((s) => s.shipment_id === relatedItem.shipment_id) || null
        : null;
      return { ...invRow, shipment };
    });

    const byShipmentStatusMap = {};
    for (const shipment of shipments) {
      const status = shipment.shipment_status;
      if (!byShipmentStatusMap[status]) byShipmentStatusMap[status] = 0;
      const itemsForShipment = orderItems.filter(
        (oi) => oi.shipment_id === shipment.shipment_id
      );
      byShipmentStatusMap[status] += itemsForShipment.reduce(
        (sum, i) => sum + (i.quantity || 0),
        0
      );
    }
    const byShipmentStatus = Object.entries(byShipmentStatusMap).map(
      ([status, totalUnitsSold]) => ({ status, totalUnitsSold })
    );

    return res.json({ records, byShipmentStatus });
  });

  // GET /:orderid/details
  router.get('/:orderid/details', (req, res) => {
    const orderid = Number(req.params.orderid);
    const order = db.get('orders').find({ order_id: orderid }).value();
    if (!order) {
      return res.status(404).json({
        message:
          'List of products in the specified order ID not found with store details, shipment status, and total amount.',
      });
    }
    const store = db.get('stores').find({ store_id: order.store_id }).value() || null;
    const items = db.get('order_items').filter({ order_id: orderid }).value();

    const result = items.map((item) => {
      const product =
        db.get('products').find({ product_id: item.product_id }).value() || null;
      const shipment = item.shipment_id
        ? db.get('shipments').find({ shipment_id: item.shipment_id }).value() || null
        : null;
      return {
        product,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        lineTotal: item.unit_price * item.quantity,
        shipmentStatus: shipment ? shipment.shipment_status : null,
        store,
        orderStatus: order.order_status,
      };
    });

    return res.json(result);
  });

  // GET /:orderid
  router.get('/:orderid', (req, res) => {
    const orderid = Number(req.params.orderid);
    const order = db.get('orders').find({ order_id: orderid }).value();
    if (!order) {
      return res.status(404).json({
        message: 'Store, product, and customer data for the specified order ID not found.',
      });
    }
    const store = db.get('stores').find({ store_id: order.store_id }).value() || null;
    const customer =
      db.get('customers').find({ customer_id: order.customer_id }).value() || null;
    const items = db.get('order_items').filter({ order_id: orderid }).value();
    const products = items.map(
      (item) => db.get('products').find({ product_id: item.product_id }).value() || null
    );

    return res.json({ store, customer, products });
  });

  // GET / (base) -- ?storeid= query param, or full joined inventory
  router.get('/', (req, res) => {
    const { storeid } = req.query;
    let inventory = db.get('inventory').value();

    if (storeid !== undefined) {
      const storeIdNum = Number(storeid);
      inventory = inventory.filter((i) => i.store_id === storeIdNum);
      return res.json(inventory);
    }

    const joined = inventory.map((invRow) => {
      const product =
        db.get('products').find({ product_id: invRow.product_id }).value() || null;
      const store =
        db.get('stores').find({ store_id: invRow.store_id }).value() || null;
      return { ...invRow, product, store };
    });
    return res.json(joined);
  });

  // PUT / -- update-by-id backing endpoint for restock modal
  router.put('/', (req, res) => {
    const { id, ...fields } = req.body || {};
    if (id === undefined || id === null) {
      return res.status(400).json({
        message: 'Invalid request. Please provide a valid inventory ID for updating.',
      });
    }
    const existing = db.get('inventory').find({ id }).value();
    if (!existing) {
      return res.status(400).json({
        message: 'Invalid request. Please provide a valid inventory ID for updating.',
      });
    }
    db.get('inventory').find({ id }).assign(fields).write();
    return res.json('Record Updated Successfully');
  });

  return router;
}
