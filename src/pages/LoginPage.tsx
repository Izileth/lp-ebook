// src/pages/LoginPage.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '../components/auth/AuthForm';
import { useAuth } from '../hooks/useAuth';
import { useAdmin } from '../hooks/useAdmin'; // Import useAdmin

export function LoginPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin(); // Use useAdmin

  useEffect(() => {
    // Only proceed if both auth and admin status are loaded and user is present
    if (!authLoading && user && !adminLoading) {
      if (isAdmin) {
        navigate('/admin'); // Admin to dashboard
      } else {
        navigate('/'); // Regular user to home
      }
    }
  }, [user, authLoading, isAdmin, adminLoading, navigate]); // Add isAdmin and adminLoading to dependencies

  // This function is called by AuthForm *only* on successful login (not sign-up)
  // We rely on the useEffect for redirection after login.
  // The useEffect will trigger when user and adminLoading states are updated.
  const handleAuthSuccess = () => {
    // No direct navigation here. useEffect will handle it.
  }

  // If we are still loading authentication or admin status, show a loading indicator
  if (authLoading || adminLoading) {
    return <div>Loading authentication status...</div>;
  }

  return (
    <AuthForm onSuccess={handleAuthSuccess} />
  );
}
