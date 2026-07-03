import { Route, Routes } from 'react-router-dom';

import PublicLayout from '@shared/components/layout/PublicLayout';
import CustomerLayout from '@shared/components/layout/CustomerLayout';
import AdminLayout from '@shared/components/layout/AdminLayout';
import ProtectedRoute from '@shared/components/common/ProtectedRoute';

import Login from '@features/auth/pages/Login';
import AdminLogin from '@features/auth/pages/AdminLogin';
import Register from '@features/auth/pages/Register';

import Products from '@features/products/pages/Products';
import ProductDetails from '@features/products/pages/ProductDetails';

import Cart from '@features/cart/pages/Cart';
import Checkout from '@features/cart/pages/Checkout';

import Orders from '@features/orders/pages/Orders';
import OrderDetails from '@features/orders/pages/OrderDetails';

import Profile from '@features/profile/pages/Profile';

import Dashboard from '@features/dashboard/pages/Dashboard';
import Customers from '@features/customers/pages/Customers';
import CustomerDetails from '@features/customers/pages/CustomerDetails';
import Inventory from '@features/inventory/pages/Inventory';

import Stores from '@features/stores/pages/Stores';
import StoreDetails from '@features/stores/pages/StoreDetails';
import Shipments from '@features/shipments/pages/Shipments';
import ShipmentDetails from '@features/shipments/pages/ShipmentDetails';

import NotFound from '@features/not-found/pages/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Customer-facing routes */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        <Route element={<ProtectedRoute roles={['customer']} />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-orders" element={<Orders />} />
          <Route path="/my-orders/:id" element={<OrderDetails />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Admin routes */}
      <Route element={<ProtectedRoute roles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/products" element={<Products />} />
          <Route path="/admin/customers" element={<Customers />} />
          <Route path="/admin/customers/:id" element={<CustomerDetails />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/orders/:id" element={<OrderDetails />} />
          <Route path="/admin/inventory" element={<Inventory />} />
          <Route path="/admin/stores" element={<Stores />} />
          <Route path="/admin/stores/:id" element={<StoreDetails />} />
          <Route path="/admin/shipments" element={<Shipments />} />
          <Route path="/admin/shipments/:id" element={<ShipmentDetails />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
