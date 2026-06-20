import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, userRole, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--color-cream)',
        color: 'var(--color-maroon)',
        fontSize: '18px',
        fontWeight: 'bold'
      }}>
        Loading GuideMate Services...
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to dedicated login page if not logged in
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to home/dashboard if user does not have permission
    return <Navigate to="/" replace />;
  }

  return children;
}
