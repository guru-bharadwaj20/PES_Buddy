import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ExpenseTracker from './pages/ExpenseTracker';
import NotFound from './pages/NotFound';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import CanteenList from './pages/Doormato/CanteenList';
import Menu from './pages/Doormato/Menu';
import Cart from './pages/Doormato/Cart';
import Scootigo from './pages/Scootigo/Scootigo';
import AdminPortal from './pages/Admin/AdminPortal';
import DoormatoPortal from './pages/Admin/DoormatoPortal';
import ScootigoPortal from './pages/Admin/ScootigoPortal';

const App = () => {
	const { user } = useContext(AuthContext);

	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-1">
				<Routes>
					{/* Public routes */}
					<Route path="/" element={<Home />} />
					<Route path="/about" element={<About />} />
					<Route path="/contact" element={<Contact />} />
					<Route path="/auth/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
					<Route path="/auth/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

					{/* Protected routes - only accessible after login */}
					<Route 
						path="/dashboard" 
						element={
							<ProtectedRoute>
								<Dashboard />
							</ProtectedRoute>
						} 
					/>
					<Route 
						path="/doormato" 
						element={
							<ProtectedRoute>
								<CanteenList />
							</ProtectedRoute>
						} 
					/>
					<Route 
						path="/doormato/menu/:canteenId" 
						element={
							<ProtectedRoute>
								<Menu />
							</ProtectedRoute>
						} 
					/>
					<Route 
						path="/doormato/cart" 
						element={
							<ProtectedRoute>
								<Cart />
							</ProtectedRoute>
						} 
					/>
					<Route 
						path="/scootigo" 
						element={
							<ProtectedRoute>
								<Scootigo />
							</ProtectedRoute>
						} 
					/>
					<Route 
						path="/expense-tracker" 
						element={
							<ProtectedRoute>
								<ExpenseTracker />
							</ProtectedRoute>
						} 
					/>
					<Route 
						path="/profile" 
						element={
							<ProtectedRoute>
								<Profile />
							</ProtectedRoute>
						} 
					/>
					<Route 
						path="/admin" 
						element={
							<ProtectedRoute>
								<AdminPortal />
							</ProtectedRoute>
						} 
					/>
					<Route 
						path="/admin/doormato" 
						element={
							<ProtectedRoute>
								<DoormatoPortal />
							</ProtectedRoute>
						} 
					/>
					<Route 
						path="/admin/scootigo" 
						element={
							<ProtectedRoute>
								<ScootigoPortal />
							</ProtectedRoute>
						} 
					/>

					<Route path="*" element={<NotFound />} />
				</Routes>
			</main>
			<Footer />
		</div>
	);
};

export default App;
