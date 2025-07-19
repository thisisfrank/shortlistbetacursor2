import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Layout } from './components/layout/Layout';

// Route Guards
import { RoleBasedRoute } from './components/auth/RoleBasedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AdminPage } from './pages/AdminPage';
import { ClientPage } from './pages/ClientPage';
import { SourcerPage } from './pages/SourcerPage';
import { CandidatesPage } from './pages/CandidatesPage';

// Auth Pages
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';

// Subscription Pages
import { SubscriptionPlans } from './components/subscription/SubscriptionPlans';
import { SubscriptionSuccess } from './components/subscription/SubscriptionSuccess';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            {/* Landing Page - accessible to everyone, no auth required */}
            <Route path="/" element={<LandingPage />} />
            
            {/* All other routes use Layout */}
            <Route path="*" element={
              <Layout>
                <Routes>
                  {/* Public Routes - accessible to all */}
                  <Route path="/login" element={
                    <RoleBasedRoute requireAuth={false}>
                      <LoginPage />
                    </RoleBasedRoute>
                  } />
                  <Route path="/signup" element={
                    <RoleBasedRoute requireAuth={false}>
                      <SignupPage />
                    </RoleBasedRoute>
                  } />
                  
                  {/* Role-Specific Routes */}
                  <Route path="/admin" element={
                    <RoleBasedRoute allowedRoles={['admin']}>
                      <AdminPage />
                    </RoleBasedRoute>
                  } />
                  <Route path="/sourcer" element={
                    <RoleBasedRoute allowedRoles={['sourcer']}>
                      <SourcerPage />
                    </RoleBasedRoute>
                  } />
                  
                  {/* Client Routes */}
                  <Route path="/client" element={
                    <RoleBasedRoute allowedRoles={['client']}>
                      <ClientPage />
                    </RoleBasedRoute>
                  } />
                  <Route path="/candidates" element={
                    <RoleBasedRoute allowedRoles={['client', 'admin']}>
                      <CandidatesPage />
                    </RoleBasedRoute>
                  } />
                  
                  {/* Subscription Routes - Client Only */}
                  <Route path="/subscription" element={
                    <RoleBasedRoute allowedRoles={['client']}>
                      <SubscriptionPlans />
                    </RoleBasedRoute>
                  } />
                  <Route path="/subscription/success" element={
                    <RoleBasedRoute allowedRoles={['client']}>
                      <SubscriptionSuccess />
                    </RoleBasedRoute>
                  } />
                </Routes>
              </Layout>
            } />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;