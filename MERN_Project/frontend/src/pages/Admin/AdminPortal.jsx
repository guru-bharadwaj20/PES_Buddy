import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const AdminPortal = () => {
	const navigate = useNavigate();
	const { token } = useContext(AuthContext);
	const [stats, setStats] = useState({
		totalOrders: 0,
		totalBookings: 0,
		totalUsers: 0,
		totalRevenue: 0
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const response = await api.get('/admin/stats/dashboard', {
					headers: { Authorization: `Bearer ${token}` }
				});
				setStats(response.data);
			} catch (error) {
				console.error('Error fetching stats:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, [token]);

	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			{/* Header */}
			<div className="mb-12 text-center">
				<h1 className="text-6xl font-bold text-white mb-6">🏢 Admin Portal</h1>
				<p className="text-2xl text-gray-300">
					Manage and monitor all platform activities
				</p>
			</div>

			{/* Portal Grid */}
			<div className="grid md:grid-cols-2 gap-8 mb-12">
				{/* Doormato Portal */}
				<div 
					onClick={() => navigate('/admin/doormato')}
					className="glass rounded-2xl p-10 hover:border-light-blue/50 border-2 border-transparent transition-all cursor-pointer group"
				>
					<div className="text-center">
						<div className="text-7xl mb-6 group-hover:scale-110 transition-transform">🍔</div>
						<h2 className="text-3xl font-bold text-white mb-4">Doormato Orders</h2>
						<p className="text-gray-400 text-lg mb-6">
							View and manage all food orders from campus canteens
						</p>
						<div className="flex items-center justify-center space-x-2 text-light-blue font-semibold">
							<span>Access Portal</span>
							<svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
							</svg>
						</div>
					</div>
				</div>

				{/* Scootigo Portal */}
				<div 
					onClick={() => navigate('/admin/scootigo')}
					className="glass rounded-2xl p-10 hover:border-light-blue/50 border-2 border-transparent transition-all cursor-pointer group"
				>
					<div className="text-center">
						<div className="text-7xl mb-6 group-hover:scale-110 transition-transform">🛵</div>
						<h2 className="text-3xl font-bold text-white mb-4">Scootigo Bookings</h2>
						<p className="text-gray-400 text-lg mb-6">
							View and manage all scooter ride bookings
						</p>
						<div className="flex items-center justify-center space-x-2 text-light-blue font-semibold">
							<span>Access Portal</span>
							<svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
							</svg>
						</div>
					</div>
				</div>
			</div>

			{/* Stats Overview */}
			<div className="glass rounded-2xl p-8">
				<h3 className="text-2xl font-bold text-white mb-6">Quick Stats</h3>
				{loading ? (
					<div className="flex items-center justify-center py-12">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
					</div>
				) : (
					<div className="grid md:grid-cols-4 gap-6">
						<div className="bg-gray-800/50 rounded-xl p-6 border-2 border-gray-700 hover:border-yellow-500/50 transition-all">
							<div className="text-3xl mb-2">📊</div>
							<p className="text-gray-400 text-sm mb-2">Total Orders</p>
							<p className="text-3xl font-bold text-yellow-500">{stats.totalOrders}</p>
						</div>
						<div className="bg-gray-800/50 rounded-xl p-6 border-2 border-gray-700 hover:border-yellow-500/50 transition-all">
							<div className="text-3xl mb-2">🚗</div>
							<p className="text-gray-400 text-sm mb-2">Total Rides</p>
							<p className="text-3xl font-bold text-yellow-500">{stats.totalBookings}</p>
						</div>
						<div className="bg-gray-800/50 rounded-xl p-6 border-2 border-gray-700 hover:border-yellow-500/50 transition-all">
							<div className="text-3xl mb-2">👥</div>
							<p className="text-gray-400 text-sm mb-2">Active Users</p>
							<p className="text-3xl font-bold text-yellow-500">{stats.totalUsers}</p>
						</div>
						<div className="bg-gray-800/50 rounded-xl p-6 border-2 border-gray-700 hover:border-yellow-500/50 transition-all">
							<div className="text-3xl mb-2">💰</div>
							<p className="text-gray-400 text-sm mb-2">Revenue</p>
							<p className="text-3xl font-bold text-yellow-500">₹{stats.totalRevenue.toFixed(2)}</p>
						</div>
					</div>
				)}
			</div>
		</main>
	);
};

export default AdminPortal;
