import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-space-sm">
          <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          <span className="font-label-md text-label-md text-on-surface-variant font-semibold">
            Authenticating MBMC Session...
          </span>
        </div>
      </div>
    );
  }

  // Check state or direct persistent localStorage session before deciding to redirect
  const effectiveUser = user || (() => {
    try {
      const stored = localStorage.getItem('nagar_connect_mock_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  const effectiveRole = role || effectiveUser?.role || 'citizen';

  // If user is not logged in, redirect to login
  if (!effectiveUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is specified and does not match, redirect to unauthorized/appropriate dashboard
  if (allowedRoles.length > 0 && !allowedRoles.includes(effectiveRole)) {
    if (effectiveRole === 'admin') return <Navigate to="/admin" replace />;
    if (effectiveRole === 'field_worker' || effectiveRole === 'officer') return <Navigate to="/field" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

