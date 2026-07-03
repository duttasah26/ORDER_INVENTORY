import * as Yup from 'yup';

/**
 * Stores are read-only in this build — there is no create/edit form for
 * them anywhere in the app. This schema isn't wired to anything; it exists
 * only so the file is present per `architecture.txt`'s file list, and is
 * reserved for a future admin CRUD feature (add/edit store).
 */
export const storeSchema = Yup.object({
  store_name: Yup.string().required('Store name is required.'),
  web_address: Yup.string().url('Must be a valid URL.').nullable(),
  physical_address: Yup.string().nullable(),
  latitude: Yup.number().nullable(),
  longitude: Yup.number().nullable(),
});

export default storeSchema;
