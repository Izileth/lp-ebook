// src/components/admin/AdminDashboard.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAdmin } from '../../hooks/useAdmin';
import { ProductList } from './ProductList';
import { ProductForm } from './ProductForm';
import type { Product } from '../../types';

type View = 'list' | 'create' | 'edit';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading, error: adminError } = useAdmin();
  const [view, setView] = useState<View>('list');
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setView('edit');
  };

  const handleCreateNew = () => {
    setSelectedProduct(undefined);
    setView('create');
  };

  const handleSuccess = () => {
    setView('list');
    setRefreshKey(oldKey => oldKey + 1);
  };

  const handleCancel = () => {
    setView('list');
  }

  if (authLoading || adminLoading) {
    return <div>Loading authentication and admin status...</div>;
  }

  if (adminError) {
    return <div>Error checking admin status: {adminError}</div>;
  }

  if (!user) {
    return null;
  }

  if (!isAdmin) {
    return <div>Access Denied. You must be an admin to view this page.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {view === 'list' && (
        <>
          <button
            onClick={handleCreateNew}
            className="mb-4 inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700"
          >
            Create New Product
          </button>
          <ProductList key={refreshKey} onEdit={handleEdit} onSuccess={handleSuccess} />
        </>
      )}

      {(view === 'create' || view === 'edit') && (
        <div>
           <button onClick={handleCancel} className="mb-4 text-indigo-600 hover:text-indigo-900">
             &larr; Back to list
           </button>
          <h2 className="text-xl font-semibold mb-2">{view === 'create' ? 'Create Product' : 'Edit Product'}</h2>
          <ProductForm product={selectedProduct} onSuccess={handleSuccess} />
        </div>
      )}
    </div>
  );
}
