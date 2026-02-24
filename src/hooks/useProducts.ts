// src/hooks/useProducts.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Product} from '../types';

// The Book type from src/types.ts is not up to date with the database schema.
// I will assume a more updated type for now.

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      if (!supabase) {
        setError("Database connection not available.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(*)');

      if (error) {
        setError(error.message);
      } else {
        setProducts(data as Product[]);
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);

  return { products, loading, error };
}
