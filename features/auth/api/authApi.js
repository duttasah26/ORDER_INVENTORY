import api from '@shared/api/axios';
import endpoints from '@shared/api/endpoints';

/**
 * Raw API calls backing the mock-auth flows. There is no real auth backend —
 * these just read/write the `customers` and `admin` collections and the
 * hooks in `../hooks/useAuth.js` do the credential matching.
 */

/**
 * Looks up customers by email. The mock server's unified lookup route
 * 404s when nothing matches, so that case is normalized to an empty array
 * rather than bubbling up as an error.
 */
export async function lookupCustomerByEmail(email) {
  try {
    const { data } = await api.get(endpoints.customers.lookup(email));
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

export async function fetchAllAdmins() {
  const { data } = await api.get(endpoints.admin.all());
  return Array.isArray(data) ? data : [];
}

export async function createCustomer(payload) {
  const { data } = await api.post(endpoints.customers.create(), payload);
  return data;
}

export default {
  lookupCustomerByEmail,
  fetchAllAdmins,
  createCustomer,
};
