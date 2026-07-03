import { useState } from 'react';
import { Modal } from '@shared/components/common/Modal';
import { useProducts } from '@features/products/hooks/useProducts';
import { useStores } from '@features/stores/hooks/useStores';
import { InventoryForm } from './InventoryForm';
import './RestockModal.css';

/**
 * Restock/adjust-stock modal. When `inventoryRow` is provided it adjusts
 * that row's quantity; when it's `null` it's a fresh "adjust stock" flow
 * where the admin must first pick a product + store (no inventory record
 * exists for that combo yet), then InventoryForm POSTs a new record.
 *
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {object|null} props.inventoryRow
 */
export function RestockModal({ isOpen, onClose, inventoryRow = null }) {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedStoreId, setSelectedStoreId] = useState('');

  const isCreateMode = !inventoryRow;

  const { data: products = [], isLoading: isLoadingProducts } = useProducts();
  const { data: stores = [], isLoading: isLoadingStores } = useStores();

  function handleClose() {
    setSelectedProductId('');
    setSelectedStoreId('');
    onClose();
  }

  const title = inventoryRow
    ? `Adjust Stock — ${inventoryRow.product?.product_name ?? 'Product'}`
    : 'Adjust Stock';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="sm">
      {isCreateMode ? (
        <div className="restock-modal__pickers">
          <div className="restock-modal__field">
            <label htmlFor="restock-product" className="restock-modal__label">
              Product
            </label>
            <select
              id="restock-product"
              className="form-select"
              value={selectedProductId}
              onChange={(event) => setSelectedProductId(event.target.value)}
              disabled={isLoadingProducts}
            >
              <option value="">Select a product…</option>
              {products.map((product) => (
                <option key={product.id} value={product.product_id}>
                  {product.product_name}
                </option>
              ))}
            </select>
          </div>

          <div className="restock-modal__field">
            <label htmlFor="restock-store" className="restock-modal__label">
              Store
            </label>
            <select
              id="restock-store"
              className="form-select"
              value={selectedStoreId}
              onChange={(event) => setSelectedStoreId(event.target.value)}
              disabled={isLoadingStores}
            >
              <option value="">Select a store…</option>
              {stores.map((store) => (
                <option key={store.id} value={store.store_id}>
                  {store.store_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}

      <InventoryForm
        key={inventoryRow?.id ?? `${selectedProductId}-${selectedStoreId}`}
        inventoryRow={inventoryRow}
        productId={selectedProductId ? Number(selectedProductId) : undefined}
        storeId={selectedStoreId ? Number(selectedStoreId) : undefined}
        onDone={handleClose}
      />
    </Modal>
  );
}

export default RestockModal;
