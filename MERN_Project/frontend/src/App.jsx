import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

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
import AdminHome from './pages/Admin/AdminHome';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminRegister from './pages/Admin/AdminRegister';
import AdminPortal from './pages/Admin/AdminPortal';
import AdminProfile from './pages/Admin/AdminProfile';
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
					<Route path="/auth/login" element={user && user.role === 'customer' ? <Navigate to="/dashboard" /> : <Login />} />
					<Route path="/auth/register" element={user && user.role === 'customer' ? <Navigate to="/dashboard" /> : <Register />} />

					{/* Admin public routes */}
					<Route path="/admin" element={user && user.role === 'admin' ? <Navigate to="/admin/dashboard" /> : <AdminHome />} />
					<Route path="/admin/login" element={user && user.role === 'admin' ? <Navigate to="/admin/dashboard" /> : <AdminLogin />} />
					<Route path="/admin/register" element={user && user.role === 'admin' ? <Navigate to="/admin/dashboard" /> : <AdminRegister />} />

					{/* Protected customer routes - only accessible after customer login */}
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

					{/* Protected admin routes - only accessible after admin login */}
					<Route 
						path="/admin/dashboard" 
						element={
							<AdminProtectedRoute>
								<AdminPortal />
							</AdminProtectedRoute>
						} 
					/>
					<Route 
						path="/admin/profile" 
						element={
							<AdminProtectedRoute>
								<AdminProfile />
							</AdminProtectedRoute>
						} 
					/>
					<Route 
						path="/admin/doormato" 
						element={
							<AdminProtectedRoute>
								<DoormatoPortal />
							</AdminProtectedRoute>
						} 
					/>
					<Route 
						path="/admin/scootigo" 
						element={
							<AdminProtectedRoute>
								<ScootigoPortal />
							</AdminProtectedRoute>
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
