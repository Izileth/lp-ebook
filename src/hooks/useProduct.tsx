// src/hooks/useProduct.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Product } from '../types';

export function useProduct(productId: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!productId) {
        setProduct(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      if (!supabase) {
        setError("Database connection not available.");
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*, product_images(*)')
        .eq('id', productId)
        .single();

      if (fetchError) {
        setError(fetchError.message);
        setProduct(null);
      } else {
        setProduct(data as Product | null);
      }
      setLoading(false);
    }

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
}
