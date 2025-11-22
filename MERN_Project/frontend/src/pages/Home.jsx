import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
	return (
		<main className="min-h-screen">
			{/* Hero Section */}
			<div className="relative overflow-hidden">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
					<div className="text-center">
						<h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6">
							<span className="text-white">PES </span>
							<span className="gradient-text">Buddy</span>
						</h1>
						<p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
							Your all-in-one campus companion for food ordering, scooter booking, and expense tracking at PES University
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
							<Link 
								to="/auth/login" 
								className="px-8 py-4 bg-light-blue text-white rounded-lg font-bold text-lg hover:bg-blue-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-light-blue/50 w-full sm:w-auto"
							>
								Sign In →
							</Link>
							<Link 
								to="/auth/register" 
								className="px-8 py-4 bg-white text-gray-900 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg w-full sm:w-auto"
							>
								Create Account
							</Link>
						</div>

						{/* Admin Portal Link */}
						<div className="mt-8">
							<Link 
								to="/admin" 
								className="inline-flex items-center px-6 py-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-500 hover:bg-yellow-500/30 font-semibold transition-all transform hover:scale-105"
							>
								<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
								</svg>
								Admin Portal
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* Doormato Card */}
					<div className="glass rounded-2xl p-8 card-hover">
						<div className="text-5xl mb-4">🍔</div>
						<h3 className="text-2xl font-bold text-white mb-4">PES Doormato</h3>
						<p className="text-gray-300 mb-4">Order delicious food from multiple campus canteens</p>
						<ul className="space-y-2 text-gray-400">
							<li className="flex items-center">
								<span className="text-light-blue mr-2">•</span> SKM Canteen
							</li>
							<li className="flex items-center">
								<span className="text-light-blue mr-2">•</span> GJBC Canteen
							</li>
							<li className="flex items-center">
								<span className="text-light-blue mr-2">•</span> BE Block 13th Floor
							</li>
							<li className="flex items-center">
								<span className="text-light-blue mr-2">•</span> Hornbill Canteen
							</li>
						</ul>
					</div>

					{/* Scootigo Card */}
					<div className="glass rounded-2xl p-8 card-hover">
						<div className="text-5xl mb-4">🛵</div>
						<h3 className="text-2xl font-bold text-white mb-4">PES Scootigo</h3>
						<p className="text-gray-300 mb-4">Book scooters for convenient campus travel</p>
						<ul className="space-y-2 text-gray-400">
							<li className="flex items-center">
								<span className="text-light-blue mr-2">•</span> GJBC ↔ OAT
							</li>
							<li className="flex items-center">
								<span className="text-light-blue mr-2">•</span> SKM ↔ BE Block
							</li>
							<li className="flex items-center">
								<span className="text-light-blue mr-2">•</span> MRD Block ↔ F Block
							</li>
							<li className="flex items-center">
								<span className="text-light-blue mr-2">•</span> Real-time tracking
							</li>
						</ul>
					</div>

					{/* Expense Tracker Card */}
					<div className="glass rounded-2xl p-8 card-hover">
						<div className="text-5xl mb-4">💰</div>
						<h3 className="text-2xl font-bold text-white mb-4">Expense Tracker</h3>
						<p className="text-gray-300 mb-4">Track your weekly expenses by category</p>
						<ul className="space-y-2 text-gray-400">
							<li className="flex items-center">
								<span className="text-light-blue mr-2">•</span> Food
							</li>
							<li className="flex items-center">
								<span className="text-light-blue mr-2">•</span> Travel
							</li>
							<li className="flex items-center">
								<span className="text-light-blue mr-2">•</span> Study Materials
							</li>
							<li className="flex items-center">
								<span className="text-light-blue mr-2">•</span> Smart budgeting
							</li>
						</ul>
					</div>
				</div>

				{/* Getting Started Section */}
				<div className="mt-16 glass rounded-2xl p-8 border border-light-blue/30">
					<h3 className="text-2xl font-bold text-white mb-4">🚀 Getting Started</h3>
					<p className="text-gray-300 mb-4">
						To access all features, please <span className="text-light-blue font-semibold">Register</span> or <span className="text-light-blue font-semibold">Login</span> using the buttons above.
					</p>
					<p className="text-gray-400">
						Your SRN serves as your unique identifier for all transactions and bookings.
					</p>
				</div>

				{/* Why PES Buddy Section */}
				<div className="mt-16">
					<h3 className="text-3xl font-bold text-white text-center mb-12">Why Choose PES Buddy?</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<div className="glass rounded-xl p-6 text-center">
							<div className="text-4xl mb-3">⚡</div>
							<h4 className="text-lg font-semibold text-white mb-2">Real-time Updates</h4>
							<p className="text-gray-400 text-sm">Live notifications and status tracking</p>
						</div>
						<div className="glass rounded-xl p-6 text-center">
							<div className="text-4xl mb-3">🍽️</div>
							<h4 className="text-lg font-semibold text-white mb-2">Multiple Canteens</h4>
							<p className="text-gray-400 text-sm">Order from all campus locations</p>
						</div>
						<div className="glass rounded-xl p-6 text-center">
							<div className="text-4xl mb-3">🎯</div>
							<h4 className="text-lg font-semibold text-white mb-2">Easy Booking</h4>
							<p className="text-gray-400 text-sm">Simple scooter reservation system</p>
						</div>
						<div className="glass rounded-xl p-6 text-center">
							<div className="text-4xl mb-3">📊</div>
							<h4 className="text-lg font-semibold text-white mb-2">Smart Expenses</h4>
							<p className="text-gray-400 text-sm">Track spending with weekly limits</p>
						</div>
						<div className="glass rounded-xl p-6 text-center">
							<div className="text-4xl mb-3">🔒</div>
							<h4 className="text-lg font-semibold text-white mb-2">Secure</h4>
							<p className="text-gray-400 text-sm">Protected authentication system</p>
						</div>
						<div className="glass rounded-xl p-6 text-center">
							<div className="text-4xl mb-3">💻</div>
							<h4 className="text-lg font-semibold text-white mb-2">User Friendly</h4>
							<p className="text-gray-400 text-sm">Intuitive and modern interface</p>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default Home;
