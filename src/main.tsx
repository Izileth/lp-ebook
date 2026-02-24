import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Router } from './router'
import { AuthProvider } from './hooks/useAuth';
import { UserProfileProvider } from './hooks/useUserProfile';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <UserProfileProvider>
        <Router />
      </UserProfileProvider>
    </AuthProvider>
  </StrictMode>,
)
