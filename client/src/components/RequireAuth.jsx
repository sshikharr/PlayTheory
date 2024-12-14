// src/components/RequireAuth.jsx
import { Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

export function RequireAuth({ children }) {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    // Optionally, render a loading indicator
    return null;
  }

  if (!user) {
    // User is not signed in, redirect to sign-in page
    return <Navigate to="/sign-in" replace />;
  }

  return children;
}