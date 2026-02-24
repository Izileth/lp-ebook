// src/components/auth/AuthForm.tsx
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface AuthFormProps {
  onSuccess: () => void;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [signUpSuccess, setSignUpSuccess] = useState(false); // New state for sign-up success message

  const { signInWithEmail, signUpWithEmail, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSignUpSuccess(false); // Reset sign-up success message on new submission

    if (isSignUp) {
      const { user, error } = await signUpWithEmail(email, password);
      if (error) {
        setFormError(error.message);
      } else if (user) {
        setSignUpSuccess(true); // Show success message for sign-up
      }
    } else {
      const { user, error } = await signInWithEmail(email, password);
      if (error) {
        setFormError(error.message);
      } else if (user) {
        onSuccess(); // Redirect only on successful sign-in
      }
    }
  };

  // If sign-up was successful, show a message and prevent further interaction
  if (signUpSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded shadow-md w-full max-w-sm text-center">
          <h2 className="text-2xl font-bold mb-4">Registration Successful!</h2>
          <p className="text-gray-700 mb-4">
            Please check your email inbox (and spam folder) to verify your account.
          </p>
          <button
            onClick={() => {
              setSignUpSuccess(false);
              setIsSignUp(false); // Switch to login view after successful sign-up
            }}
            className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isSignUp ? 'Sign Up' : 'Login'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {formError && <p className="text-red-500 text-sm">{formError}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Login')}
          </button>
        </form>
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="mt-4 w-full text-center text-sm text-indigo-600 hover:text-indigo-800"
        >
          {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
        </button>
      </div>
    </div>
  );
}
