import { useNavigate } from 'react-router-dom';
import { ProductForm } from '../components/ProductForm';
import { useCreateProduct } from '../hooks/useProductMutations';

/**
 * Standalone "add product" page. Not wired into `app/routes.jsx` (the real
 * add flow is the `ProductForm` modal opened from `Products.jsx`), but kept
 * as a valid self-contained component matching `architecture.txt`'s file
 * list, ready to be mounted on a future dedicated route.
 */
export function AddProduct() {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();

  async function handleSubmit(values) {
    await createProduct.mutateAsync(values);
  }

  return (
    <ProductForm isOpen onClose={() => navigate(-1)} onSubmit={handleSubmit} />
  );
}

export default AddProduct;
