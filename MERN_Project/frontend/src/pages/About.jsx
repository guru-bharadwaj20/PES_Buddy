import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			{/* Hero Section */}
			<div className="mb-16 text-center">
				<h1 className="text-6xl font-bold text-white mb-6">About PES Buddy</h1>
				<p className="text-2xl text-gray-300 max-w-3xl mx-auto">
					Your all-in-one campus companion designed to simplify student life at PES University
				</p>
			</div>

			{/* Mission Statement */}
			<div className="glass rounded-3xl p-12 mb-12 border-2 border-light-blue/30">
				<h2 className="text-4xl font-bold text-white mb-6 text-center">Our Mission</h2>
				<p className="text-xl text-gray-300 text-center leading-relaxed">
					PES Buddy is designed to simplify campus life for PES University students by providing a unified platform 
					for three essential services: food delivery, scooter booking, and expense tracking.
				</p>
			</div>

			{/* Services Grid */}
			<div className="grid md:grid-cols-3 gap-8 mb-12">
				{/* Doormato */}
				<div className="glass rounded-2xl p-8 hover:border-light-blue/50 border-2 border-transparent transition-all">
					<div className="text-5xl mb-4">🍔</div>
					<h3 className="text-2xl font-bold text-white mb-4">PES Doormato</h3>
					<p className="text-gray-400 mb-4">Campus Food Delivery</p>
					<p className="text-gray-300 leading-relaxed">
						Connect with multiple campus canteens and order your favorite meals without standing in long queues.
					</p>
				</div>

				{/* Scootigo */}
				<div className="glass rounded-2xl p-8 hover:border-light-blue/50 border-2 border-transparent transition-all">
					<div className="text-5xl mb-4">🛵</div>
					<h3 className="text-2xl font-bold text-white mb-4">PES Scootigo</h3>
					<p className="text-gray-400 mb-4">Campus Scooter Booking</p>
					<p className="text-gray-300 leading-relaxed">
						Book scooters for convenient travel between different campus locations, saving time and energy.
					</p>
				</div>

				{/* Expense Tracker */}
				<div className="glass rounded-2xl p-8 hover:border-light-blue/50 border-2 border-transparent transition-all">
					<div className="text-5xl mb-4">💰</div>
					<h3 className="text-2xl font-bold text-white mb-4">Expense Tracker</h3>
					<p className="text-gray-400 mb-4">Smart Budget Management</p>
					<p className="text-gray-300 leading-relaxed">
						Monitor your weekly spending across different categories and stay within your budget effortlessly.
					</p>
				</div>
			</div>

			{/* Detailed Features */}
			<div className="space-y-8 mb-12">
				{/* Doormato Details */}
				<div className="glass rounded-2xl p-10">
					<div className="flex items-center space-x-4 mb-6">
						<div className="text-4xl">🍔</div>
						<h3 className="text-3xl font-bold text-white">PES Doormato Features</h3>
					</div>
					
					<div className="grid md:grid-cols-2 gap-8">
						<div>
							<h4 className="text-xl font-bold text-light-blue mb-4">Available Canteens</h4>
							<div className="space-y-3">
								<div className="flex items-start space-x-3">
									<span className="text-light-blue mt-1">•</span>
									<div>
										<p className="text-white font-semibold">SKM Canteen</p>
										<p className="text-gray-400 text-sm">Quick bites including Chicken Puffs, Samosa, Momos, Peri Peri Maggi, and Paneer Rolls</p>
									</div>
								</div>
								<div className="flex items-start space-x-3">
									<span className="text-light-blue mt-1">•</span>
									<div>
										<p className="text-white font-semibold">GJBC Canteen</p>
										<p className="text-gray-400 text-sm">South Indian specialties like Masala Dosa, Idli Vada, Poori Sagu, and Khara Bath</p>
									</div>
								</div>
								<div className="flex items-start space-x-3">
									<span className="text-light-blue mt-1">•</span>
									<div>
										<p className="text-white font-semibold">BE Block 13th Floor Canteen</p>
										<p className="text-gray-400 text-sm">Variety of meals and snacks</p>
									</div>
								</div>
								<div className="flex items-start space-x-3">
									<span className="text-light-blue mt-1">•</span>
									<div>
										<p className="text-white font-semibold">Hornbill Canteen</p>
										<p className="text-gray-400 text-sm">Popular campus food spot</p>
									</div>
								</div>
							</div>
						</div>
						
						<div>
							<h4 className="text-xl font-bold text-light-blue mb-4">Key Features</h4>
							<div className="space-y-3">
								{['Browse menus from multiple canteens', 'Real-time order notifications', 'Order history and tracking', 'Cart management across canteens'].map((feature, idx) => (
									<div key={idx} className="flex items-center space-x-3">
										<svg className="w-5 h-5 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
										</svg>
										<span className="text-gray-300">{feature}</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Scootigo Details */}
				<div className="glass rounded-2xl p-10">
					<div className="flex items-center space-x-4 mb-6">
						<div className="text-4xl">🛵</div>
						<h3 className="text-3xl font-bold text-white">PES Scootigo Features</h3>
					</div>
					
					<div className="grid md:grid-cols-2 gap-8">
						<div>
							<h4 className="text-xl font-bold text-light-blue mb-4">Popular Routes</h4>
							<div className="space-y-3">
								{[
									{ from: 'GJBC', to: 'OAT', distance: '2 km' },
									{ from: 'SKM', to: 'BE Block', distance: '3 km' },
									{ from: 'MRD Block', to: 'F Block', distance: '2 km' }
								].map((route, idx) => (
									<div key={idx} className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg">
										<span className="text-white font-semibold">{route.from} ↔ {route.to}</span>
										<span className="text-light-blue font-bold">{route.distance}</span>
									</div>
								))}
							</div>
						</div>
						
						<div>
							<h4 className="text-xl font-bold text-light-blue mb-4">Key Features</h4>
							<div className="space-y-3">
								{['View available scooters with driver details', 'Real-time availability updates', 'Automatic fare calculation', 'Multiple drivers with different rates', 'Instant booking confirmation'].map((feature, idx) => (
									<div key={idx} className="flex items-center space-x-3">
										<svg className="w-5 h-5 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
										</svg>
										<span className="text-gray-300">{feature}</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Expense Tracker Details */}
				<div className="glass rounded-2xl p-10">
					<div className="flex items-center space-x-4 mb-6">
						<div className="text-4xl">💰</div>
						<h3 className="text-3xl font-bold text-white">Expense Tracker Features</h3>
					</div>
					
					<div className="grid md:grid-cols-2 gap-8">
						<div>
							<h4 className="text-xl font-bold text-light-blue mb-4">Expense Categories</h4>
							<div className="space-y-3">
								{[
									{ name: 'Food', desc: 'Track your meal and snack expenses' },
									{ name: 'Travel', desc: 'Monitor transportation costs' },
									{ name: 'Study Materials', desc: 'Keep tabs on academic expenses' },
									{ name: 'Miscellaneous', desc: 'Other daily expenses' }
								].map((category, idx) => (
									<div key={idx} className="flex items-start space-x-3">
										<span className="text-light-blue mt-1">•</span>
										<div>
											<p className="text-white font-semibold">{category.name}</p>
											<p className="text-gray-400 text-sm">{category.desc}</p>
										</div>
									</div>
								))}
							</div>
						</div>
						
						<div>
							<h4 className="text-xl font-bold text-light-blue mb-4">Key Features</h4>
							<div className="space-y-3">
								{['Set weekly spending limits', 'Category-wise expense breakdown', 'Warnings when exceeding budget', 'Weekly expense summaries', 'Real-time expense notifications'].map((feature, idx) => (
									<div key={idx} className="flex items-center space-x-3">
										<svg className="w-5 h-5 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
										</svg>
										<span className="text-gray-300">{feature}</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Security & Tech Stack */}
			<div className="grid md:grid-cols-2 gap-8 mb-12">
				{/* Security */}
				<div className="glass rounded-2xl p-8">
					<div className="flex items-center space-x-3 mb-6">
						<div className="text-4xl">🔐</div>
						<h3 className="text-2xl font-bold text-white">Security & Privacy</h3>
					</div>
					<div className="space-y-3">
						{['Secure JWT-based authentication', 'SRN-based unique identification', 'Encrypted password storage', 'User-specific data isolation', 'Secure WebSocket connections'].map((item, idx) => (
							<div key={idx} className="flex items-center space-x-3">
								<svg className="w-5 h-5 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
								</svg>
								<span className="text-gray-300">{item}</span>
							</div>
						))}
					</div>
				</div>

				{/* Tech Stack */}
				<div className="glass rounded-2xl p-8 border-2 border-light-blue/30">
					<div className="flex items-center space-x-3 mb-6">
						<div className="text-4xl">⚡</div>
						<h3 className="text-2xl font-bold text-white">Technology Stack</h3>
					</div>
					<div className="space-y-3">
						{[
							{ label: 'Frontend', value: 'React 18, Vite, Socket.IO' },
							{ label: 'Backend', value: 'Node.js, Express' },
							{ label: 'Database', value: 'MongoDB' },
							{ label: 'Auth', value: 'JWT Tokens' },
							{ label: 'Real-time', value: 'WebSocket' }
						].map((tech, idx) => (
							<div key={idx} className="flex items-center justify-between">
								<span className="text-light-blue font-semibold">{tech.label}:</span>
								<span className="text-gray-300">{tech.value}</span>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Getting Started */}
			<div className="glass rounded-2xl p-10 mb-12">
				<h3 className="text-3xl font-bold text-white mb-6 text-center">Getting Started</h3>
				<div className="grid md:grid-cols-4 gap-6">
					{[
						{ num: '1', title: 'Register', desc: 'Click "Register" and enter your details using your PES SRN' },
						{ num: '2', title: 'Login', desc: 'Login with your credentials to access the platform' },
						{ num: '3', title: 'Explore', desc: 'Browse Doormato, Scootigo, and Expense Tracker' },
						{ num: '4', title: 'Enjoy', desc: 'Start ordering food, booking rides, and tracking expenses!' }
					].map((step, idx) => (
						<div key={idx} className="text-center">
							<div className="w-16 h-16 bg-light-blue rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
								{step.num}
							</div>
							<h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
							<p className="text-gray-400 text-sm">{step.desc}</p>
						</div>
					))}
				</div>
			</div>

			{/* CTA */}
			<div className="glass rounded-2xl p-12 text-center border-2 border-light-blue/50">
				<h3 className="text-3xl font-bold text-white mb-4">Need Help?</h3>
				<p className="text-xl text-gray-300 mb-6">
					Have questions or feedback? We'd love to hear from you!
				</p>
				<Link
					to="/contact"
					className="inline-block px-8 py-4 bg-light-blue hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg text-lg"
				>
					Contact Us
				</Link>
			</div>
		</main>
	);
};

export default About;
