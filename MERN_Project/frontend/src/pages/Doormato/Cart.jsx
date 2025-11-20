import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import doormatoService from '../../services/doormatoService';
import { AuthContext } from '../../context/AuthContext';

const Cart = () => {
	const { items, removeItem, clear, addItem } = useContext(CartContext);
	const { user } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [messageType, setMessageType] = useState('');
	const navigate = useNavigate();

	const total = items.reduce((s, i) => s + (i.price * i.qty), 0);
	const deliveryFee = total > 0 ? 10 : 0;
	const grandTotal = total + deliveryFee;

	const updateQuantity = (item, change) => {
		if (item.qty + change <= 0) {
			removeItem(item.menuItem);
		} else {
			addItem({ ...item, qty: change });
		}
	};

	const handlePlaceOrder = async () => {
		if (!user) {
			setMessage('Please login to place order');
			setMessageType('error');
			return;
		}
		setLoading(true);
		setMessage('');
		try {
			const payload = { 
				canteenName: items[0]?.canteenName || 'Unknown', 
				items: items.map(i => ({ menuItem: i.menuItem, qty: i.qty })),
				totalAmount: grandTotal
			};
			await doormatoService.createOrder(payload);
			setMessage('🎉 Order placed successfully! You will be notified when it\'s ready.');
			setMessageType('success');
			setTimeout(() => {
				clear();
				navigate('/dashboard');
			}, 2000);
		} catch (err) {
			setMessage(err.response?.data?.message || 'Failed to place order');
			setMessageType('error');
		} finally { 
			setLoading(false); 
		}
	};

	if (items.length === 0) {
		return (
			<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="text-center">
					<div className="glass rounded-2xl p-12">
						<div className="text-6xl mb-4">🛒</div>
						<h2 className="text-3xl font-bold text-white mb-4">Your cart is empty</h2>
						<p className="text-gray-400 mb-8">Add some delicious items from our canteens!</p>
						<Link 
							to="/doormato"
							className="inline-block px-8 py-3 bg-light-blue hover:bg-blue-600 text-white font-bold rounded-lg transition-all"
						>
							Browse Canteens
						</Link>
					</div>
				</div>
			</main>
		);
	}

	return (
		<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			{/* Header */}
			<div className="mb-8">
				<button 
					onClick={() => navigate('/doormato')}
					className="text-light-blue hover:text-blue-400 mb-4 flex items-center space-x-2"
				>
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
					</svg>
					<span>Continue Shopping</span>
				</button>
				<h2 className="text-4xl font-bold text-white mb-2">Your Cart</h2>
				<p className="text-gray-300">{items.length} item{items.length > 1 ? 's' : ''} in your cart</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Cart Items */}
				<div className="lg:col-span-2 space-y-4">
					{items.map(item => (
						<div key={item.menuItem} className="glass rounded-2xl p-6 card-hover">
							<div className="flex items-center space-x-4">
								{/* Item Image */}
								<div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
									<img 
										src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop'} 
										alt={item.name}
										className="w-full h-full object-cover"
									/>
								</div>

								{/* Item Details */}
								<div className="grow">
									<h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
									<p className="text-gray-400 text-sm mb-2">{item.canteenName}</p>
									<div className="flex items-center space-x-3">
										<span className="text-xl font-bold text-light-blue">₹{item.price}</span>
										
										{/* Quantity Controls */}
										<div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg p-1">
											<button 
												onClick={() => updateQuantity(item, -1)}
												className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-all"
											>
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
												</svg>
											</button>
											<span className="text-white font-bold w-8 text-center">{item.qty}</span>
											<button 
												onClick={() => updateQuantity(item, 1)}
												className="w-8 h-8 flex items-center justify-center rounded-lg bg-light-blue hover:bg-blue-600 text-white transition-all"
											>
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
												</svg>
											</button>
										</div>
									</div>
								</div>

								{/* Item Total & Remove */}
								<div className="flex flex-col items-end space-y-2">
									<span className="text-2xl font-bold text-white">₹{item.price * item.qty}</span>
									<button 
										onClick={() => removeItem(item.menuItem)}
										className="text-light-red hover:text-red-600 text-sm font-semibold transition-all"
									>
										Remove
									</button>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Order Summary */}
				<div className="lg:col-span-1">
					<div className="glass rounded-2xl p-6 sticky top-24">
						<h3 className="text-2xl font-bold text-white mb-6">Order Summary</h3>
						
						<div className="space-y-3 mb-6">
							<div className="flex justify-between text-gray-300">
								<span>Subtotal</span>
								<span>₹{total}</span>
							</div>
							<div className="flex justify-between text-gray-300">
								<span>Delivery Fee</span>
								<span>₹{deliveryFee}</span>
							</div>
							<div className="border-t border-gray-700 pt-3 flex justify-between text-xl font-bold text-white">
								<span>Total</span>
								<span>₹{grandTotal}</span>
							</div>
						</div>

						{message && (
							<div className={`mb-4 p-4 rounded-xl ${
								messageType === 'success' 
									? 'bg-green-500/20 border border-green-500/30 text-green-400' 
									: 'bg-red-500/20 border border-red-500/30 text-red-400'
							}`}>
								{message}
							</div>
						)}

						<button 
							onClick={handlePlaceOrder}
							disabled={loading}
							className="w-full py-4 bg-light-blue hover:bg-blue-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-3"
						>
							{loading ? 'Placing Order...' : 'Place Order'}
						</button>

						<button 
							onClick={clear}
							className="w-full py-3 bg-gray-800/50 hover:bg-gray-700/50 text-white font-semibold rounded-xl transition-all"
						>
							Clear Cart
						</button>
					</div>
				</div>
			</div>
		</main>
	);
};

export default Cart;
