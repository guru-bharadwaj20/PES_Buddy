import React from 'react';
import { Link } from 'react-router-dom';

const AdminHome = () => {
	return (
		<main className="min-h-screen">
			{/* Hero Section */}
			<div className="relative overflow-hidden">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
					<div className="text-center">
						{/* Admin Badge */}
						<div className="inline-flex items-center px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full mb-6">
							<svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
							</svg>
							<span className="text-yellow-500 font-bold text-sm uppercase tracking-wider">Admin Portal</span>
						</div>

						<h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6">
							<span className="text-white">PES Buddy </span>
							<span className="text-yellow-500">Admin</span>
						</h1>
						<p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
							Administrative portal for managing campus services, users, and operations at PES University
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
							<Link 
								to="/admin/login" 
								className="px-8 py-4 bg-yellow-500 text-gray-900 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-lg hover:shadow-yellow-500/50 w-full sm:w-auto"
							>
								Admin Sign In →
							</Link>
							<Link 
								to="/admin/register" 
								className="px-8 py-4 bg-white text-gray-900 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg w-full sm:w-auto"
							>
								Register as Admin
							</Link>
						</div>
						
						{/* Back to Main Site Link */}
						<div className="mt-8">
							<Link 
								to="/" 
								className="text-gray-400 hover:text-white transition-colors inline-flex items-center"
							>
								<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
								</svg>
								Back to Main Site
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Admin Features Section */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<h2 className="text-3xl font-bold text-white text-center mb-12">Admin Capabilities</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* User Management Card */}
					<div className="glass rounded-2xl p-8 card-hover border border-yellow-500/20">
						<div className="text-5xl mb-4">👥</div>
						<h3 className="text-2xl font-bold text-white mb-4">User Management</h3>
						<p className="text-gray-300 mb-4">Manage all registered users and their activities</p>
						<ul className="space-y-2 text-gray-400">
							<li className="flex items-center">
								<span className="text-yellow-500 mr-2">•</span> View all users
							</li>
							<li className="flex items-center">
								<span className="text-yellow-500 mr-2">•</span> User statistics
							</li>
							<li className="flex items-center">
								<span className="text-yellow-500 mr-2">•</span> Activity monitoring
							</li>
							<li className="flex items-center">
								<span className="text-yellow-500 mr-2">•</span> Access control
							</li>
						</ul>
					</div>

					{/* Doormato Management Card */}
					<div className="glass rounded-2xl p-8 card-hover border border-yellow-500/20">
						<div className="text-5xl mb-4">🍔</div>
						<h3 className="text-2xl font-bold text-white mb-4">Doormato Control</h3>
						<p className="text-gray-300 mb-4">Manage canteen operations and food orders</p>
						<ul className="space-y-2 text-gray-400">
							<li className="flex items-center">
								<span className="text-yellow-500 mr-2">•</span> Order management
							</li>
							<li className="flex items-center">
								<span className="text-yellow-500 mr-2">•</span> Menu updates
							</li>
							<li className="flex items-center">
								<span className="text-yellow-500 mr-2">•</span> Real-time tracking
							</li>
							<li className="flex items-center">
								<span className="text-yellow-500 mr-2">•</span> Analytics & reports
							</li>
						</ul>
					</div>

					{/* Scootigo Management Card */}
					<div className="glass rounded-2xl p-8 card-hover border border-yellow-500/20">
						<div className="text-5xl mb-4">🛵</div>
						<h3 className="text-2xl font-bold text-white mb-4">Scootigo Control</h3>
						<p className="text-gray-300 mb-4">Oversee scooter bookings and availability</p>
						<ul className="space-y-2 text-gray-400">
							<li className="flex items-center">
								<span className="text-yellow-500 mr-2">•</span> Booking oversight
							</li>
							<li className="flex items-center">
								<span className="text-yellow-500 mr-2">•</span> Fleet management
							</li>
							<li className="flex items-center">
								<span className="text-yellow-500 mr-2">•</span> Route analytics
							</li>
							<li className="flex items-center">
								<span className="text-yellow-500 mr-2">•</span> Status monitoring
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Security Notice */}
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
				<div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
					<div className="flex items-start">
						<svg className="w-6 h-6 text-yellow-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
						</svg>
						<div>
							<h4 className="text-yellow-500 font-bold mb-2">Authorized Access Only</h4>
							<p className="text-gray-300 text-sm">
								This portal is restricted to authorized administrators only. All access attempts are logged and monitored. 
								Unauthorized access is strictly prohibited and will result in appropriate action.
							</p>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default AdminHome;
