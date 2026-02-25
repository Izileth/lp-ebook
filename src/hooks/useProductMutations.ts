// src/hooks/useProductMutations.ts
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// --- useCreateProduct ---
export function useCreateProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = async (productData: {
    name: string;
    description: string;
    price: number;
    discount_price?: number;
    slug?: string;
    language: string;
    rating: number;
    category: string;
    badge: string;
    pages: string;
    image_urls: string[];
    checkout_url?: string;
    access_url?: string;
    share_url?: string;
  }) => {
    setLoading(true);
    setError(null);

    if (!supabase) {
      setError("Database connection not available.");
      setLoading(false);
      return null;
    }

    const { data, error } = await supabase.rpc('create_product_with_images', productData);

    if (error) {
      setError(error.message);
    }

    setLoading(false);
    return { data, error };
  };

  return { createProduct, loading, error };
}

// --- useUpdateProduct ---
export function useUpdateProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProduct = async (productId: number, productData: Partial<{
    name: string;
    description: string;
    price: number;
    discount_price: number;
    slug: string;
    language: string;
    rating: number;
    category: string;
    badge: string;
    pages: string;
    image_urls: string[];
    checkout_url: string;
    access_url: string;
    share_url: string;
  }>) => {
    setLoading(true);
    setError(null);

    if (!supabase) {
      setError("Database connection not available.");
      setLoading(false);
      return null;
    }

    // Note: This only updates the products table.
    // Updating images would require more complex logic, like deleting old images and adding new ones.
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', productId);

    if (error) {
      setError(error.message);
    }

    setLoading(false);
    return { data, error };
  };

  return { updateProduct, loading, error };
}

// --- useDeleteProduct ---
export function useDeleteProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteProduct = async (productId: number) => {
    setLoading(true);
    setError(null);

    if (!supabase) {
      setError("Database connection not available.");
      setLoading(false);
      return null;
    }

    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      setError(error.message);
    }

    setLoading(false);
    return { data, error };
  };

  return { deleteProduct, loading, error };
}
