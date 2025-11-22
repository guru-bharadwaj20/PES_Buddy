import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import doormatoService from '../../services/doormatoService';

const CanteenList = () => {
	const [canteens, setCanteens] = useState([]);

	useEffect(() => {
		doormatoService.getCanteens().then(setCanteens).catch(err => console.error(err));
	}, []);

	const canteenImages = {
		'SKM Canteen': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
		'GJBC Canteen': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
		'BE Block 13th Floor': 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop',
		'Hornbill Canteen': 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&h=600&fit=crop'
	};

	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div className="mb-8">
				<div className="flex justify-between items-center mb-3">
					<h2 className="text-4xl font-bold text-white">🍔 Doormato</h2>
					<Link 
						to="/doormato/my-orders"
						className="px-6 py-3 bg-light-blue hover:bg-blue-600 text-white font-bold rounded-lg transition-all flex items-center space-x-2"
					>
						<span>📦</span>
						<span>My Orders</span>
					</Link>
				</div>
				<p className="text-xl text-gray-300">Order delicious food from campus canteens</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{canteens.map(c => (
					<Link 
						key={c._id} 
						to={`/doormato/menu/${c._id}`}
						className="glass rounded-2xl overflow-hidden card-hover group"
					>
						<div className="relative h-48 overflow-hidden">
							<img 
								src={canteenImages[c.name] || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop'} 
								alt={c.name}
								className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
							/>
							<div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
							<div className="absolute bottom-4 left-4 right-4">
								<h3 className="text-2xl font-bold text-white mb-1">{c.name}</h3>
								<p className="text-gray-200 text-sm">{c.location}</p>
							</div>
						</div>
						<div className="p-6">
							<p className="text-gray-300 mb-4">{c.description}</p>
							<div className="flex items-center justify-between">
								<span className="text-light-blue font-semibold">View Menu →</span>
								<div className="flex items-center space-x-1">
									<svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
									<span className="text-white font-semibold">4.5</span>
								</div>
							</div>
						</div>
					</Link>
				))}
			</div>
		</main>
	);
};

export default CanteenList;
