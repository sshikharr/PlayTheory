/**
 * Main Application Component
 * 
 * Handles routing and authentication configuration using Clerk
 * Provides the top-level structure for the application including:
 * - Authentication provider setup
 * - Route configuration
 * - Protected routes
 * - Default redirects
 * 
 * 
 */

import { ClerkProvider, SignIn } from "@clerk/clerk-react";
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { RequireAuth } from './components/RequireAuth';
import { TopBar } from './components/TopBar'; 

function App() {
  return (
    // Clerk Authentication Provider wrapping the entire application
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      {/* Router setup for client-side navigation */}
      <BrowserRouter>
        <div>
          {/* Global top navigation bar */}
          <TopBar /> 

          {/* Route configuration */}
          <Routes>
            {/* Authentication Routes */}
            <Route
              path="/sign-in/*"  // Wildcard for Clerk's internal routing
              element={
                // Centered container for sign-in form
                <div className="flex items-center justify-center min-h-screen bg-gray-100">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                    {/* Clerk's SignIn component with custom styling */}
                    <SignIn 
                      routing="path"
                      path="/sign-in"
                      redirectUrl="/dashboard"
                      appearance={{
                        elements: {
                          // Custom styling for sign-in form
                          formButtonPrimary: 
                            "bg-blue-600 hover:bg-blue-700 text-white",
                          card: "bg-white"
                        }
                      }}
                    />
                  </div>
                </div>
              }
            />

            {/* Protected Dashboard Route */}
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />

            {/* Default Route Redirects */}
            <Route 
              path="/" 
              element={<Navigate to="/dashboard" replace />} 
            />
            <Route
              path="*"
              element={<Navigate to="/sign-in" replace />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;