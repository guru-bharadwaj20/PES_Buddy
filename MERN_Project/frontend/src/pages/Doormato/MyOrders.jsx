import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import doormatoService from '../../services/doormatoService';
import socketService from '../../services/socketService';
import { AuthContext } from '../../context/AuthContext';

const MyOrders = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState('all'); // all, pending, accepted, rejected
	const { user } = useContext(AuthContext);

	useEffect(() => {
		if (user) {
			fetchOrders();
			
			// Listen for order status updates
			socketService.onOrderStatus((data) => {
				console.log('📦 Order status updated:', data);
				fetchOrders(); // Refresh orders
			});
		}
		
		return () => {
			socketService.removeListener('order:status');
		};
	}, [user]);

	const fetchOrders = async () => {
		try {
			setLoading(true);
			const response = await doormatoService.getUserOrders();
			setOrders(response);
		} catch (error) {
			console.error('Failed to fetch orders:', error);
		} finally {
			setLoading(false);
		}
	};

	const filteredOrders = orders.filter(order => {
		if (filter === 'all') return true;
		return order.status === filter;
	});

	const getStatusColor = (status) => {
		switch(status) {
			case 'pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500';
			case 'accepted': return 'text-green-500 bg-green-500/10 border-green-500';
			case 'rejected': return 'text-red-500 bg-red-500/10 border-red-500';
			case 'preparing': return 'text-blue-500 bg-blue-500/10 border-blue-500';
			case 'completed': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500';
			default: return 'text-gray-500 bg-gray-500/10 border-gray-500';
		}
	};

	const getStatusIcon = (status) => {
		switch(status) {
			case 'pending': return '⏳';
			case 'accepted': return '✅';
			case 'rejected': return '❌';
			case 'preparing': return '👨‍🍳';
			case 'completed': return '✓';
			default: return '📦';
		}
	};

	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			{/* Header */}
			<div className="mb-8">
				<Link to="/doormato" className="text-light-blue hover:text-blue-400 mb-4 flex items-center space-x-2 w-fit">
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
					</svg>
					<span>Back to Doormato</span>
				</Link>
				<h1 className="text-5xl font-bold text-white mb-4">📦 My Orders</h1>
				<p className="text-xl text-gray-300">Track your food orders and their status</p>
			</div>

			{/* Filter Tabs */}
			<div className="flex space-x-2 mb-8 overflow-x-auto">
				{['all', 'pending', 'accepted', 'rejected', 'completed'].map((filterOption) => (
					<button
						key={filterOption}
						onClick={() => setFilter(filterOption)}
						className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
							filter === filterOption
								? 'bg-light-blue text-white'
								: 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
						}`}
					>
						{filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
					</button>
				))}
			</div>

			{/* Orders List */}
			{loading ? (
				<div className="flex items-center justify-center py-20">
					<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-light-blue"></div>
				</div>
			) : filteredOrders.length === 0 ? (
				<div className="glass rounded-2xl p-12 text-center">
					<div className="text-6xl mb-4">🍽️</div>
					<h3 className="text-2xl font-bold text-white mb-2">No Orders Found</h3>
					<p className="text-gray-400 mb-6">
						{filter === 'all' 
							? "You haven't placed any orders yet" 
							: `No ${filter} orders`}
					</p>
					<Link
						to="/doormato"
						className="inline-block px-6 py-3 bg-light-blue hover:bg-blue-600 text-white font-bold rounded-lg transition-all"
					>
						Browse Canteens
					</Link>
				</div>
			) : (
				<div className="space-y-6">
					{filteredOrders.map((order) => (
						<div key={order._id} className="glass rounded-2xl p-6 hover:border-light-blue/30 border-2 border-transparent transition-all">
							{/* Order Header */}
							<div className="flex justify-between items-start mb-4">
								<div>
									<h3 className="text-xl font-bold text-white mb-1">
										{order.canteenName || 'Order'}
									</h3>
									<p className="text-gray-400 text-sm">
										{new Date(order.createdAt).toLocaleString('en-IN', {
											dateStyle: 'medium',
											timeStyle: 'short'
										})}
									</p>
								</div>
								<div className={`px-4 py-2 rounded-lg border-2 ${getStatusColor(order.status)} font-bold flex items-center space-x-2`}>
									<span>{getStatusIcon(order.status)}</span>
									<span className="uppercase text-sm">{order.status}</span>
								</div>
							</div>

							{/* Order Items */}
							<div className="space-y-2 mb-4">
								{order.items?.map((item, idx) => (
									<div key={idx} className="flex justify-between items-center py-2 border-b border-gray-700/50">
										<div>
											<span className="text-white font-medium">{item.name}</span>
											<span className="text-gray-400 ml-2">x{item.quantity}</span>
										</div>
										<span className="text-white font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
									</div>
								))}
							</div>

							{/* Order Total */}
							<div className="flex justify-between items-center pt-4 border-t-2 border-gray-700">
								<span className="text-gray-300 font-semibold text-lg">Total</span>
								<span className="text-2xl font-bold text-light-blue">₹{order.totalAmount?.toFixed(2)}</span>
							</div>

							{/* Rejection Reason */}
							{order.status === 'rejected' && order.rejectionReason && (
								<div className="mt-4 p-4 bg-red-500/10 border-2 border-red-500/30 rounded-lg">
									<p className="text-red-400 font-semibold mb-1">Rejection Reason:</p>
									<p className="text-gray-300">{order.rejectionReason}</p>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</main>
	);
};

export default MyOrders;
