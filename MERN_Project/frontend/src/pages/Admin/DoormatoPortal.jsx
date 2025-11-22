import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import doormatoService from '../../services/doormatoService';
import socketService from '../../services/socketService';

const REJECTION_REASONS = [
	'Item out of stock',
	'Canteen closed',
	'Unable to fulfill order',
	'Payment issue',
	'Invalid order details',
	'Other'
];

const DoormatoPortal = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState('all'); // all, pending, completed
	const [searchTerm, setSearchTerm] = useState('');
	const [notification, setNotification] = useState(null);
	const [showRejectModal, setShowRejectModal] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [rejectionReason, setRejectionReason] = useState('');
	const [processingOrder, setProcessingOrder] = useState(null);

	useEffect(() => {
		fetchOrders();
		
		// Listen for real-time order updates
		socketService.onNewOrder((data) => {
			console.log('📦 New order received in admin portal:', data);
			setNotification(`New order from ${data.userName} - ₹${data.total}`);
			setTimeout(() => setNotification(null), 4000);
			fetchOrders(); // Refresh orders list
		});
		
		// Cleanup listener on unmount
		return () => {
			socketService.removeListener('order:new');
		};
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

	const handleAcceptOrder = async (orderId) => {
		try {
			setProcessingOrder(orderId);
			await doormatoService.updateOrderStatus(orderId, 'accepted');
			setNotification('Order accepted successfully!');
			setTimeout(() => setNotification(null), 3000);
			fetchOrders();
		} catch (error) {
			console.error('Failed to accept order:', error);
			alert('Failed to accept order');
		} finally {
			setProcessingOrder(null);
		}
	};

	const handleRejectOrder = (order) => {
		setSelectedOrder(order);
		setRejectionReason('');
		setShowRejectModal(true);
	};

	const confirmRejectOrder = async () => {
		if (!rejectionReason) {
			alert('Please select a rejection reason');
			return;
		}
		try {
			setProcessingOrder(selectedOrder._id);
			await doormatoService.updateOrderStatus(selectedOrder._id, 'rejected', rejectionReason);
			setNotification('Order rejected');
			setTimeout(() => setNotification(null), 3000);
			setShowRejectModal(false);
			setSelectedOrder(null);
			fetchOrders();
		} catch (error) {
			console.error('Failed to reject order:', error);
			alert('Failed to reject order');
		} finally {
			setProcessingOrder(null);
		}
	};

	const getStatusBadge = (status) => {
		const styles = {
			pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500',
			accepted: 'bg-green-500/20 text-green-500 border-green-500',
			rejected: 'bg-red-500/20 text-red-500 border-red-500',
			preparing: 'bg-blue-500/20 text-blue-500 border-blue-500',
			completed: 'bg-emerald-500/20 text-emerald-500 border-emerald-500'
		};
		return styles[status] || styles.pending;
	};

	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			{/* Real-time notification */}
			{notification && (
				<div className="fixed top-4 right-4 z-50 animate-slide-in">
					<div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center space-x-3">
						<div className="text-2xl animate-bounce">🔔</div>
						<div>
							<p className="font-bold">New Order!</p>
							<p className="text-sm">{notification}</p>
						</div>
					</div>
				</div>
			)}
			
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
								<th className="text-left py-4 px-4 text-gray-400 font-semibold">Status</th>
								<th className="text-right py-4 px-4 text-gray-400 font-semibold">Total Amount</th>
								<th className="text-center py-4 px-4 text-gray-400 font-semibold">Actions</th>
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
										<td className="py-4 px-4">
											<span className={`px-3 py-1 rounded-lg border-2 text-sm font-bold uppercase ${getStatusBadge(order.status)}`}>
												{order.status || 'pending'}
											</span>
										</td>
										<td className="py-4 px-4 text-right">
											<span className="text-2xl font-bold text-green-500">₹{(order.totalAmount || 0).toFixed(2)}</span>
										</td>
										<td className="py-4 px-4">
											{order.status === 'pending' && (
												<div className="flex items-center justify-center space-x-2">
													<button
														onClick={() => handleAcceptOrder(order._id)}
														disabled={processingOrder === order._id}
														className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all disabled:opacity-50"
													>
														{processingOrder === order._id ? '...' : '✓ Accept'}
													</button>
													<button
														onClick={() => handleRejectOrder(order)}
														disabled={processingOrder === order._id}
														className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all disabled:opacity-50"
													>
														{processingOrder === order._id ? '...' : '✕ Reject'}
													</button>
												</div>
											)}
											{order.status !== 'pending' && (
												<div className="text-center text-gray-500 text-sm">-</div>
											)}
										</td>
									</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* Rejection Modal */}
			{showRejectModal && (
				<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
					<div className="glass rounded-2xl p-8 max-w-md w-full border-2 border-red-500/30">
						<h3 className="text-2xl font-bold text-white mb-4">Reject Order</h3>
						<p className="text-gray-300 mb-6">
							Order from <span className="font-bold text-white">{selectedOrder?.user?.name}</span>
						</p>
						<div className="space-y-3 mb-6">
							<label className="block text-white font-semibold mb-2">Select Rejection Reason:</label>
							{REJECTION_REASONS.map((reason) => (
								<label key={reason} className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-all">
									<input
										type="radio"
										name="rejectionReason"
										value={reason}
										checked={rejectionReason === reason}
										onChange={(e) => setRejectionReason(e.target.value)}
										className="w-4 h-4 text-red-500"
									/>
									<span className="text-white">{reason}</span>
								</label>
							))}
						</div>
						<div className="flex space-x-3">
							<button
								onClick={confirmRejectOrder}
								disabled={!rejectionReason || processingOrder}
								className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{processingOrder ? 'Processing...' : 'Confirm Reject'}
							</button>
							<button
								onClick={() => {
									setShowRejectModal(false);
									setSelectedOrder(null);
									setRejectionReason('');
								}}
								disabled={processingOrder}
								className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</main>
	);
};

export default DoormatoPortal;
