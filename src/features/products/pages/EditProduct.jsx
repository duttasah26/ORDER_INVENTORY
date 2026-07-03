import { useNavigate, useParams } from 'react-router-dom';
import { Loader } from '@shared/components/common/Loader';
import { EmptyState } from '@shared/components/common/EmptyState';
import { useProducts } from '../hooks/useProducts';
import { useUpdateProduct } from '../hooks/useProductMutations';
import { ProductForm } from '../components/ProductForm';

/**
 * Standalone "edit product" page. Not wired into `app/routes.jsx` (the real
 * edit flow is the `ProductForm` modal opened from `Products.jsx`), but kept
 * as a valid self-contained component matching `architecture.txt`'s file
 * list, ready to be mounted on a future dedicated route (e.g. `/admin/products/:id/edit`).
 */
export function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: products, isLoading } = useProducts();
  const updateProduct = useUpdateProduct();

  const product = (products ?? []).find((item) => String(item.id) === id);

  if (isLoading) {
    return <Loader size="md" />;
  }

  if (!product) {
    return <EmptyState heading="Product not found" body="This product may have been removed." />;
  }

  async function handleSubmit(values) {
    await updateProduct.mutateAsync({ id: product.id, ...values });
  }

  return (
    <ProductForm isOpen onClose={() => navigate(-1)} initialValues={product} onSubmit={handleSubmit} />
  );
}

export default EditProduct;
