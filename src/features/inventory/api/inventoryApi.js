import api from '@shared/api/axios';
import { endpoints } from '@shared/api/endpoints';

async function fetchAll(endpoint) {
  const { data } = await api.get(endpoint);
  return data;
}

/**
 * Thin fetch wrappers around the `inventory` endpoints. Each hook in
 * `hooks/useInventory.js` / `hooks/useInventoryMutations.js` calls exactly
 * one of these. Composite views join the underlying collections in JS,
 * since bare json-server only serves plain collections.
 */
export const inventoryApi = {
  // Pass `storeId` as `undefined` for the unfiltered "all stores" case.
  // Unfiltered rows come back pre-joined as `{...row, product, store}`;
  // store-filtered rows come back as raw `{id, inventory_id, store_id,
  // product_id, product_inventory}` (matches prior server behavior).
  getAll: async (storeId) => {
    if (storeId) {
      return fetchAll(endpoints.inventory.byStore(storeId));
    }

    const [inventory, products, stores] = await Promise.all([
      fetchAll(endpoints.inventory.all()),
      fetchAll(endpoints.products.all()),
      fetchAll(endpoints.stores.all()),
    ]);
    const productsById = new Map(products.map((p) => [p.product_id, p]));
    const storesById = new Map(stores.map((s) => [s.store_id, s]));

    return inventory.map((row) => ({
      ...row,
      product: productsById.get(row.product_id) || null,
      store: storesById.get(row.store_id) || null,
    }));
  },

  getByProductStore: (productId, storeId) =>
    fetchAll(endpoints.inventory.byProductStore(productId, storeId)),

  // `category` is matched against the product `brand` field, case-insensitive
  // — this schema has no real "category" field on products.
  getByCategory: async (category) => {
    const products = await fetchAll(endpoints.products.all());
    const matchingIds = new Set(
      products
        .filter((p) => String(p.brand).toLowerCase() === String(category).toLowerCase())
        .map((p) => p.product_id)
    );
    const inventory = await fetchAll(endpoints.inventory.all());
    return inventory.filter((i) => matchingIds.has(i.product_id));
  },

  // { records, byShipmentStatus }
  getShipmentReport: async () => {
    const [inventory, orderItems, shipments] = await Promise.all([
      fetchAll(endpoints.inventory.all()),
      fetchAll(endpoints.orderItems.all()),
      fetchAll(endpoints.shipments.all()),
    ]);

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
      const itemsForShipment = orderItems.filter((oi) => oi.shipment_id === shipment.shipment_id);
      byShipmentStatusMap[status] += itemsForShipment.reduce(
        (sum, i) => sum + (i.quantity || 0),
        0
      );
    }
    const byShipmentStatus = Object.entries(byShipmentStatusMap).map(
      ([status, totalUnitsSold]) => ({ status, totalUnitsSold })
    );

    return { records, byShipmentStatus };
  },

  // { store, customer, products }
  getByOrder: async (orderId) => {
    const { data: order } = await api.get(endpoints.orders.byId(orderId));
    const [store, customer, orderItems, allProducts] = await Promise.all([
      api.get(endpoints.stores.byId(order.store_id)).then((r) => r.data).catch(() => null),
      api.get(endpoints.customers.byId(order.customer_id)).then((r) => r.data).catch(() => null),
      fetchAll(endpoints.orderItems.byOrderId(orderId)),
      fetchAll(endpoints.products.all()),
    ]);

    const productsById = new Map(allProducts.map((p) => [p.product_id, p]));
    const products = orderItems.map((item) => productsById.get(item.product_id) || null);

    return { store, customer, products };
  },

  // Array of { product, quantity, unitPrice, lineTotal, shipmentStatus, store, orderStatus }
  getOrderDetails: async (orderId) => {
    const { data: order } = await api.get(endpoints.orders.byId(orderId));
    const [store, items, allProducts, allShipments] = await Promise.all([
      api.get(endpoints.stores.byId(order.store_id)).then((r) => r.data).catch(() => null),
      fetchAll(endpoints.orderItems.byOrderId(orderId)),
      fetchAll(endpoints.products.all()),
      fetchAll(endpoints.shipments.all()),
    ]);

    const productsById = new Map(allProducts.map((p) => [p.product_id, p]));
    const shipmentsById = new Map(allShipments.map((s) => [s.shipment_id, s]));

    return items.map((item) => {
      const product = productsById.get(item.product_id) || null;
      const shipment = item.shipment_id ? shipmentsById.get(item.shipment_id) || null : null;
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
  },

  // Documented placeholder endpoint backing the restock flow — a normal
  // update, no special validation beyond the caller supplying a valid `id`.
  update: ({ id, product_inventory }) =>
    api.patch(endpoints.inventory.update(id), { product_inventory }).then((res) => res.data),

  create: ({ store_id, product_id, product_inventory }) =>
    api
      .post(endpoints.inventory.create(), { store_id, product_id, product_inventory })
      .then((res) => res.data),
};

export default inventoryApi;
