// src/hooks/useAuth.tsx
import { useState, useEffect, useContext, createContext } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

// Define the interface for the Auth Context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ user: User | null; error: Error | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ user: User | null; error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
}

// Create the Auth Context with an undefined default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to wrap the application and provide authentication context
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for changes in authentication state
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    // Initial check for the current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    // Clean up the subscription when the component unmounts
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // Function to handle user sign-in with email and password
  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    setUser(data.user); // Update user state after sign-in attempt
    return { user: data.user, error };
  };

  // Function to handle user sign-up with email and password
  const signUpWithEmail = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    setUser(data.user); // Update user state after sign-up attempt
    return { user: data.user, error };
  };

  // Function to handle user sign-out
  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    setUser(null); // Clear user state after sign-out
    return { error };
  };

  // Provide the authentication state and functions to children components
  return (
    <AuthContext.Provider value={{ user, loading, signInWithEmail, signUpWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to consume the authentication context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // This error is thrown if useAuth is used outside of an AuthProvider
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
