// src/pages/LoginPage.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '../components/auth/AuthForm';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/admin'); // Redirect to admin dashboard after login/signup
    }
  }, [user, loading, navigate]);

  const handleAuthSuccess = () => {
    navigate('/admin'); // Ensure redirect even if useEffect hasn't fired yet
  }

  return (
    <AuthForm onSuccess={handleAuthSuccess} />
  );
}
