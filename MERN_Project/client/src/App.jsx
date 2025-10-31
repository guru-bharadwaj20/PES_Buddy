import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Dashboard from './pages/Dashboard';
import ExpenseTracker from './pages/ExpenseTracker';
import NotFound from './pages/NotFound';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import CanteenList from './pages/Doormato/CanteenList';
import Menu from './pages/Doormato/Menu';
import Cart from './pages/Doormato/Cart';
import Scootigo from './pages/Scootigo/Scootigo';

const App = () => {
	return (
			<div className="app">
				<Header />
				<main>
				<Routes>
					<Route path="/" element={<Dashboard />} />
					<Route path="/auth/login" element={<Login />} />
					<Route path="/auth/register" element={<Register />} />

					<Route path="/doormato" element={<CanteenList />} />
					<Route path="/doormato/menu/:canteenId" element={<Menu />} />
					<Route path="/doormato/cart" element={<Cart />} />

					<Route path="/scootigo" element={<Scootigo />} />

					<Route path="/expense" element={<ExpenseTracker />} />

					<Route path="*" element={<NotFound />} />
				</Routes>
			</main>
			<Footer />
		</div>
	);
};

export default App;
