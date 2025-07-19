import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('client' | 'sourcer' | 'admin')[];
  requireAuth?: boolean;
  redirectTo?: string;
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles = [],
  requireAuth = true,
  redirectTo = '/login'
}) => {
  const { user, userProfile, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-shadowforce via-shadowforce-light to-shadowforce flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-supernova mx-auto mb-4"></div>
          <p className="text-guardian font-jakarta">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If user is authenticated but no specific roles are required
  if (user && allowedRoles.length === 0) {
    return <>{children}</>;
  }

  // If user is authenticated and roles are specified
  if (user && userProfile && allowedRoles.length > 0) {
    // Check if user's role is allowed
    if (allowedRoles.includes(userProfile.role)) {
      return <>{children}</>;
    } else {
      // Redirect to role-appropriate home page
      const roleHomePath = getRoleHomePath(userProfile.role);
      return <Navigate to={roleHomePath} replace />;
    }
  }

  // If we get here, redirect to login
  return <Navigate to={redirectTo} state={{ from: location }} replace />;
};

// Helper function to get role-appropriate home path
const getRoleHomePath = (role: string): string => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'sourcer':
      return '/sourcer';
    case 'client':
    default:
      return '/';
  }
};

// Convenience components for specific roles
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleBasedRoute allowedRoles={['admin']}>{children}</RoleBasedRoute>
);

export const ClientRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleBasedRoute allowedRoles={['client']}>{children}</RoleBasedRoute>
);

export const SourcerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleBasedRoute allowedRoles={['sourcer']}>{children}</RoleBasedRoute>
);

export const ClientOrAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleBasedRoute allowedRoles={['client', 'admin']}>{children}</RoleBasedRoute>
);

export const SourcerOrAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleBasedRoute allowedRoles={['sourcer', 'admin']}>{children}</RoleBasedRoute>
);

// Public route for unauthenticated users
export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-shadowforce flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-supernova mx-auto mb-4"></div>
          <p className="text-guardian font-jakarta">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated and has a profile, redirect to their role-specific home
  if (user && userProfile) {
    console.log('PublicRoute: User authenticated, redirecting to:', getRoleHomePath(userProfile.role));
    return <Navigate to={getRoleHomePath(userProfile.role)} replace />;
  }

  console.log('PublicRoute: Showing public content');
  return <>{children}</>;
};