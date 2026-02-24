// src/components/admin/ProductForm.tsx
import { useState } from 'react';
import { useCreateProduct, useUpdateProduct } from '../../hooks/useProductMutations';
import type { Product } from '../../types';

interface ProductFormProps {
  product?: Product;
  onSuccess: () => void;
}

function buildInitialFormData(product?: Product) {
  return {
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price ?? 0,
    category: product?.category ?? '',
    badge: product?.badge ?? '',
    pages: product?.pages ?? '',
    image_urls: product
      ? product.product_images.map(img => img.image_url).join('\n')
      : '',
  };
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  // 🔐 state inicial derivado da prop (sem effect)
  const [formData, setFormData] = useState(() => buildInitialFormData(product));

  const { createProduct, loading: createLoading, error: createError } = useCreateProduct();
  const { updateProduct, loading: updateLoading, error: updateError } = useUpdateProduct();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const imageUrlsArray = formData.image_urls
      .split('\n')
      .map(url => url.trim())
      .filter(Boolean);

    const productData = {
      ...formData,
      price: Number(formData.price),
      image_urls: imageUrlsArray,
    };

    let result;
    if (product) {
      const { image_urls: _omit, ...updateData } = productData;
      result = await updateProduct(product.id, updateData);
    } else {
      result = await createProduct(productData);
    }

    if (result && !result.error) {
      onSuccess();
    }
  };

  const loading = createLoading || updateLoading;
  const error = createError || updateError;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          required
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Category</label>
        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Badge</label>
        <input
          name="badge"
          value={formData.badge}
          onChange={handleChange}
          required
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Pages</label>
        <input
          name="pages"
          value={formData.pages}
          onChange={handleChange}
          required
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Image URLs (one per line)</label>
        <textarea
          name="image_urls"
          value={formData.image_urls}
          onChange={handleChange}
          rows={3}
          disabled={!!product}
          className="w-full border rounded px-2 py-1"
        />
        {product && (
          <p className="text-xs text-gray-500">
            Updating images is not supported via this form.
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}