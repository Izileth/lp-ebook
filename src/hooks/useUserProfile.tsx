// src/hooks/useUserProfile.tsx
import { useState, useEffect, useContext, createContext, useCallback } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth'; // To get the current user
import type { Profile } from '../types';

interface UserProfileContextType {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  refetchProfile: () => void; // Function to manually refetch profile
  updateProfile: (updates: Partial<Profile>) => Promise<{ data: Profile | null; error: Error | null }>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single(); // Expecting one profile per user

    if (error) {
      setError(error.message);
      setProfile(null);
    } else {
      setProfile(data as Profile);
    }
    setLoading(false);
  }, [user]); // Only re-create fetchProfile if user changes

  useEffect(() => {
    if (!authLoading) {
      (async () => {
        await fetchProfile();
      })();
    }
  }, [user?.id, authLoading, fetchProfile]); // Re-fetch when user changes or auth loading finishes

  const refetchProfile = () => {
    fetchProfile();
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { data: null, error: new Error('User not authenticated') };

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (!error) {
      setProfile(data as Profile);
    }

    return { data, error };
  };

  return (
    <UserProfileContext.Provider value={{ profile, loading, error, refetchProfile, updateProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}
