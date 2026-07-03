import api from '@shared/api/axios';
import endpoints from '@shared/api/endpoints';
import { customerApi } from '@features/customers/api/customerApi';

/**
 * Raw API calls backing the mock-auth flows. There is no real auth backend —
 * these just read/write the `customers` and `admin` collections and the
 * hooks in `../hooks/useAuth.js` do the credential matching.
 */

/** Looks up customers by email. Never throws — no match just means []. */
export async function lookupCustomerByEmail(email) {
  return customerApi.lookup(email);
}

export async function fetchAllAdmins() {
  const { data } = await api.get(endpoints.admin.all());
  return Array.isArray(data) ? data : [];
}

// Delegates to customerApi.create so registrations get the same
// customer_id backfill as admin-created customers.
export async function createCustomer(payload) {
  return customerApi.create(payload);
}

export default {
  lookupCustomerByEmail,
  fetchAllAdmins,
  createCustomer,
};
