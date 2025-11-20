import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import doormatoService from '../../services/doormatoService';
import { CartContext } from '../../context/CartContext';

const Menu = () => {
	const { canteenId } = useParams();
	const [items, setItems] = useState([]);
	const [canteen, setCanteen] = useState(null);
	const [loading, setLoading] = useState(true);
	const { addItem, items: cartItems } = useContext(CartContext);
	const navigate = useNavigate();

	useEffect(() => {
		Promise.all([
			doormatoService.getMenu(canteenId),
			doormatoService.getCanteens()
		])
		.then(([menuItems, canteens]) => {
			setItems(menuItems);
			setCanteen(canteens.find(c => c._id === canteenId));
			setLoading(false);
		})
		.catch(err => {
			console.error(err);
			setLoading(false);
		});
	}, [canteenId]);

	const handleAddToCart = (item) => {
		addItem({ 
			menuItem: item._id, 
			name: item.name, 
			price: item.price,
			canteenName: canteen?.name || '',
			image: item.image
		});
	};

	const isInCart = (itemId) => {
		return cartItems.some(item => item.menuItem === itemId);
	};

	if (loading) {
		return (
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="text-center text-white">Loading menu...</div>
			</main>
		);
	}

	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			{/* Header */}
			<div className="mb-8">
				<button 
					onClick={() => navigate('/doormato')}
					className="text-light-blue hover:text-blue-400 mb-4 flex items-center space-x-2"
				>
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
					</svg>
					<span>Back to Canteens</span>
				</button>
				<h2 className="text-4xl font-bold text-white mb-3">{canteen?.name}</h2>
				<p className="text-xl text-gray-300">{canteen?.description}</p>
			</div>

			{/* Menu Items Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{items.map(item => (
					<div key={item._id} className="glass rounded-2xl overflow-hidden card-hover">
						{/* Food Image */}
						<div className="relative h-48 overflow-hidden">
							<img 
								src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'} 
								alt={item.name}
								className="w-full h-full object-cover"
							/>
							{item.category && (
								<div className="absolute top-3 left-3">
									<span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
										{item.category}
									</span>
								</div>
							)}
						</div>

						{/* Item Details */}
						<div className="p-5">
							<div className="mb-3">
								<h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
								<p className="text-gray-400 text-sm">{item.description}</p>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<span className="text-2xl font-bold text-white">₹{item.price}</span>
									<div className="flex items-center space-x-1">
										<svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
										<span className="text-gray-300 text-sm">4.3</span>
									</div>
								</div>
								
								<button 
									onClick={() => handleAddToCart(item)}
									className={`px-4 py-2 rounded-lg font-semibold transition-all ${
										isInCart(item._id)
											? 'bg-green-600 text-white'
											: 'bg-light-blue hover:bg-blue-600 text-white'
									}`}
								>
									{isInCart(item._id) ? (
										<span className="flex items-center space-x-1">
											<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
												<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
											</svg>
											<span>Added</span>
										</span>
									) : (
										'Add to Cart'
									)}
								</button>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Floating Cart Button */}
			{cartItems.length > 0 && (
				<Link
					to="/doormato/cart"
					className="fixed bottom-8 right-8 bg-light-blue hover:bg-blue-600 text-white px-6 py-4 rounded-full shadow-2xl flex items-center space-x-3 transition-all transform hover:scale-105"
				>
					<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
					</svg>
					<span className="font-bold">View Cart ({cartItems.length})</span>
				</Link>
			)}
		</main>
	);
};

export default Menu;
