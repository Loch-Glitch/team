import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const csrfToken = Cookies.get('csrftoken'); // Get CSRF token from cookies

  // If no CSRF token, redirect to login
  if (!csrfToken) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, render children
  return children;
};

export default ProtectedRoute;
