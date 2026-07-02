export const endpoints = {
  products: {
    all: () => '/products',
    search: (name) => `/products/${encodeURIComponent(name)}`,
    sort: (field) => `/products/sort?field=${encodeURIComponent(field)}`,
    priceRange: (min, max) => `/products/unitprice?min=${min}&max=${max}`,
    byBrand: (brand) => `/products/brand/${encodeURIComponent(brand)}`,
    byColour: (colour) => `/products/colour/${encodeURIComponent(colour)}`,
    create: () => '/products',
    update: () => '/products', // PUT, body: {id, ...fields}
    remove: (id) => `/products/${id}`,
  },
  customers: {
    all: () => '/customers',
    shipmentStatusCounts: () => '/customers/shipment/status',
    pendingShipments: () => '/customers/shipments/pending',
    overdueShipments: () => '/customers/shipments/overdue',
    completedOrders: () => '/customers/orders/completed',
    byOrderQuantityRange: (min, max) => `/customers/orders/quantity/${min}/${max}`,
    orders: (custId) => `/customers/${custId}/order`,
    shipments: (custId) => `/customers/${custId}/shipment`,
    lookup: (emailOrName) => `/customers/${encodeURIComponent(emailOrName)}`, // '@' -> email lookup, else name substring
    create: () => '/customers',
    update: () => '/customers', // PUT, body: {id, ...fields}
    remove: (customerId) => `/customers/${customerId}`,
  },
  orders: {
    all: () => '/orders',
    statusCounts: () => '/orders/status',
    byStatus: (status) => `/orders/status/${status}`,
    byDateRange: (start, end) => `/orders/date/${start}/${end}`,
    byCustomer: (customerIdOrEmail) => `/orders/customer/${encodeURIComponent(customerIdOrEmail)}`,
    cancel: (id) => `/orders/${id}/cancel`, // GET, but semantically a mutation
    byIdOrStore: (idOrStore) => `/orders/${encodeURIComponent(idOrStore)}`, // numeric -> order detail, else -> store name match
    create: () => '/orders',
    update: () => '/orders', // PUT, body: {id, ...fields}
    remove: (id) => `/orders/${id}`,
  },
  inventory: {
    all: (storeId) => (storeId ? `/inventory?storeid=${storeId}` : '/inventory'),
    byProductStore: (productId, storeId) => `/inventory/product/${productId}/store/${storeId}`,
    byCategory: (category) => `/inventory/category/${encodeURIComponent(category)}`, // matched against product brand
    shipmentReport: () => '/inventory/shipment', // {records, byShipmentStatus}
    byOrder: (orderId) => `/inventory/${orderId}`,
    orderDetails: (orderId) => `/inventory/${orderId}/details`,
    update: () => '/inventory', // PUT, body: {id, ...fields} (placeholder endpoint)
  },
  stores: {
    all: () => '/stores',
    byId: (id) => `/stores/${id}`,
  },
  shipments: {
    all: () => '/shipments',
    byId: (id) => `/shipments/${id}`,
  },
  admin: {
    all: () => '/admin',
  },
};

export default endpoints;
