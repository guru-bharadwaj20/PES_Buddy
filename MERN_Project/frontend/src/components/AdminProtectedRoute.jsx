import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminProtectedRoute = ({ children }) => {
	const { user, token } = useContext(AuthContext);

	// If no token, redirect to admin login
	if (!token) {
		return <Navigate to="/admin/login" replace />;
	}

	// If user is not an admin, redirect to admin login
	if (user && user.role !== 'admin') {
		return <Navigate to="/admin/login" replace />;
	}

	// If authenticated and is admin, render the children
	return children;
};

export default AdminProtectedRoute;
