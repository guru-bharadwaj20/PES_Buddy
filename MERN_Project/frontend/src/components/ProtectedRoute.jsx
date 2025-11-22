import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
	const { user, token } = useContext(AuthContext);
	
	// If no token, redirect to customer login
	if (!token) {
		return <Navigate to="/auth/login" replace />;
	}
	
	// If user is admin, they shouldn't access customer routes
	if (user && user.role === 'admin') {
		return <Navigate to="/admin/dashboard" replace />;
	}
	
	// If authenticated and is customer, render the children
	return children;
};

export default ProtectedRoute;
