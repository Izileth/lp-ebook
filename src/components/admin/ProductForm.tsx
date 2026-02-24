// src/components/admin/ProductForm.tsx
import { useState, useEffect } from 'react';
import { useCreateProduct, useUpdateProduct } from '../../hooks/useProductMutations';
import type { Product } from '../../types';

interface ProductFormProps {
  product?: Product;
  onSuccess: () => void;
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    badge: '',
    pages: '',
    image_urls: '',
  });

  const { createProduct, loading: createLoading, error: createError } = useCreateProduct();
  const { updateProduct, loading: updateLoading, error: updateError } = useUpdateProduct();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product?.price || 0,
        category: product.category,
        badge: product?.badge || '',
        pages: product.pages,
        image_urls: product.product_images.map(img => img.image_url).join('\n'),
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'price') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const imageUrlsArray = formData.image_urls.split('\n').filter(url => url.trim() !== '');
    const productData = {
      ...formData,
      price: Number(formData.price),
      image_urls: imageUrlsArray,
    };

    let result;
    if (product) {
      // image_urls update is not directly supported by the hook, so we omit it.
      const { image_urls: _imageUrls, ...updateData } = productData;
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
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          name="price"
          id="price"
          value={formData.price}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <input
          type="text"
          name="category"
          id="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="badge" className="block text-sm font-medium text-gray-700">Badge</label>
        <input
          type="text"
          name="badge"
          id="badge"
          value={formData.badge}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="pages" className="block text-sm font-medium text-gray-700">Pages</label>
        <input
          type="text"
          name="pages"
          id="pages"
          value={formData.pages}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="image_urls" className="block text-sm font-medium text-gray-700">Image URLs (one per line)</label>
        <textarea
          name="image_urls"
          id="image_urls"
          value={formData.image_urls}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="https://example.com/image1.jpg
https://example.com/image2.png"
          disabled={!!product} // The update hook doesn't support changing images
        />
        {product && <p className="text-xs text-gray-500 mt-1">Updating images is not supported via this form. Use the database directly.</p>}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </form>
  );
}
