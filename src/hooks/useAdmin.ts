// src/hooks/useAdmin.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAdminStatus() {
      if (!supabase) {
        setError("Database connection not available.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.rpc('is_admin');

      if (error) {
        setError(error.message);
      } else {
        setIsAdmin(data);
      }
      setLoading(false);
    }

    checkAdminStatus();
  }, []);

  return { isAdmin, loading, error };
}
