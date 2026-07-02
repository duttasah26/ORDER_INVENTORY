import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToastStore } from '@stores/toastStore';
import { useUpdateInventory } from '../hooks/useInventoryMutations';
import { INVENTORY_QUERY_KEY } from '../hooks/useInventory';
import { inventoryApi } from '../api/inventoryApi';
import { inventorySchema } from '../validation/inventorySchema';
import './InventoryForm.css';

/**
 * Formik + Yup quantity form, rendered inside RestockModal.
 *
 * - If `inventoryRow` is provided, submitting PUTs an update to the existing
 *   row via `useUpdateInventory`.
 * - If `inventoryRow` is null (brand-new product/store combo with no
 *   inventory record yet), submitting POSTs a new row via `inventoryApi.create`
 *   (which itself calls the shared axios instance directly), using the
 *   `productId`/`storeId` picked by the parent RestockModal.
 *
 * @param {object} props
 * @param {object|null} props.inventoryRow
 * @param {number} [props.productId] - required when `inventoryRow` is null
 * @param {number} [props.storeId] - required when `inventoryRow` is null
 * @param {() => void} [props.onDone] - called after a successful save
 */
export function InventoryForm({ inventoryRow, productId, storeId, onDone }) {
  const updateInventory = useUpdateInventory();
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  // No dedicated "create" hook is part of the fixed useInventoryMutations
  // contract, so the create-new-record flow is wired up inline here with
  // the same invalidate + toast behavior as useUpdateInventory.
  const createInventory = useMutation({
    mutationFn: (data) => inventoryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEY });
      addToast({ type: 'success', message: 'Inventory updated.' });
    },
    onError: () => {
      addToast({ type: 'error', message: "Couldn't save inventory. Please try again." });
    },
  });

  const isPending = updateInventory.isPending || createInventory.isPending;
  const canSubmit = Boolean(inventoryRow) || (Boolean(productId) && Boolean(storeId));

  async function handleSubmit(values, { setSubmitting }) {
    const quantity = Number(values.quantity);
    try {
      if (inventoryRow) {
        await updateInventory.mutateAsync({ id: inventoryRow.id, product_inventory: quantity });
      } else {
        await createInventory.mutateAsync({
          store_id: storeId,
          product_id: productId,
          product_inventory: quantity,
        });
      }
      onDone?.();
    } catch {
      // Toast already surfaced by the mutation's onError; keep the form
      // open so the admin can correct and retry.
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Formik
      initialValues={{ quantity: inventoryRow?.product_inventory ?? '' }}
      validationSchema={inventorySchema}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="inventory-form" noValidate>
          <div className="inventory-form__field">
            <label htmlFor="quantity" className="inventory-form__label">
              Quantity
            </label>
            <Field
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              className="form-control inventory-form__input"
            />
            <ErrorMessage name="quantity" component="div" className="inventory-form__error" />
          </div>

          {!canSubmit ? (
            <p className="inventory-form__hint">Select a product and a store to continue.</p>
          ) : null}

          <div className="inventory-form__actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || isPending || !canSubmit}
            >
              {isPending ? 'Saving…' : 'Save'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default InventoryForm;
