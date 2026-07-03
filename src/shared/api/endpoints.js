export const endpoints = {
  products: {
    all: () => '/products',
    byId: (id) => `/products/${id}`,
    byBrand: (brand) => `/products?brand=${encodeURIComponent(brand)}`,
    byColour: (colour) => `/products?colour=${encodeURIComponent(colour)}`,
    priceRange: (min, max) => `/products?unit_price_gte=${min}&unit_price_lte=${max}`,
    sort: (field) => `/products?_sort=${encodeURIComponent(field)}`,
    create: () => '/products',
    update: (id) => `/products/${id}`, // PATCH, body: {...fields}
    remove: (id) => `/products/${id}`,
  },
  customers: {
    all: () => '/customers',
    byId: (id) => `/customers/${id}`,
    create: () => '/customers',
    update: (id) => `/customers/${id}`, // PATCH, body: {...fields}
    remove: (customerId) => `/customers/${customerId}`,
  },
  orders: {
    all: () => '/orders',
    byId: (id) => `/orders/${id}`,
    byStatus: (status) => `/orders?order_status=${encodeURIComponent(status)}`,
    byCustomerId: (customerId) => `/orders?customer_id=${customerId}`,
    byStoreId: (storeId) => `/orders?store_id=${storeId}`,
    // Lexicographic compare works since order_tms is `YYYY-MM-DD HH:MM:SS`.
    byDateRange: (start, end) =>
      `/orders?order_tms_gte=${encodeURIComponent(`${start} 00:00:00`)}&order_tms_lte=${encodeURIComponent(`${end} 23:59:59`)}`,
    create: () => '/orders',
    update: (id) => `/orders/${id}`, // PATCH, body: {...fields} (also used for cancel)
    remove: (id) => `/orders/${id}`,
  },
  orderItems: {
    all: () => '/order_items',
    byOrderId: (orderId) => `/order_items?order_id=${orderId}`,
    create: () => '/order_items',
  },
  inventory: {
    all: () => '/inventory',
    byStore: (storeId) => `/inventory?store_id=${storeId}`,
    byProductStore: (productId, storeId) =>
      `/inventory?product_id=${productId}&store_id=${storeId}`,
    create: () => '/inventory',
    update: (id) => `/inventory/${id}`, // PATCH, body: {...fields}
  },
  stores: {
    all: () => '/stores',
    byId: (id) => `/stores/${id}`,
  },
  shipments: {
    all: () => '/shipments',
    byId: (id) => `/shipments/${id}`,
    byCustomerId: (customerId) => `/shipments?customer_id=${customerId}`,
  },
  admin: {
    all: () => '/admin',
  },
};

export default endpoints;
