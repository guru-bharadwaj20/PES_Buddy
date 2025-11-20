import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import doormatoService from '../../services/doormatoService';

const DoormatoPortal = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState('all'); // all, pending, completed
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = async () => {
		try {
			setLoading(true);
			// Fetch all orders from the backend
			const response = await doormatoService.getAllOrders();
			setOrders(response);
		} catch (error) {
			console.error('Failed to fetch orders:', error);
		} finally {
			setLoading(false);
		}
	};

	const filteredOrders = orders.filter(order => {
		const matchesSearch = order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
							 order.items?.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
		return matchesSearch;
	});

	const getTotalRevenue = () => {
		return orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
	};

	const getOrdersByCanteen = () => {
		const canteenStats = {};
		orders.forEach(order => {
			order.items?.forEach(item => {
				const canteen = item.canteen?.name || 'Unknown';
				if (!canteenStats[canteen]) {
					canteenStats[canteen] = { count: 0, revenue: 0 };
				}
				canteenStats[canteen].count += 1;
				canteenStats[canteen].revenue += item.price * item.quantity;
			});
		});
		return canteenStats;
	};

	const canteenStats = getOrdersByCanteen();

	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			{/* Header */}
			<div className="mb-8">
				<Link to="/admin" className="text-light-blue hover:text-blue-400 mb-4 flex items-center space-x-2 w-fit">
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
					</svg>
					<span>Back to Admin Portal</span>
				</Link>
				<h1 className="text-5xl font-bold text-white mb-4">🍔 Doormato Orders</h1>
				<p className="text-xl text-gray-300">Manage and monitor all food orders</p>
			</div>

			{/* Stats Cards */}
			<div className="grid md:grid-cols-4 gap-6 mb-8">
				<div className="glass rounded-2xl p-6">
					<div className="flex items-center justify-between mb-2">
						<p className="text-gray-400">Total Orders</p>
						<div className="text-3xl">📦</div>
					</div>
					<p className="text-3xl font-bold text-white">{orders.length}</p>
				</div>
				<div className="glass rounded-2xl p-6">
					<div className="flex items-center justify-between mb-2">
						<p className="text-gray-400">Total Revenue</p>
						<div className="text-3xl">💰</div>
					</div>
					<p className="text-3xl font-bold text-green-500">₹{getTotalRevenue().toFixed(2)}</p>
				</div>
				<div className="glass rounded-2xl p-6">
					<div className="flex items-center justify-between mb-2">
						<p className="text-gray-400">Avg Order Value</p>
						<div className="text-3xl">📊</div>
					</div>
					<p className="text-3xl font-bold text-light-blue">
						₹{orders.length > 0 ? (getTotalRevenue() / orders.length).toFixed(2) : '0.00'}
					</p>
				</div>
				<div className="glass rounded-2xl p-6">
					<div className="flex items-center justify-between mb-2">
						<p className="text-gray-400">Active Canteens</p>
						<div className="text-3xl">🏪</div>
					</div>
					<p className="text-3xl font-bold text-white">{Object.keys(canteenStats).length}</p>
				</div>
			</div>

			{/* Canteen Performance */}
			<div className="glass rounded-2xl p-8 mb-8">
				<h2 className="text-2xl font-bold text-white mb-6">Canteen Performance</h2>
				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
					{Object.entries(canteenStats).map(([canteen, stats]) => (
						<div key={canteen} className="bg-gray-800/50 rounded-xl p-6 border-2 border-gray-700">
							<h3 className="text-white font-bold text-lg mb-3">{canteen}</h3>
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<span className="text-gray-400 text-sm">Orders</span>
									<span className="text-white font-semibold">{stats.count}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-gray-400 text-sm">Revenue</span>
									<span className="text-green-500 font-semibold">₹{stats.revenue.toFixed(2)}</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Search and Filter */}
			<div className="glass rounded-2xl p-6 mb-8">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
					<div className="relative grow max-w-md">
						<input
							type="text"
							placeholder="Search by user name or item..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border-2 border-gray-700 text-white rounded-xl focus:border-light-blue focus:ring-4 focus:ring-light-blue/20 transition-all outline-none"
						/>
						<svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</div>
					<button
						onClick={fetchOrders}
						className="px-6 py-3 bg-light-blue hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg"
					>
						Refresh Data
					</button>
				</div>
			</div>

			{/* Orders Table */}
			<div className="glass rounded-2xl p-8">
				<h2 className="text-2xl font-bold text-white mb-6">All Orders</h2>
				
				{loading ? (
					<div className="text-center py-12">
						<div className="text-6xl mb-4">⏳</div>
						<p className="text-xl text-gray-400">Loading orders...</p>
					</div>
				) : filteredOrders.length === 0 ? (
					<div className="text-center py-12">
						<div className="text-6xl mb-4">📭</div>
						<p className="text-xl text-gray-400">No orders found</p>
						<p className="text-gray-500 mt-2">Orders will appear here once customers start ordering</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-gray-700">
									<th className="text-left py-4 px-4 text-gray-400 font-semibold">Order ID</th>
									<th className="text-left py-4 px-4 text-gray-400 font-semibold">Customer</th>
									<th className="text-left py-4 px-4 text-gray-400 font-semibold">Items</th>
									<th className="text-left py-4 px-4 text-gray-400 font-semibold">Canteen(s)</th>
									<th className="text-left py-4 px-4 text-gray-400 font-semibold">Date & Time</th>
									<th className="text-right py-4 px-4 text-gray-400 font-semibold">Total Amount</th>
								</tr>
							</thead>
							<tbody>
								{filteredOrders.slice().reverse().map((order) => {
									const date = new Date(order.createdAt || order.date);
									const canteens = [...new Set(order.items?.map(item => item.canteen?.name || 'Unknown'))];
									
									return (
										<tr key={order._id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-all">
											<td className="py-4 px-4">
												<span className="text-light-blue font-mono text-sm">#{order._id?.slice(-8)}</span>
											</td>
											<td className="py-4 px-4">
												<div>
													<p className="text-white font-semibold">{order.user?.name || 'Guest'}</p>
													<p className="text-gray-500 text-sm">{order.user?.srn || 'N/A'}</p>
												</div>
											</td>
											<td className="py-4 px-4">
												<div className="space-y-1">
													{order.items?.map((item, idx) => (
														<div key={idx} className="text-sm">
															<span className="text-white">{item.quantity}x {item.name}</span>
														</div>
													))}
												</div>
											</td>
											<td className="py-4 px-4">
												<div className="space-y-1">
													{canteens.map((canteen, idx) => (
														<div key={idx} className="text-sm text-gray-400">{canteen}</div>
													))}
												</div>
											</td>
											<td className="py-4 px-4">
												<div>
													<p className="text-white font-semibold">{date.toLocaleDateString()}</p>
													<p className="text-gray-500 text-sm">{date.toLocaleTimeString()}</p>
												</div>
											</td>
											<td className="py-4 px-4 text-right">
												<span className="text-2xl font-bold text-green-500">₹{(order.totalAmount || 0).toFixed(2)}</span>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</main>
	);
};

export default DoormatoPortal;
